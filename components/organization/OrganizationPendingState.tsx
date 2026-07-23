import React from "react";
import { View, Text, Pressable } from "react-native";
import { useUserStore } from "@/stores/user/useUserStore";

interface Props {
    onCreatePress?: () => void;
    onCancelPress?: () => void;
}

export default function OrganizationPendingState({ onCreatePress, onCancelPress }: Props) {
    const { authUser } = useUserStore();

    return (
        <View className="w-full items-center">
            <View className="w-full bg-background-paper p-5 rounded-2xl border border-divider items-center mb-4">
                <Text className="text-text-default text-base font-bold text-center mb-3">
                    {`‘${authUser?.memberInfo?.organizationName || "Work"}’ 가입 승인 대기 중이에요.`}
                </Text>

                <Pressable
                    onPress={onCancelPress}
                    className="border border-error-main px-4 py-1.5 rounded-full active:opacity-70"
                >
                    <Text className="text-error-main text-sm font-medium">
                        가입 신청 취소
                    </Text>
                </Pressable>
            </View>

            <View className="w-full bg-background-paper p-6 rounded-2xl border border-divider items-center">
                <Text className="text-text-default text-base font-bold text-center">
                    {"아직 가입된 단체가 없습니다.\n가입 승인을 기다리거나 단체를 만들세요."}
                </Text>
            </View>

            <View className="w-full gap-3 mt-6">
                <Pressable
                    onPress={onCreatePress}
                    className="bg-secondary-main hover:bg-secondary-hover py-4 rounded-xl items-center active:opacity-80"
                >
                    <Text className="text-white font-bold text-base">
                        단체 만들기
                    </Text>
                </Pressable>

                <Pressable
                    disabled={true}
                    className="border border-secondary-main bg-gray-200 py-4 rounded-xl items-center cursor-not-allowed"
                >
                    <Text className="text-secondary-main font-bold text-base">
                        단체 가입하기
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}