import React from "react";
import { ScrollView, View, Text } from "react-native";
import { useUserStore } from "@/stores/user/useUserStore";
import OrganizationEmptyState from "./OrganizationEmptyState";
import OrganizationPendingState from "./OrganizationPendingState";

export default function OrganizationMainSection() {
    const { authUser } = useUserStore();
    const isPending = authUser?.memberInfo?.status === "PENDING";

    const handleCreate = () => {
        // TODO: 단체 만들기
    };

    const handleJoin = () => {
        // TODO: 단체 가입하기
    };

    const handleCancel = () => {
        // TODO: 가입 취소
    };

    return (
        <ScrollView
            contentContainerStyle={{ padding: 20, justifyContent: "space-between", flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <View className="w-full items-center">
                <View className="w-full bg-primary-main p-5 rounded-2xl mb-6 flex-row justify-between items-center">
                    <View>
                        <Text className="text-white text-sm">
                            안녕하세요.
                        </Text>
                        <Text className="text-white text-2xl font-bold mt-1">
                            {`${authUser?.user?.name || "사용자"}님 👋`}
                        </Text>
                    </View>
                    <Text className="text-white text-xl font-bold">
                        Invento
                    </Text>
                </View>

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

            <View className="items-center py-4">
                <Text className="text-secondary-main text-xs">
                    © 2026 Invento
                </Text>
            </View>
        </ScrollView>
    );
}