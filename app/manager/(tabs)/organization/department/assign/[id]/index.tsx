import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, FlatList, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";
import ownerDepartmentApi from "@/api/owner/ownerDepartmentApi";

interface MemberUser {
    id: number;
    name: string;
}

interface DepartmentMember {
    id: number;
    role: string;
    user: MemberUser;
}

export default function DepartmentAssignDetailPage() {
    const { id, name, createdAt } = useLocalSearchParams();
    const departmentId = Number(id);

    const [members, setMembers] = useState<DepartmentMember[]>([]);
    const [selectedMember, setSelectedMember] = useState<DepartmentMember | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchDepartmentMembers = useCallback(async () => {
        try {
            const data = await ownerDepartmentApi.getDepartmentList();
            const currentDept = (data as any[]).find(d => d.id === departmentId);

            if (currentDept && currentDept.members) {
                setMembers(currentDept.members);
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert(
                "오류",
                error.response?.data?.message || "멤버 목록을 불러오지 못했습니다.",
            );
        }
    }, [departmentId]);

    useEffect(() => {
        if (!isNaN(departmentId)) {
            fetchDepartmentMembers();
        }
    }, [departmentId, fetchDepartmentMembers]);

    const currentManager = members.find(m => m.role === "MANAGER");
    const currentManagerNameText = currentManager ? currentManager.user.name : "미지정";

    const handleSelectMember = (member: DepartmentMember) => {
        if (member.role === "MANAGER") return;

        if (selectedMember?.id === member.id) {
            setSelectedMember(null);
        } else {
            setSelectedMember(member);
        }
    };

    const handleAssignComplete = async () => {
        if (!selectedMember) return;

        try {
            setIsSubmitting(true);
            await ownerDepartmentApi.assignDepartmentManager(departmentId, selectedMember.id);

            Alert.alert(
                "임명 완료",
                `${selectedMember.user.name}님이 부서 관리자로 임명되었습니다.`,
                [{ text: "확인", onPress: () => router.back() }],
            );
        } catch (error: any) {
            console.error(error);
            Alert.alert("오류", error.response?.data?.message || "관리자 임명에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="부서관리자 임명" isBackPress />

            <View className="flex-1 px-6 pt-4">
                <View className="bg-background-deep rounded-3xl p-6 border border-divider shadow-sm mb-6">
                    <View className="flex-row justify-between items-center mb-4 border-b border-divider">
                        <Text className="font-pretendard-bold text-xl text-text-default">
                            {name || "알 수 없는 부서"}
                        </Text>
                        <Text className="font-pretendard-medium text-sm text-text-secondary">
                            {createdAt ? `${createdAt} 생성` : ""}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center">
                        <Text className="font-pretendard-bold text-base text-text-default">
                            관리자
                        </Text>
                        <Text className="font-pretendard-medium text-base text-primary-main">
                            {currentManagerNameText}
                        </Text>
                    </View>
                </View>

                <View className="flex-1 bg-background-paper rounded-3xl border border-divider overflow-hidden mb-6 shadow-sm">
                    <FlatList
                        data={members}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: selectedMember ? 140 : 20 }}
                        renderItem={({ item, index }) => {
                            const isChecked = selectedMember?.id === item.id;
                            const isManager = item.role === "MANAGER";
                            const isLast = index === members.length - 1;

                            return (
                                <Pressable
                                    onPress={() => handleSelectMember(item)}
                                    className={`flex-row items-center justify-between p-5 active:opacity-80 ${
                                        !isLast ? "border-b border-divider" : ""
                                    }`}>
                                    <View className="flex-row items-center">
                                        <View
                                            className={`w-5 h-5 rounded border items-center justify-center mr-3 ${
                                                isManager
                                                    ? "bg-gray-200 border-gray-300"
                                                    : isChecked
                                                      ? "bg-primary-main border-primary-main"
                                                      : "border-gray-300 bg-surface"
                                            }`}>
                                            {isChecked && !isManager && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={14}
                                                    color="#FFFFFF"
                                                />
                                            )}
                                            {isManager && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={14}
                                                    color="#9CA3AF"
                                                />
                                            )}
                                        </View>

                                        <Text className="font-pretendard-bold text-base text-text-default">
                                            {name}{" "}
                                            <Text className="text-text-default">
                                                {item.user.name}
                                            </Text>
                                        </Text>
                                    </View>

                                    {isManager && (
                                        <View className="bg-secondary-light/30 px-3 py-1 rounded-full">
                                            <Text className="font-pretendard-bold text-xs text-secondary-hover">
                                                관리자
                                            </Text>
                                        </View>
                                    )}
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </View>

            {selectedMember && (
                <View className="absolute bottom-0 w-full bg-surface rounded-t-[32px] pt-3 pb-8 px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border border-divider z-50">
                    <View className="w-12 h-1.5 bg-divider rounded-full self-center mb-8" />

                    <View className="items-center mb-6">
                        <Text className="font-pretendard-bold text-xl text-text-default mb-1">
                            {selectedMember.user.name}님
                        </Text>
                        <Text className="font-pretendard-bold text-xl text-text-default">
                            부서 관리자 임명
                        </Text>
                    </View>

                    <Pressable
                        disabled={isSubmitting}
                        onPress={handleAssignComplete}
                        className={`w-full h-[56px] rounded-2xl items-center justify-center active:opacity-80 ${
                            isSubmitting ? "bg-gray-400" : "bg-primary-main"
                        }`}>
                        <Text className="font-pretendard-bold text-white text-lg">완료</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
