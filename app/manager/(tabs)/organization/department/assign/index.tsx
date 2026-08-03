import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";

const DEPARTMENTS = [
    { id: 1, name: "개발1팀", createdAt: "2022.01.22", manager: "홍길동 부장" },
    { id: 2, name: "개발2팀", createdAt: "2023.05.10", manager: "이철수 차장" },
    { id: 3, name: "디자인1팀", createdAt: "2024.11.05", manager: "김영주 대리" },
    { id: 4, name: "회계팀", createdAt: "2026.07.20", manager: "미지정" },
];

export default function DepartmentAssignIndexPage() {
    const handleGoToDetail = (dept: (typeof DEPARTMENTS)[0]) => {
        router.push({
            pathname: "/manager/organization/department/assign/[id]",
            params: {
                id: dept.id,
                name: dept.name,
                createdAt: dept.createdAt,
                manager: dept.manager,
            },
        } as any);
    };

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="부서관리자 임명" isBackPress />

            <View className="flex-1 px-6 pt-4">
                <Text className="font-pretendard-medium text-text-secondary mb-4">
                    관리자를 임명할 부서를 선택해주세요.
                </Text>

                <View className="flex-1 bg-surface rounded-3xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
                    <FlatList
                        data={DEPARTMENTS}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item, index }) => {
                            const isLast = index === DEPARTMENTS.length - 1;

                            return (
                                <Pressable
                                    onPress={() => handleGoToDetail(item)}
                                    className={`flex-row items-center justify-between p-5 active:opacity-80 ${
                                        !isLast ? "border-b border-gray-100" : ""
                                    }`}>
                                    <View>
                                        <Text className="font-pretendard-bold text-lg text-text-default mb-1">
                                            {item.name}
                                        </Text>
                                        <Text className="font-pretendard text-sm text-text-secondary">
                                            현재 관리자:{" "}
                                            <Text className="font-pretendard-medium text-primary-main">
                                                {item.manager}
                                            </Text>
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </View>
        </View>
    );
}
