import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
    Alert,
} from "react-native";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useRouter } from "expo-router";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import organizationApi from "@/api/organization/organizationApi";

interface CreateOrganizationFormInput {
    name: string;
    description?: string;
    logoUrl?: string;
}

export default function OrganizationCreatePage() {
    const router = useRouter();
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

    const handleGoBack = () => {
        router.push("/organization/status");
    };

    const onSubmit = async (data: CreateOrganizationFormInput) => {
        try {
            const generatedInviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

            const payload = {
                ...data,
                inviteCode: generatedInviteCode,
            };

            const newOrg = await organizationApi.createOrganization(payload);

            Alert.alert("🎉 단체 생성 완료!", `초대 코드: ${newOrg.inviteCode}`, [
                {
                    text: "확인",
                    onPress: () => router.replace("/manager"),
                },
            ]);
        } catch (error: any) {
            console.log(error);
            setError("root", {
                message: error.response?.data?.message || "조직 생성에 실패했습니다.",
            });
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper items-center">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                className="w-full bg-background-paper">
                <View className="justify-between ">
                    <View className="h-[88px] bg-text-light justify-center mb-3.5">
                        <View className="flex-row items-center px-5 py-3 gap-2">
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

                    <View className="px-6 gap-y-6">
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

                        {errors.root?.message && (
                            <ErrorMessage className="mt-3 self-center">
                                {errors.root?.message}
                            </ErrorMessage>
                        )}

                        <Button
                            disabled={!isFilled}
                            isLoading={isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className="h-[60px] mt-24"
                            textClassName="text-2xl">
                            단체 생성
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
