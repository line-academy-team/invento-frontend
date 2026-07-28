import React from "react";
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

                    <View className="px-6 items-center my-auto">
                        <Text className="text-2xl font-pretendard-bold text-secondary-main mb-6">
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
                                        className="w-full h-14 border-2 border-secondary-main rounded-2xl px-4 text-center font-pretendard-bold text-xl text-text-default bg-white"
                                    />
                                </View>
                            )}
                        />

                        {errors.root?.message && (
                            <ErrorMessage className="mt-2 self-center">
                                {errors.root?.message}
                            </ErrorMessage>
                        )}

                        <Pressable
                            disabled={!isFilled || isSubmitting}
                            onPress={handleSubmit(onSubmit)}
                            className={twMerge(
                                "w-full h-14 rounded-2xl items-center justify-center mt-4 transition-colors duration-200",
                                "bg-background-deep cursor-not-allowed",
                                isFilled &&
                                    "bg-secondary-main hover:bg-secondary-hover active:bg-secondary-hover cursor-pointer",
                            )}>
                            <Text
                                className={twMerge(
                                    "font-pretendard-bold text-xl text-text-secondary",
                                    isFilled && "text-text-light",
                                )}>
                                가입하기
                            </Text>
                        </Pressable>
                    </View>

                    <Text className="text-secondary-main text-center text-xs">© 2026 Invento</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
