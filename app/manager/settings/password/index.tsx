import { Alert, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";

import MainHeader from "@/components/layout/MainHeader";
import Button from "@/components/common/Button/Button";
import InputGroup from "@/components/common/input/InputGroup";
import ErrorMessage from "@/components/common/form/ErrorMessage";

import { UpdatePasswordInputType, updatePasswordSchema } from "@/schemas/user/updatePasswordSchema";

import userApi from "@/api/user/userApi";

function ManagerUpdatePasswordPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<UpdatePasswordInputType>({
        resolver: zodResolver(updatePasswordSchema),
        mode: "onTouched",
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const currentPassword = useWatch({
        control,
        name: "currentPassword",
    });

    const newPassword = useWatch({
        control,
        name: "newPassword",
    });

    const confirmPassword = useWatch({
        control,
        name: "confirmPassword",
    });

    const isFilled = Boolean(
        currentPassword?.trim() && newPassword?.trim() && confirmPassword?.trim(),
    );

    const onSubmit = async (data: UpdatePasswordInputType) => {
        try {
            await userApi.updatePassword(data);

            if (Platform.OS === "web") {
                window.alert("비밀번호가 성공적으로 변경되었습니다.");
                router.back();
                return;
            }

            Alert.alert("성공", "비밀번호가 성공적으로 변경되었습니다.", [
                {
                    text: "확인",
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.log(error);

            let errorMessage = "비밀번호 변경 중 오류가 발생했습니다.";

            if (isAxiosError(error)) {
                errorMessage = error.response?.data?.message ?? errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", {
                type: "server",
                message: errorMessage,
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className={"flex-1 bg-background-paper"}>
            <View className={"flex-1"}>
                <MainHeader title={"비밀번호 변경"} isBackPress />

                <ScrollView
                    className={"flex-1"}
                    contentContainerClassName={"flex-grow"}
                    keyboardShouldPersistTaps={"handled"}>
                    <View className={"mx-5 mt-10"}>
                        <Controller
                            control={control}
                            name={"currentPassword"}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label={"기존 비밀번호"}
                                    placeholder={"기존 비밀번호를 입력해 주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    infoMessage={""}
                                    errorMessage={errors.currentPassword?.message}
                                    isPassword
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name={"newPassword"}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label={"새 비밀번호"}
                                    placeholder={"새 비밀번호를 입력해 주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    infoMessage={"영문, 숫자를 포함하여 6자 이상 입력해 주세요."}
                                    errorMessage={errors.newPassword?.message}
                                    isPassword
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name={"confirmPassword"}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <InputGroup
                                    label={"새 비밀번호 확인"}
                                    placeholder={"새 비밀번호를 다시 입력해 주세요."}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    infoMessage={""}
                                    errorMessage={errors.confirmPassword?.message}
                                    isPassword
                                />
                            )}
                        />

                        {errors.root?.message && (
                            <ErrorMessage className={"self-center mt-2"}>
                                {errors.root.message}
                            </ErrorMessage>
                        )}

                        <Button
                            disabled={!isFilled}
                            isLoading={isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className={"h-[60px] mt-10 mb-10"}
                            textClassName={"text-2xl"}>
                            변경하기
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

export default ManagerUpdatePasswordPage;
