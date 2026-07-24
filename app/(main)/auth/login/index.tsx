import { Link, useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginInputType, loginSchema } from "@/schemas/user/loginUserSchema";
import { isAxiosError } from "axios";
import userApi from "@/api/user/userApi";
import { Image, KeyboardAvoidingView, Pressable, ScrollView, Text, View } from "react-native";
import { twMerge } from "tailwind-merge";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { useUserStore } from "@/stores/user/useUserStore";
import { useState } from "react";
import ExpoSecureStore from "expo-secure-store/src/ExpoSecureStore";

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
                await ExpoSecureStore.setItem("accessToken", result.token);
            }
            login({ user: result.user, memberInfo: result.memberInfo ?? null }, result.token);
            router.replace("/");
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
        <KeyboardAvoidingView>
            <ScrollView>
                <View>
                    <View className={"h-[100px] bg-primary-main items-center"}>
                        <View className={"flex-row mt-4"}>
                            <Image
                                source={require("@/assets/images/common/box.png")}
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

                    <View className={"mx-5 mt-[42px]"}>
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
                                로그인
                            </Text>
                        </Pressable>
                    </View>

                    <View className="mt-5 flex-row items-center justify-center gap-2">
                        <Text className="text-text-secondary font-pretendard">
                            아직 계정이 없으신가요?
                        </Text>
                        <Link href={"/"}>
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
