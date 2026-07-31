import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Modal, TextInput, Switch, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";

import { Member } from "@/types/member";
import { Department } from "@/types/department";
import managerOrganizationApi from "@/api/manager/managerOrganizationApi";
import { useUserStore } from "@/stores/user/useUserStore";

export default function OrganizationApprovalDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { authUser } = useUserStore();
    const ozId = authUser?.memberInfo?.organizationId;

    const [member, setMember] = useState<Member | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<Department | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [memo, setMemo] = useState("승인이 완료 되었습니다.");
    const [sendNotification, setSendNotification] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!ozId || !id) return;
            try {
                const data = await managerOrganizationApi.getOrganizationDetail(ozId);

                const targetMember = data.members.find((m: Member) => m.id === Number(id));
                setMember(targetMember || null);

                setDepartments(data.departments || []);
            } catch (error) {
                console.error("데이터 로드 실패:", error);
            }
        };
        fetchData();
    }, [ozId, id]);

    const handleSelectDepartment = (dept: Department) => {
        setSelectedDept(dept);
        setIsDropdownOpen(false);
    };

    const handleConfirmApproval = async () => {
        if (!ozId || !id) return;
        try {
            await managerOrganizationApi.updateMemberStatus(ozId, {
                memberIds: [Number(id)],
                status: "APPROVED",
                departmentId: selectedDept?.id || null,
                memo,
                sendNotification,
            });

            Alert.alert("성공", "승인 처리가 완료되었습니다.");
            setIsModalVisible(false);
            router.back();
        } catch (error) {
            console.error("승인 처리 실패:", error);
            Alert.alert("오류", "처리에 실패했습니다.");
        }
    };

    if (!member) {
        return (
            <View className="flex-1 bg-background-deep items-center justify-center">
                <Text className="font-pretendard text-text-secondary">로딩 중...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-deep">
            <MainHeader variant="headerSub" title="조직 가입 승인 상세" isBackPress />

            <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className="font-pretendard-bold text-lg text-text-default mb-4">
                    신청정보
                </Text>

                <View className="bg-surface rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                    <View className="flex-row justify-between mb-3">
                        <Text className="font-pretendard text-sm text-text-secondary">
                            신청일시
                        </Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {member.joinedAt
                                ? member.joinedAt.replace("T", " ").substring(0, 16)
                                : "-"}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-3">
                        <Text className="font-pretendard text-sm text-text-secondary">신청자</Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {member.user.name}
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-6">
                        <Text className="font-pretendard text-sm text-text-secondary">이메일</Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {member.user.email}
                        </Text>
                    </View>

                    <View className="bg-background-deep p-4 rounded-xl items-center">
                        <Text className="font-pretendard text-sm text-text-default">
                            승인부탁드립니다.
                        </Text>
                    </View>
                </View>

                <View className="mb-6 relative z-10">
                    <Pressable
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex-row items-center justify-between bg-surface h-14 px-5 rounded-2xl border ${
                            isDropdownOpen ? "border-primary-main" : "border-gray-200"
                        }`}>
                        <Text
                            className={`font-pretendard-medium text-base ${
                                selectedDept ? "text-text-default" : "text-text-secondary"
                            }`}>
                            {selectedDept ? selectedDept.name : "부서를 선택해주세요"}
                        </Text>
                        <Ionicons
                            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#9CA3AF"
                        />
                    </Pressable>

                    {isDropdownOpen && (
                        <View className="mt-2 bg-surface rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {departments.map((dept, index) => {
                                const isSelected = selectedDept?.id === dept.id;
                                return (
                                    <Pressable
                                        key={dept.id}
                                        onPress={() => handleSelectDepartment(dept)}
                                        className={`px-5 py-4 ${
                                            isSelected ? "bg-primary-main" : "bg-surface"
                                        } ${index !== departments.length - 1 ? "border-b border-gray-100" : ""}`}>
                                        <Text
                                            className={`font-pretendard-medium text-base ${
                                                isSelected ? "text-white" : "text-text-default"
                                            }`}>
                                            {dept.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View className="p-6 bg-background-deep">
                <Pressable
                    onPress={() => setIsModalVisible(true)}
                    className="w-full h-14 bg-primary-main rounded-2xl items-center justify-center shadow-sm active:opacity-90">
                    <Text className="font-pretendard-bold text-lg text-white">승인</Text>
                </Pressable>
            </View>

            <Modal
                visible={isModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsModalVisible(false)}>
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="w-full bg-surface rounded-[24px] p-6 shadow-xl">
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="w-6" />
                            <Text className="font-pretendard-bold text-lg text-text-main text-primary-main">
                                승인처리
                            </Text>
                            <Pressable
                                onPress={() => setIsModalVisible(false)}
                                className="w-6 items-end">
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </Pressable>
                        </View>

                        <View className="mb-6">
                            <Text className="font-pretendard-semibold text-sm text-text-default text-center mb-2">
                                메모
                            </Text>
                            <TextInput
                                value={memo}
                                onChangeText={setMemo}
                                multiline
                                textAlignVertical="center"
                                className="border border-gray-200 rounded-xl px-4 py-6 font-pretendard text-base text-text-default text-center"
                            />
                        </View>

                        <View className="flex-row items-center justify-between mb-8 px-2">
                            <Text className="font-pretendard-medium text-base text-text-default">
                                알림발송
                            </Text>
                            <Switch
                                value={sendNotification}
                                onValueChange={setSendNotification}
                                trackColor={{ false: "#E5E7EB", true: "#7C3AED" }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <Pressable
                            onPress={handleConfirmApproval}
                            className="w-full h-14 bg-primary-main rounded-2xl items-center justify-center active:opacity-90">
                            <Text className="font-pretendard-bold text-lg text-white">
                                승인 완료
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
