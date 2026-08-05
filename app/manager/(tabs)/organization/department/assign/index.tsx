import React, { useState, useCallback } from "react";
import { View, Text, Pressable, FlatList, Alert } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";
import ownerDepartmentApi from "@/api/owner/ownerDepartmentApi";

interface DepartmentMember {
    id: number;
    role: string;
    user: {
        id: number;
        name: string;
    };
}

interface DepartmentDetail {
    id: number;
    name: string;
    createdAt: string;
    members?: DepartmentMember[];
}

export default function DepartmentAssignIndexPage() {
    const [departments, setDepartments] = useState<DepartmentDetail[]>([]);

    const fetchDepartments = async () => {
        try {
            const data = await ownerDepartmentApi.getDepartmentList();
            setDepartments(data as any);
        } catch (error: any) {
            console.error(error);
            Alert.alert(
                "오류",
                error.response?.data?.message || "부서 목록을 불러오지 못했습니다.",
            );
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDepartments();
        }, []),
    );

    const handleGoToDetail = (dept: DepartmentDetail, managerName: string) => {
        router.push({
            pathname: "/manager/organization/department/assign/[id]",
            params: {
                id: dept.id,
                name: dept.name,
                createdAt: dept.createdAt ? dept.createdAt.split("T")[0] : "",
                manager: managerName,
            },
        } as any);
    };

    const getManagerName = (members?: DepartmentMember[]) => {
        if (!members || members.length === 0) return "미지정";
        const manager = members.find(m => m.role === "MANAGER");
        return manager ? manager.user.name : "미지정";
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
                        data={departments}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item, index }) => {
                            const isLast = index === departments.length - 1;
                            const managerName = getManagerName(item.members);

                            return (
                                <Pressable
                                    onPress={() => handleGoToDetail(item, managerName)}
                                    className={`flex-row items-center justify-between p-5 active:opacity-80 ${
                                        !isLast ? "border-b border-gray-100" : ""
                                    }`}>
                                    <View>
                                        <Text className="font-pretendard-bold text-lg text-text-default mb-1">
                                            {item.name}
                                        </Text>
                                        <Text className="font-pretendard text-sm text-text-secondary">
                                            현재 관리자:{" "}
                                            <Text
                                                className={`font-pretendard-medium ${
                                                    managerName !== "미지정"
                                                        ? "text-primary-main"
                                                        : "text-text-secondary"
                                                }`}>
                                                {managerName}
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
