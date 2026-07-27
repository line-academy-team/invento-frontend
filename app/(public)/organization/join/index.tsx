import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { router } from "expo-router";

export default function OrganizationJoinPage() {
    const handleJoin = async () => {
        // TODO: 단체 가입 API 연동 (userJoinOrganizationSchema 사용)
        // 성공 시 router.replace("/organization")으로 이동하여 PENDING 상태 확인
    };

    return (
        <View className="flex-1 bg-background-default px-5 py-6">
            <Text className="text-2xl font-pretendard-bold mb-6">초대 코드로 가입하기</Text>
            {/* 초대 코드 입력 폼 */}
            <Pressable
                onPress={handleJoin}
                className="w-full py-4 bg-secondary-main rounded-2xl items-center mt-auto">
                <Text className="text-white font-pretendard-bold">가입 신청하기</Text>
            </Pressable>
        </View>
    );
}
