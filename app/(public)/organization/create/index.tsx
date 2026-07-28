import React, { useState } from "react";
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

interface CreateOrganizationFormInput {
    name: string;
    description?: string;
    logoUrl?: string;
}

export default function OrganizationCreatePage() {
    const router = useRouter();

    // 소개글 높이 동적 관리 (기본 최소 높이: 60)
    const [descriptionHeight, setDescriptionHeight] = useState(60);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CreateOrganizationFormInput>({
        defaultValues: {
            name: "",
            description: "",
            logoUrl: "",
        },
    });

    const nameValue = useWatch({ control, name: "name" });
    const isFilled = Boolean(nameValue?.trim());

    // 💡 /organization 화면으로 확실하게 이동하는 핸들러
    const handleGoBack = () => {
        router.push("/organization");
    };

    const onSubmit = async (data: CreateOrganizationFormInput) => {
        try {
            console.log("단체 생성 데이터:", data);

            // TODO: 단체 생성 API 연동
            router.replace("/");
        } catch (error) {
            console.log(error);
            setError("root", { message: "이미 존재하는 조직명입니다." });
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
                    {/* 1. 상단 타이틀 헤더 바 */}
                    <View className="h-[80px] bg-text-light justify-center border-b border-gray-100">
                        <View className="flex-row items-center px-5 py-3 gap-2">
                            {/* 📌 뒤로가기 버튼 수정: 터치 영역 확보 및 /organization 이동 */}
                            <Pressable
                                onPress={handleGoBack}
                                className="p-2 -ml-2 active:opacity-70 cursor-pointer">
                                <Ionicons name="chevron-back-outline" size={24} color="#111827" />
                            </Pressable>
                            <Text className="text-text-default font-pretendard-bold text-2xl">
                                단체생성
                            </Text>
                        </View>
                    </View>

                    {/* 2. 폼 입력 영역 */}
                    <View className="px-6 my-auto space-y-5">
                        {/* 1) 조직명 */}
                        <View>
                            <Text className="text-base font-pretendard-semibold text-secondary-main mb-2">
                                조직명
                            </Text>
                            <Controller
                                control={control}
                                name="name"
                                rules={{ required: "조직명을 입력해주세요." }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="조직명을 입력해주세요."
                                        placeholderTextColor="#9CA3AF"
                                        className="w-full h-[60px] border-[1.5px] border-secondary-main rounded-2xl px-4 font-pretendard-medium text-base text-text-default bg-white"
                                    />
                                )}
                            />
                            {errors.name?.message && (
                                <ErrorMessage className="mt-1.5">
                                    {errors.name.message}
                                </ErrorMessage>
                            )}
                        </View>

                        {/* 2) 소개글 (가변 높이 TextInput) */}
                        <View className="mt-4">
                            <Text className="text-base font-pretendard-semibold text-secondary-main mb-2">
                                소개글
                            </Text>
                            <Controller
                                control={control}
                                name="description"
                                rules={{
                                    maxLength: {
                                        value: 500,
                                        message: "소개글은 최대 500자 입니다.",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="소개글을 입력해주세요."
                                        placeholderTextColor="#9CA3AF"
                                        multiline
                                        textAlignVertical="top"
                                        onContentSizeChange={e => {
                                            const contentHeight = e.nativeEvent.contentSize.height;
                                            setDescriptionHeight(Math.max(60, contentHeight));
                                        }}
                                        style={{ height: descriptionHeight }}
                                        className="w-full min-h-[60px] border-[1.5px] border-secondary-main rounded-2xl p-4 font-pretendard-medium text-base text-text-default bg-white transition-all duration-150"
                                    />
                                )}
                            />
                            {errors.description?.message && (
                                <ErrorMessage className="mt-1.5">
                                    {errors.description.message}
                                </ErrorMessage>
                            )}
                        </View>

                        {/* 3) 로고 URL */}
                        <View className="mt-4">
                            <Text className="text-base font-pretendard-semibold text-secondary-main mb-2">
                                로고 URL
                            </Text>
                            <Controller
                                control={control}
                                name="logoUrl"
                                rules={{
                                    pattern: {
                                        value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                                        message: "유효한 URL 형식이 아닙니다.",
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="조직 로고 링크를 연결해주세요"
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        keyboardType="url"
                                        className="w-full h-[60px] border-[1.5px] border-secondary-main rounded-2xl px-4 font-pretendard-medium text-base text-text-default bg-white"
                                    />
                                )}
                            />
                            {errors.logoUrl?.message && (
                                <ErrorMessage className="mt-1.5">
                                    {errors.logoUrl.message}
                                </ErrorMessage>
                            )}
                        </View>

                        {/* 서버 루트 에러 메시지 */}
                        {errors.root?.message && (
                            <ErrorMessage className="mt-3 self-center">
                                {errors.root?.message}
                            </ErrorMessage>
                        )}

                        {/* 단체 생성 버튼 */}
                        <Pressable
                            disabled={!isFilled || isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className={twMerge(
                                "w-full h-[60px] rounded-2xl items-center justify-center mt-8 transition-colors duration-200",
                                // 비활성화 상태
                                "bg-background-deep border-2 border-text-secondary cursor-not-allowed",
                                // 활성화 상태
                                isFilled &&
                                    "bg-primary-main border-primary-main hover:bg-primary-hover active:bg-primary-hover cursor-pointer border-0",
                            )}>
                            <Text
                                className={twMerge(
                                    "font-pretendard-bold text-2xl text-text-secondary",
                                    isFilled && "text-background-paper",
                                )}>
                                단체 생성
                            </Text>
                        </Pressable>
                    </View>

                    {/* 3. 푸터 */}
                    <Text className="text-text-secondary text-center text-xs mt-4">
                        © 2026 Invento
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
