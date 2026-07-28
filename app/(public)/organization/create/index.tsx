import React, { useState } from "react";
import {
    Image,
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

interface CreateOrganizationFormInput {
    name: string;
    description?: string;
    logoUrl?: string;
}

export default function OrganizationCreatePage() {
    const router = useRouter();

    // 💡 소개글 높이를 동적으로 관리하는 State (기본 최소 높이: 120)
    const [descriptionHeight, setDescriptionHeight] = useState(120);

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

    const onSubmit = async (data: CreateOrganizationFormInput) => {
        try {
            console.log("단체 생성 데이터:", data);

            router.replace("/");
        } catch (error) {
            console.log(error);
            setError("root", { message: "이미 존재하는 조직명입니다." });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-default items-center">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="w-full max-w-[440px] bg-white">
                <View className="flex-1 justify-between pb-6">
                    <View className="h-[100px] bg-secondary-main items-center justify-center pt-2">
                        <View className="flex-row items-center">
                            <Image
                                source={require("@/assets/images/common/box.png")}
                                style={{ width: 32, height: 32, tintColor: "#FFFFFF" }}
                                resizeMode="contain"
                            />
                            <Text className="text-3xl font-pretendard-extrabold text-white ml-2">
                                Invento
                            </Text>
                        </View>
                        <View className="w-[180px] h-[1.5px] bg-white opacity-80 mt-1 mb-1" />
                        <Text className="text-xs font-pretendard-medium text-white opacity-90">
                            단체 비품을 스마트하게 관리하세요!
                        </Text>
                    </View>

                    <View className="px-6 my-6 space-y-5">
                        <View>
                            <Text className="text-sm font-pretendard-bold text-primary-main mb-1.5">
                                조직명 (필수)
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
                                        className="w-full h-12 border-2 border-primary-main rounded-2xl px-4 font-pretendard-medium text-base text-text-default bg-white"
                                    />
                                )}
                            />
                            {errors.name?.message && (
                                <ErrorMessage className="mt-1">{errors.name.message}</ErrorMessage>
                            )}
                        </View>

                        {/* 📌 동적 높이 증가 적용 부분 */}
                        <View className="mt-4">
                            <Text className="text-sm font-pretendard-bold text-primary-main mb-1.5">
                                소개글 (선택)
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
                                        // 💡 텍스트 줄 수 증가 시 동적으로 높이 변경 (최소 120px)
                                        onContentSizeChange={e => {
                                            const contentHeight = e.nativeEvent.contentSize.height;
                                            setDescriptionHeight(Math.max(120, contentHeight));
                                        }}
                                        style={{ height: descriptionHeight }}
                                        className="w-full border-2 border-primary-main rounded-2xl p-4 font-pretendard-medium text-base text-text-default bg-white transition-all duration-150"
                                    />
                                )}
                            />
                            {errors.description?.message ? (
                                <ErrorMessage className="mt-1">
                                    {errors.description.message}
                                </ErrorMessage>
                            ) : (
                                <Text className="text-xs font-pretendard text-error-main mt-1">
                                    소개글은 최대 500자 입니다.
                                </Text>
                            )}
                        </View>

                        <View className="mt-4">
                            <Text className="text-sm font-pretendard-bold text-primary-main mb-1.5">
                                로고 URL (선택)
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
                                        placeholder="조직 로고 링크를 연결해주세요."
                                        placeholderTextColor="#9CA3AF"
                                        autoCapitalize="none"
                                        keyboardType="url"
                                        className="w-full h-12 border-2 border-primary-main rounded-2xl px-4 font-pretendard-medium text-base text-text-default bg-white"
                                    />
                                )}
                            />
                            {errors.logoUrl?.message && (
                                <ErrorMessage className="mt-1">
                                    {errors.logoUrl.message}
                                </ErrorMessage>
                            )}
                        </View>

                        {errors.root?.message && (
                            <ErrorMessage className="mt-2 self-center">
                                {errors.root?.message}
                            </ErrorMessage>
                        )}

                        <Pressable
                            disabled={!isFilled || isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className={twMerge(
                                "w-full h-14 rounded-2xl items-center justify-center mt-6 transition-colors duration-200",
                                "bg-background-deep cursor-not-allowed border-2 border-gray-300",
                                isFilled &&
                                    "bg-secondary-main hover:bg-secondary-hover active:bg-secondary-hover cursor-pointer border-0",
                            )}>
                            <Text
                                className={twMerge(
                                    "font-pretendard-bold text-xl text-text-secondary",
                                    isFilled && "text-text-light",
                                )}>
                                단체 만들기
                            </Text>
                        </Pressable>
                    </View>

                    <Text className="text-secondary-main text-center text-xs mt-4">
                        © 2026 Invento
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
