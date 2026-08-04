import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Modal, TextInput, Switch } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";

interface DepartmentType {
    id: number;
    name: string;
}

const DEPARTMENTS: DepartmentType[] = [
    { id: 1, name: "개발1팀" },
    { id: 2, name: "개발2팀" },
    { id: 3, name: "개발3팀" },
    { id: 4, name: "회계팀" },
    { id: 5, name: "마케팅팀" },
];

export default function OrganizationApprovalDetailPage() {
    const { id, name, joinedAt, organization } = useLocalSearchParams();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<DepartmentType | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [memo, setMemo] = useState("승인이 완료 되었습니다.");
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

    const handleApproveComplete = () => {
        console.log("승인 완료:", {
            memberId: id,
            deptId: selectedDept?.id,
            memo,
            isNotificationEnabled,
        });
        setIsModalVisible(false);
        router.back();
    };

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
                            {joinedAt || "정보 없음"}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-3.5">
                        <Text className="font-pretendard text-sm text-text-secondary">신청자</Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {name || "알 수 없음"}
                        </Text>
                    </View>
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="font-pretendard text-sm text-text-secondary">
                            가입 조직
                        </Text>
                        <Text className="font-pretendard-medium text-sm text-text-default">
                            {organization || "ABC 기업"}
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
                        <View className="absolute top-[56px] left-0 right-0 bg-surface border border-divider rounded-2xl shadow-md overflow-hidden z-20">
                            {DEPARTMENTS.map((dept, index) => {
                                const isSelected = selectedDept?.id === dept.id;
                                return (
                                    <Pressable
                                        key={dept.id}
                                        onPress={() => {
                                            setSelectedDept(dept);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`p-4 ${isSelected ? "bg-primary-main" : "bg-surface"} ${
                                            index !== DEPARTMENTS.length - 1
                                                ? "border-b border-divider"
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

                        <Button onPress={handleApproveComplete} className="h-[52px]">
                            승인 완료
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
