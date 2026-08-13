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
import ErrorMessage from "@/components/common/form/ErrorMessage";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import organizationApi from "@/api/organization/organizationApi";

interface JoinFormInput {
    inviteCode: string;
    department: string;
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
            department: "",
        },
    });

    const inviteCode = useWatch({ control, name: "inviteCode" });
    const isFilled = Boolean(inviteCode?.trim());

    const handleGoBack = () => {
        router.push("/organization/status");
    };

    const onSubmit = async (data: JoinFormInput) => {
        try {
            await organizationApi.joinOrganization({
                inviteCode: data.inviteCode,
                department: data.department,
            });

            Alert.alert("🎉 가입 신청 완료!", "단체 가입 신청 완료", [
                {
                    onPress: () => router.replace("/organization/status"),
                },
            ]);
        } catch (error: any) {
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
                                        className="w-full h-[88px] border-[1.5px] mb-6 border-primary-main rounded-2xl px-4 text-center font-pretendard-bold text-xl text-text-default bg-white"
                                    />
                                </View>
                            )}
                        />

                        <View className="w-full mt-4">
                            <Text className="text-base font-pretendard-semibold text-primary-main mb-2">
                                부서명
                            </Text>
                            <Controller
                                control={control}
                                name="department"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        placeholder="부서명 입력(선택)"
                                        placeholderTextColor="#9CA3AF"
                                        className="w-full h-[60px] border-[1.5px] border-primary-main rounded-2xl px-4 font-pretendard-medium text-base text-text-default bg-white"
                                    />
                                )}
                            />
                            {errors.department?.message ? (
                                <ErrorMessage className="mt-1.5">
                                    {errors.department.message}
                                </ErrorMessage>
                            ) : (
                                <View className="mt-1.5">
                                    <Text className={"text-text-secondary text-sm font-pretendard"}>
                                        * 미입력 시 관리자가 부서를 배치합니다.
                                    </Text>
                                </View>
                            )}
                        </View>

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
