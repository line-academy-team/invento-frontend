import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { router } from "expo-router";

export default function OrganizationCreatePage() {
    const handleCreate = async () => {
        // TODO: 조직 생성 API 연동 (userOrganizationSchema 사용)
        // 성공 시 router.replace("/organization") 또는 메인으로 이동
    };

    return (
        <View className="flex-1 bg-background-default px-5 py-6">
            <Text className="text-2xl font-pretendard-bold mb-6">단체 만들기</Text>
            {/* 폼 입력 영역 (조직명, 소개글, 초대코드 등) */}
            <Pressable
                onPress={handleCreate}
                className="w-full py-4 bg-secondary-main rounded-2xl items-center mt-auto">
                <Text className="text-white font-pretendard-bold">생성하기</Text>
            </Pressable>
        </View>
    );
}
