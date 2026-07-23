import { Link, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignupInputType, userSignupSchema } from "@/schemas/user/registerUserSchema";
import { Controller, useForm, useWatch } from "react-hook-form";
import userApi from "@/api/user/userApi";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
    Image,
} from "react-native";
import { isAxiosError } from "axios";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { twMerge } from "tailwind-merge";

function AuthRegisterPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userSignupSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            passwordHash: "",
            name: "",
        },
    });

    const { email, passwordHash, name } = useWatch({
        control,
    });

    const isFilled = Boolean(email?.trim() && passwordHash?.trim() && name?.trim());

    const onSubmit = async (data: UserSignupInputType) => {
        try {
            const { ...submitData } = data;

            await userApi.registerUser(submitData);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/");
            } else {
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요", [
                    { text: "확인", onPress: () => router.push("/") },
                ]);
            }
        } catch (error) {
            console.log(error);
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    };
    return (
        <KeyboardAvoidingView>
            <ScrollView>
                <View>
                    <View className={"h-[100px] bg-primary-main items-center"}>
                        <View className={"flex-row mt-4"}>
                            <Image
                                source={require("@/assets/images/register/box.png")}
                                style={{
                                    width: 36,
                                    height: 36,
                                }}
                            />
                            <Text
                                className={
                                    "text-4xl font-pretendard-bold text-background-paper ml-2"
                                }>
                                Invento
                            </Text>
                        </View>
                        <hr
                            className="w-[212px] bg-background-paper mt-2"
                            style={{
                                border: 0,
                                height: 2,
                            }}
                        />
                        <Text className={"mt-1 font-pretendard-semibold text-background-paper"}>
                            단체 비품을 스마트하게 관리하세요!
                        </Text>
                    </View>
                    <View className={"mt-10 mx-5"}>
                        <Controller
                            control={control}
                            name={"email"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"이메일"}
                                        placeholder={"이메일을 입력해주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"example@email.com 형식으로 입력해주세요."}
                                        errorMessage={errors.email?.message}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"passwordHash"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"비밀번호"}
                                        placeholder={"비밀번호를 입력해주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"6자 이상 입력해 주세요."}
                                        errorMessage={errors.passwordHash?.message}
                                        isPassword={true}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"name"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"이름"}
                                        placeholder={"이름을 입력해주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"40자 이하로 입력해 주세요."}
                                        errorMessage={errors.name?.message}
                                    />
                                );
                            }}
                        />

                        {errors.root?.message && (
                            <ErrorMessage className={"mt-4 self-center"}>
                                {errors.root.message}
                            </ErrorMessage>
                        )}
                        <Pressable
                            disabled={!isFilled || isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className={twMerge(
                                "flex justify-center items-center mt-6",
                                "w-full h-[60px] rounded-2xl border-2 border-text-secondary",
                                "bg-background-deep",
                                isFilled && "bg-primary-main",
                            )}>
                            <Text
                                className={twMerge(
                                    "text-2xl text-text-secondary font-pretendard-bold",
                                    isFilled && "text-background-paper",
                                )}>
                                회원가입
                            </Text>
                        </Pressable>
                    </View>

                    <View className="mt-5 flex-row items-center justify-center gap-2">
                        <Text className="text-text-secondary font-pretendard">
                            이미 등록하셨나요?
                        </Text>
                        <Link href={"/"}>
                            <Text className="text-secondary-main font-pretendard underline">
                                로그인
                            </Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthRegisterPage;
