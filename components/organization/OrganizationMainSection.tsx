import React from "react";
import { ScrollView, View, Text } from "react-native";
import { twMerge } from "tailwind-merge";
import { useUserStore } from "@/stores/user/useUserStore";
import OrganizationEmptyState from "./OrganizationEmptyState";
import OrganizationPendingState from "./OrganizationPendingState";

export default function OrganizationMainSection() {
    const { authUser } = useUserStore();
    const isPending = authUser?.memberInfo?.status === "PENDING";

    const handleCreate = () => {
        // TODO: 단체 만들기 이동
    };

    const handleJoin = () => {
        // TODO: 단체 가입하기 이동
    };

    const handleCancel = () => {
        // TODO: 가입 취소 요청 API
    };

    return (
        <ScrollView
            contentContainerClassName={twMerge("p-5 justify-between flex-grow bg-white")}
            showsVerticalScrollIndicator={false}
        >
            <View className={twMerge("w-full items-center")}>
                {/* 상단 프로필 헤더 */}
                <View className={twMerge("w-full bg-primary-main p-5 rounded-2xl mb-6 flex-row justify-between items-center")}>
                    <View>
                        <Text className={twMerge("text-white text-sm font-pretendard")}>
                            안녕하세요.
                        </Text>
                        <Text className={twMerge("text-white text-2xl font-pretendard font-bold mt-1")}>
                            {`${authUser?.user?.name || "사용자"}님 👋`}
                        </Text>
                    </View>
                    <Text className={twMerge("text-white text-xl font-pretendard font-bold")}>
                        Invento
                    </Text>
                </View>

                {/* 상태별 화면 교체 */}
                {isPending ? (
                    <OrganizationPendingState
                        onCreatePress={handleCreate}
                        onCancelPress={handleCancel}
                    />
                ) : (
                    <OrganizationEmptyState
                        onCreatePress={handleCreate}
                        onJoinPress={handleJoin}
                    />
                )}
            </View>

            {/* 하단 카피라이트 */}
            <View className={twMerge("items-center py-4 mt-8")}>
                <Text className={twMerge("text-secondary-main text-xs font-pretendard")}>
                    © 2026 Invento
                </Text>
            </View>
        </ScrollView>
    );
}