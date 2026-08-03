import React from "react";
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
import { twMerge } from "tailwind-merge";
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import organizationApi from "@/api/organization/organizationApi";

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
        router.push("/organization/status");
    };

    const onSubmit = async (data: JoinFormInput) => {
        try {
            await organizationApi.joinOrganization({ inviteCode: data.inviteCode });

            Alert.alert("🎉 가입 신청 완료!", "단체 가입 신청 완료", [
                {
                    onPress: () => router.replace("/organization/status"),
                },
            ]);
        } catch (error: any) {
            console.log(error);
            setError("root", {
                message: error.response?.data?.message || "올바르지 않은 초대코드입니다.",
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

                        {errors.root?.message && (
                            <ErrorMessage className="mt-2 self-center">
                                {errors.root?.message}
                            </ErrorMessage>
                        )}

                        <Button
                            disabled={!isFilled}
                            isLoading={isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className="h-[60px] mt-24"
                            textClassName="text-2xl">
                            단체 가입
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
