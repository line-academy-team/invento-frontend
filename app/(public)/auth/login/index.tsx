import { Link, useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputType, loginSchema } from "@/schemas/user/loginUserSchema";
import { isAxiosError } from "axios";
import userApi from "@/api/user/userApi";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { useUserStore } from "@/stores/user/useUserStore";
import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";

function AuthLoginPage() {
    const router = useRouter();
    const { login } = useUserStore();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { email, password } = useWatch({
        control,
    });

    const [checked, setChecked] = useState(false);

    const isFilled = Boolean(email?.trim() && password?.trim());

    const onSubmit = async (data: LoginInputType) => {
        try {
            const result = await userApi.login(data);

            if (checked) {
                if (Platform.OS === "web") {
                    localStorage.setItem("accessToken", result.token);
                } else {
                    await SecureStore.setItemAsync("accessToken", result.token);
                }
            }

            login(
                {
                    user: result.user,
                    memberInfo: result.memberInfo ?? null,
                },
                result.token,
            );

            if (result.memberInfo === null) {
                router.push("/organization/status");
                return;
            }
            console.log(result);
            if (["MANAGER", "OWNER"].includes(result.memberInfo.role)) {
                router.push("/manager");
            } else {
                router.push("/user");
            }
        } catch (error) {
            console.log(error);
            let errorMessage = "로그인 중 오류가 발생했습니다.";

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
                                로그인
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

                    <View className={"mx-5 mt-3"}>
                        <Controller
                            control={control}
                            name={"email"}
                            render={({ field: { onChange, onBlur, value } }) => {
                                return (
                                    <InputGroup
                                        label={"이메일"}
                                        placeholder={"이메일을 입력해 주세요"}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={"정확한 이메일 주소를 입력해 주세요."}
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
                                        placeholder={"비밀번호를 입력해 주세요."}
                                        onBlur={onBlur}
                                        onChangeText={onChange}
                                        value={value}
                                        infoMessage={""}
                                        errorMessage={errors.password?.message}
                                        isPassword
                                    />
                                );
                            }}
                        />

                        <View className={"flex-row items-center mt-3 gap-1.5"}>
                            <Pressable
                                onPress={() => {
                                    setChecked(!checked);
                                }}>
                                <Image
                                    source={
                                        checked
                                            ? require("@/assets/images/auth/check.png")
                                            : require("@/assets/images/auth/check_off.png")
                                    }
                                    resizeMode="contain"
                                    style={{ width: 20, height: 20 }}
                                />
                            </Pressable>
                            <Text className={"text-text-secondary font-pretendard"}>
                                로그인 상태 유지
                            </Text>
                        </View>

                        {errors.root?.message && (
                            <ErrorMessage className={"self-center"}>
                                {errors.root?.message}
                            </ErrorMessage>
                        )}
                        <Button
                            disabled={!isFilled}
                            isLoading={isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className="h-[60px] mt-20"
                            textClassName="text-2xl">
                            로그인
                        </Button>
                    </View>

                    <View className="mt-5 flex-row items-center justify-center gap-2">
                        <Text className="text-text-secondary font-pretendard">
                            아직 계정이 없으신가요?
                        </Text>
                        <Link href={"/auth/register"}>
                            <Text className="text-secondary-main font-pretendard underline">
                                회원가입
                            </Text>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default AuthLoginPage;
