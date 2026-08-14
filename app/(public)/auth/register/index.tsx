import { Link, useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignupInputSchema, UserSignupInputType } from "@/schemas/user/registerUserSchema";
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
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";

function AuthRegisterPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(userSignupInputSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        },
    });

    const { email, password, confirmPassword, name } = useWatch({
        control,
    });

    const isFilled = Boolean(
        email?.trim() && password?.trim() && confirmPassword?.trim() && name?.trim(),
    );

    const onSubmit = async (data: UserSignupInputType) => {
        try {
            const { confirmPassword, ...submitData } = data;

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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className={"flex-1 bg-background-paper"}>
            <ScrollView keyboardShouldPersistTaps={"handled"}>
                <View>
                    <View className={"h-[80px] bg-text-light justify-center"}>
                        <View className={"flex-row items-center px-5 py-3 gap-2"}>
                            <Pressable onPress={() => router.back()}>
                                <Ionicons name={"chevron-back-outline"} size={24} />
                            </Pressable>
                            <Text className={"text-text-default font-pretendard-bold text-2xl"}>
                                회원가입
                            </Text>
                        </View>
                    </View>
                    <View className={"justify-center items-center flex-row gap-1"}>
                        <Image
                            source={require("@/assets/images/common/box.png")}
                            style={{
                                width: 55,
                                height: 68,
                                tintColor: "#7C3AED",
                            }}
                            resizeMode={"contain"}
                        />
                        <Text className={"text-3xl font-pretendard-bold text-primary-main ml-2"}>
                            Invento
                        </Text>
                    </View>
                    <View className={"mt-3 mx-5"}>
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
                            name={"password"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"비밀번호"}
                                        placeholder={"비밀번호를 입력해주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"6자 이상 입력해 주세요."}
                                        errorMessage={errors.password?.message}
                                        isPassword={true}
                                    />
                                );
                            }}
                        />
                        <Controller
                            control={control}
                            name={"confirmPassword"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"비밀번호 확인"}
                                        placeholder={"비밀번호를 다시 입력해주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"6자 이상 입력해 주세요."}
                                        errorMessage={errors.confirmPassword?.message}
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
                        <Button
                            disabled={!isFilled}
                            isLoading={isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className="h-[60px] mt-14"
                            textClassName="text-2xl">
                            회원가입
                        </Button>
                    </View>

                    <View className="mt-5 flex-row items-center justify-center gap-2">
                        <Text className="text-text-secondary font-pretendard">
                            이미 등록하셨나요?
                        </Text>
                        <Link href={"/auth/login"}>
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
