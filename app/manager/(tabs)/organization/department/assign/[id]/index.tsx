import React, { useState } from "react";
import { View, Text, Pressable, FlatList, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";

interface DepartmentMember {
    id: number;
    name: string;
    role: string;
    isManager: boolean;
}

const INITIAL_MEMBERS: DepartmentMember[] = [
    { id: 101, name: "홍길동", role: "부장", isManager: true },
    { id: 102, name: "이상해", role: "과장", isManager: false },
    { id: 103, name: "김영희", role: "대리", isManager: false },
    { id: 104, name: "박사원", role: "사원", isManager: false },
];

export default function DepartmentAssignDetailPage() {
    const { id, name, createdAt, manager } = useLocalSearchParams();

    const [members, setMembers] = useState<DepartmentMember[]>(INITIAL_MEMBERS);
    const [selectedMember, setSelectedMember] = useState<DepartmentMember | null>(null);

    const currentManager = members.find(m => m.isManager);
    const currentManagerNameText = currentManager
        ? `${currentManager.name} ${currentManager.role}`
        : "미지정";

    const handleSelectMember = (member: DepartmentMember) => {
        if (member.isManager) return;

        if (selectedMember?.id === member.id) {
            setSelectedMember(null);
        } else {
            setSelectedMember(member);
        }
    };

    const handleAssignComplete = () => {
        if (!selectedMember) return;

        setMembers(prev =>
            prev.map(m => ({
                ...m,
                isManager: m.id === selectedMember.id,
            })),
        );

        Alert.alert(
            "알림",
            `${selectedMember.name} ${selectedMember.role}님이 부서 관리자로 임명되었습니다.`,
        );
        setSelectedMember(null);
    };

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="부서관리자 임명" isBackPress />

            <View className="flex-1 px-6 pt-4">
                <View className="bg-background-deep rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
                    <View className="flex-row justify-between items-center mb-4 border-b border-gray-100">
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
                        <Text className="font-pretendard-medium text-base text-text-default">
                            {currentManagerNameText}
                        </Text>
                    </View>
                </View>

                <View className="flex-1 bg-background-paper rounded-3xl border border-gray-100 overflow-hidden mb-6 shadow-sm">
                    <FlatList
                        data={members}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: selectedMember ? 140 : 20 }}
                        renderItem={({ item, index }) => {
                            const isChecked = selectedMember?.id === item.id;
                            const isLast = index === members.length - 1;

                            return (
                                <Pressable
                                    onPress={() => handleSelectMember(item)}
                                    className={`flex-row items-center justify-between p-5 active:opacity-80 ${
                                        !isLast ? "border-b border-gray-100" : ""
                                    }`}>
                                    <View className="flex-row items-center">
                                        <View
                                            className={`w-5 h-5 rounded border items-center justify-center mr-3 ${
                                                item.isManager
                                                    ? "bg-gray-200 border-gray-300"
                                                    : isChecked
                                                      ? "bg-primary-main border-primary-main"
                                                      : "border-gray-300 bg-surface"
                                            }`}>
                                            {isChecked && !item.isManager && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={14}
                                                    color="#FFFFFF"
                                                />
                                            )}
                                            {item.isManager && (
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
                                                {item.name} {item.role}
                                            </Text>
                                        </Text>
                                    </View>

                                    {item.isManager && (
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
                <View className="absolute bottom-0 w-full bg-surface rounded-t-[32px] pt-3 pb-8 px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border border-gray-100 z-50">
                    <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />

                    <View className="items-center mb-6">
                        <Text className="font-pretendard-bold text-xl text-text-default mb-1">
                            {selectedMember.name} {selectedMember.role}님
                        </Text>
                        <Text className="font-pretendard-bold text-xl text-text-default">
                            부서 관리자 임명
                        </Text>
                    </View>

                    <Pressable
                        onPress={handleAssignComplete}
                        className="w-full h-[56px] bg-primary-main rounded-2xl items-center justify-center active:opacity-80">
                        <Text className="font-pretendard-bold text-white text-lg">완료</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
