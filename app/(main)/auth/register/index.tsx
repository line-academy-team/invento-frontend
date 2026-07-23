import { Link, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserSignupInputType, userSignupSchema} from "@/schemas/user/registerUserSchema";
import { Controller, useForm, useWatch } from "react-hook-form";
import userApi from "@/api/user/userApi";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    View,
} from "react-native";
import { isAxiosError } from "axios";
import { twMerge } from "tailwind-merge";
import InputGroup from "@/components/common/input/InputGroup";

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

    const isFilled = Boolean(
        email?.trim() && passwordHash?.trim() && name?.trim(),
    );

    const onSubmit = async (data: UserSignupInputType) => {
        try {
            const { ...submitData } = data;

            await userApi.registerUser(submitData);

            if (Platform.OS === "web") {
                window.alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
                router.push("/auth/login");
            } else {
                Alert.alert("가입 완료", "회원가입이 완료되었습니다. 로그인을 진행해주세요", [
                    { text: "확인", onPress: () => router.push("/auth/login") },
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

                    <View className={"mx-5"}>
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
                                        infoMessage={"example@email.com"}
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
                    </View>

                    <View className="mt-5 flex-row items-center justify-center gap-2">
                        <Text className="text-brand-txt-sub font-pretendard-semibold">
                            이미 등록하셨나요?
                        </Text>
                        <Link href={"/auth/login"}>
                            <Text className="text-brand-primary font-pretendard-semibold">
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
