import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Modal, TextInput, Switch, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import managerJoinApi, {
    JoinRequestDetail,
    JoinRequestDepartment,
} from "@/api/manager/managerJoinApi";

export default function OrganizationApprovalDetailPage() {
    const { id } = useLocalSearchParams();
    const requestId = Number(id);

    const [requestDetail, setRequestDetail] = useState<JoinRequestDetail | null>(null);
    const [departments, setDepartments] = useState<JoinRequestDepartment[]>([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<JoinRequestDepartment | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [memo, setMemo] = useState("승인이 완료 되었습니다.");
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isNaN(requestId)) {
            fetchDetail();
        }
    }, [requestId]);

    const fetchDetail = async () => {
        try {
            const data = await managerJoinApi.getJoinRequestById(requestId);
            setRequestDetail(data);
            setDepartments(data.departments || []);
        } catch (error: any) {
            console.error(error);
            Alert.alert(
                "오류",
                error.response?.data?.message || "상세 정보를 불러오지 못했습니다.",
            );
            router.back();
        }
    };

    const handleApproveComplete = async () => {
        if (!selectedDept) return;

        try {
            setIsSubmitting(true);
            await managerJoinApi.processJoinRequest({
                memberIds: [requestId],
                status: "APPROVED",
                departmentId: selectedDept.id,
            });

            setIsModalVisible(false);
            Alert.alert("승인 완료", "가입 승인이 성공적으로 처리되었습니다.", [
                { text: "확인", onPress: () => router.back() },
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert("오류", error.response?.data?.message || "승인 처리에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!requestDetail) {
        return (
            <View className="flex-1 bg-background-paper justify-center items-center">
                <Text>로딩 중...</Text>
            </View>
        );
    }

    const joinDate = requestDetail.createdAt ? requestDetail.createdAt.split("T")[0] : "정보 없음";

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="조직 가입 승인 상세" isBackPress />

            <ScrollView className="flex-1 px-5 pt-4" contentContainerStyle={{ paddingBottom: 120 }}>
                <Text className="font-pretendard-bold text-base text-text-default mb-3">
                    신청정보
                </Text>

                <View className="bg-background-paper rounded-3xl p-6 border border-divider shadow-sm mb-6">
                    <View className="flex-row justify-between items-center mb-3.5">
                        <Text className="font-pretendard text-sm text-text-secondary">
                            신청일시
                        </Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {joinDate}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3.5">
                        <Text className="font-pretendard text-sm text-text-secondary">신청자</Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {requestDetail.user.name}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-pretendard text-sm text-text-secondary">
                            가입 조직
                        </Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {requestDetail.organization.name}
                        </Text>
                    </View>

                    <View className="h-[1px] bg-gray-100 w-full mb-6" />

                    <Text className="font-pretendard text-sm text-text-default text-center">
                        승인부탁드립니다.
                    </Text>
                </View>

                <View className="relative z-10">
                    <Pressable
                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`flex-row items-center justify-between p-4 rounded-2xl border bg-surface shadow-sm ${
                            isDropdownOpen ? "border-primary-main" : "border-divider"
                        }`}>
                        <Text
                            className={`font-pretendard text-sm ${selectedDept ? "text-text-default font-pretendard-medium" : "text-text-secondary"}`}>
                            {selectedDept ? selectedDept.name : "부서를 선택해주세요"}
                        </Text>
                        <Ionicons
                            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                            size={18}
                            color="#6B7280"
                        />
                    </Pressable>

                    {isDropdownOpen && (
                        <View className="absolute top-[56px] left-0 right-0 bg-surface border border-gray-200 rounded-2xl shadow-md overflow-hidden z-20">
                            {departments.map((dept, index) => {
                                const isSelected = selectedDept?.id === dept.id;
                                return (
                                    <Pressable
                                        key={dept.id}
                                        onPress={() => {
                                            setSelectedDept(dept);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`p-4 ${isSelected ? "bg-primary-main" : "bg-surface"} ${
                                            index !== departments.length - 1
                                                ? "border-b border-gray-100"
                                                : ""
                                        }`}>
                                        <Text
                                            className={`font-pretendard-medium text-sm ${isSelected ? "text-white" : "text-text-default"}`}>
                                            {dept.name}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>

            <View className="absolute bottom-6 left-5 right-5">
                <Pressable
                    disabled={!selectedDept}
                    onPress={() => setIsModalVisible(true)}
                    className={`w-full h-[56px] rounded-2xl items-center justify-center border transition-colors ${
                        selectedDept
                            ? "bg-primary-main border-primary-main"
                            : "bg-surface border-divider"
                    }`}>
                    <Text
                        className={`font-pretendard-bold text-base ${
                            selectedDept ? "text-white" : "text-text-secondary"
                        }`}>
                        승인
                    </Text>
                </Pressable>
            </View>

            <Modal transparent visible={isModalVisible} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="w-full bg-background-paper rounded-3xl p-6 shadow-xl">
                        <View className="flex-row items-center justify-between mb-5">
                            <Text className="font-pretendard-bold text-lg text-text-default">
                                승인처리
                            </Text>
                            <Pressable onPress={() => setIsModalVisible(false)} className="p-1">
                                <Ionicons name="close" size={22} color="#9CA3AF" />
                            </Pressable>
                        </View>

                        <Text className="font-pretendard-semibold text-sm text-text-default mb-2">
                            메모
                        </Text>
                        <TextInput
                            value={memo}
                            onChangeText={setMemo}
                            multiline
                            textAlignVertical="top"
                            className="w-full h-24 border border-divider rounded-2xl p-4 font-pretendard text-sm text-text-default mb-6"
                        />

                        <View className="flex-row items-center justify-between mb-8">
                            <Text className="font-pretendard-semibold text-sm text-text-default">
                                알림발송
                            </Text>
                            <Switch
                                value={isNotificationEnabled}
                                onValueChange={setIsNotificationEnabled}
                                trackColor={{ false: "#E5E7EB", true: "#7C3AED" }}
                                thumbColor="#FFFFFF"
                            />
                        </View>

                        <Button
                            isLoading={isSubmitting}
                            onPress={handleApproveComplete}
                            className="h-[52px]">
                            승인 완료
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
