import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { Ionicons } from "@expo/vector-icons";

interface JoinFormInput {
    inviteCode: string;
}

export default function OrganizationJoinPage() {
    const router = useRouter();

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<JoinFormInput>({
        defaultValues: {
            inviteCode: "",
        },
    });

    const inviteCode = useWatch({ control, name: "inviteCode" });
    const isFilled = Boolean(inviteCode?.trim());

    const handleGoBack = () => {
        router.push("/organization");
    };

    const onSubmit = async (data: JoinFormInput) => {
        try {
            console.log("초대코드 제출:", data.inviteCode);

            router.replace("/");
        } catch (error) {
            console.log(error);
            setError("root", { message: "올바르지 않은 초대코드입니다." });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper items-center">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="w-full bg-background-paper">
                <View className="flex-1 justify-between pb-8">
                    <View className="h-[80px] bg-text-light justify-center">
                        <View className="flex-row items-center px-5 py-3 gap-2">
                            <Pressable
                                onPress={handleGoBack}
                                className="p-2 -ml-2 active:opacity-70 cursor-pointer">
                                <Ionicons name="chevron-back-outline" size={24} color="#111827" />
                            </Pressable>
                            <Text className="text-text-default font-pretendard-bold text-2xl">
                                단체 가입 초대코드
                            </Text>
                        </View>
                    </View>

                    <View className="px-6 items-center my-auto">
                        <Text className="text-2xl font-pretendard-bold text-text-default mb-4">
                            초대코드 입력
                        </Text>

                        <Controller
                            control={control}
                            name="inviteCode"
                            rules={{ required: "초대코드를 입력해 주세요." }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <View className="w-full">
                                    <TextInput
                                        value={value}
                                        onChangeText={text => onChange(text.toUpperCase())}
                                        onBlur={onBlur}
                                        placeholder="초대코드를 입력하세요"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="characters"
                                        className="w-full h-[88px] border-[1.5px] mb-12 border-primary-main rounded-2xl px-4 text-center font-pretendard-bold text-xl text-text-default bg-white"
                                    />
                                </View>
                            )}
                        />

                        {/* 에러 메시지 */}
                        {errors.root?.message && (
                            <ErrorMessage className="mt-2 self-center">
                                {errors.root?.message}
                            </ErrorMessage>
                        )}

                        {/* 가입하기 버튼 */}
                        <Pressable
                            disabled={!isFilled || isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className={twMerge(
                                "w-full h-[60px] rounded-2xl items-center justify-center mt-6 transition-colors duration-200",
                                // 입력 안 되었을 때 (비활성화 상태)
                                "bg-background-deep border-2 border-text-secondary cursor-not-allowed",
                                // 입력 완료되었을 때 (활성화 상태)
                                isFilled &&
                                    "bg-primary-main border-primary-main hover:bg-primary-hover active:bg-primary-hover cursor-pointer border-0",
                            )}>
                            <Text
                                className={twMerge(
                                    "font-pretendard-bold text-2xl text-text-secondary",
                                    isFilled && "text-background-paper",
                                )}>
                                단체 가입
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
