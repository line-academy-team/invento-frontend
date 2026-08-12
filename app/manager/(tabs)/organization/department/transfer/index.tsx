import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";
import managerDepartmentApi, { OrgMember } from "@/api/manager/managerDepartmentApi";
import ownerDepartmentApi, { Department } from "@/api/owner/ownerDepartmentApi";

export default function DepartmentTransferPage() {
    const [search, setSearch] = useState("");
    const [members, setMembers] = useState<OrgMember[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);

    const [selectedMember, setSelectedMember] = useState<OrgMember | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [targetDept, setTargetDept] = useState<Department | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [membersData, deptsData] = await Promise.all([
                managerDepartmentApi.getOrgMemberList(),
                ownerDepartmentApi.getDepartmentList(),
            ]);
            setMembers(membersData);
            setDepartments(deptsData);
        } catch (error: any) {
            console.error(error);
            Alert.alert("오류", error.response?.data?.message || "데이터를 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredMembers = members.filter(
        m => m.user.name.includes(search) || (m.department?.name || "").includes(search),
    );

    const handleCloseModal = () => {
        setSelectedMember(null);
        setTargetDept(null);
        setIsDropdownOpen(false);
    };

    const handleTransferComplete = async () => {
        if (!selectedMember || !targetDept) return;

        try {
            setIsSubmitting(true);
            await managerDepartmentApi.transferDepartment({
                memberIds: [selectedMember.id],
                targetDepartmentId: targetDept.id,
            });

            Alert.alert(
                "부서 이동 완료",
                `${selectedMember.user.name}님이 ${targetDept.name}(으)로 이동되었습니다.`,
            );
            handleCloseModal();
            await fetchData();
        } catch (error: any) {
            console.error(error);
            Alert.alert("오류", error.response?.data?.message || "부서 이동에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getRoleName = (role: string) => {
        switch (role) {
            case "OWNER":
                return "대표";
            case "MANAGER":
                return "관리자";
            case "MEMBER":
                return "일반";
            default:
                return "알 수 없음";
        }
    };

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="부서이동" isBackPress />

            <View className="flex-1 px-6 pt-4">
                <View className="flex-row items-center bg-surface border border-divider rounded-full px-5 h-[52px] mb-6">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="직원명 또는 부서 검색"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-2 font-pretendard text-base text-text-default"
                    />
                </View>

                <View className="flex-1 bg-background-paper rounded-3xl border border-divider overflow-hidden mb-6 shadow-sm">
                    <FlatList
                        data={filteredMembers}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        renderItem={({ item, index }) => {
                            const isChecked = selectedMember?.id === item.id;
                            const isLast = index === filteredMembers.length - 1;
                            const currentDeptName = item.department?.name || "부서 미지정";
                            const roleName = getRoleName(item.role);

                            return (
                                <Pressable
                                    onPress={() => setSelectedMember(item)}
                                    className={`flex-row items-center justify-between p-5 active:opacity-80 ${
                                        !isLast ? "border-b border-divider" : ""
                                    }`}>
                                    <View className="flex-row items-center">
                                        <View
                                            className={`w-5 h-5 rounded border items-center justify-center mr-3 ${
                                                isChecked
                                                    ? "bg-primary-main border-primary-main"
                                                    : "border-divider bg-surface"
                                            }`}>
                                            {isChecked && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={14}
                                                    color="#FFFFFF"
                                                />
                                            )}
                                        </View>

                                        <Text className="font-pretendard-bold text-base text-text-default">
                                            {item.user.name}{" "}
                                            <Text className="font-pretendard-medium text-text-secondary">
                                                {roleName}
                                            </Text>
                                        </Text>
                                    </View>

                                    <Text className="font-pretendard text-sm text-text-secondary">
                                        {currentDeptName}
                                    </Text>
                                </Pressable>
                            );
                        }}
                    />
                </View>
            </View>

            <Modal transparent visible={!!selectedMember} animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="w-full bg-background-paper rounded-3xl p-6 shadow-xl">
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="w-6" />
                            <Text className="font-pretendard-bold text-xl text-primary-main">
                                이동 부서 선택
                            </Text>
                            <Pressable onPress={handleCloseModal} className="p-1 active:opacity-70">
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </Pressable>
                        </View>

                        {selectedMember && (
                            <>
                                <Text className="font-pretendard-medium text-sm text-text-default text-center mb-2">
                                    {selectedMember.user.name} 님의 현재 부서
                                </Text>
                                <View className="bg-divider rounded-2xl h-[52px] items-center justify-center mb-4">
                                    <Text className="font-pretendard-bold text-base text-text-secondary">
                                        {selectedMember.department?.name || "미지정"}
                                    </Text>
                                </View>

                                <View className="items-center justify-center mb-4">
                                    <View className="w-8 h-8 rounded-full bg-primary-light/20 items-center justify-center">
                                        <Ionicons name="arrow-down" size={18} color="#7C3AED" />
                                    </View>
                                </View>

                                <View className="relative z-10 mb-8">
                                    <Pressable
                                        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className={`flex-row items-center justify-between px-5 h-[52px] rounded-[16px] border bg-transparent ${
                                            isDropdownOpen
                                                ? "border-primary-main"
                                                : "border-gray-300"
                                        }`}>
                                        <Text
                                            className={`font-pretendard-medium text-sm ${targetDept ? "text-text-default" : "text-text-secondary"}`}>
                                            {targetDept
                                                ? targetDept.name
                                                : "이동할 부서를 선택해주세요"}
                                        </Text>
                                        <Ionicons
                                            name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                                            size={18}
                                            color="#6B7280"
                                        />
                                    </Pressable>

                                    {isDropdownOpen && (
                                        <View className="absolute top-[60px] left-0 right-0 bg-background-paper border border-divider rounded-2xl shadow-md overflow-hidden z-20">
                                            {departments.map((dept, index) => {
                                                const isSelected = targetDept?.id === dept.id;
                                                return (
                                                    <Pressable
                                                        key={dept.id}
                                                        onPress={() => {
                                                            setTargetDept(dept);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`p-4 ${isSelected ? "bg-primary-main" : "bg-background-paper"} ${
                                                            index !== departments.length - 1
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

                                <View className="flex-row items-center gap-x-3">
                                    <Pressable
                                        disabled={isSubmitting}
                                        onPress={handleCloseModal}
                                        className="flex-1 h-[52px] rounded-2xl border border-primary-main bg-background-paper items-center justify-center active:opacity-70">
                                        <Text className="font-pretendard-bold text-base text-primary-main">
                                            부서이동취소
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        disabled={!targetDept || isSubmitting}
                                        onPress={handleTransferComplete}
                                        className={`flex-1 h-[52px] rounded-2xl items-center justify-center transition-colors ${
                                            targetDept ? "bg-primary-main" : "bg-gray-200"
                                        }`}>
                                        <Text
                                            className={`font-pretendard-bold text-base ${
                                                targetDept ? "text-white" : "text-gray-400"
                                            }`}>
                                            부서이동완료
                                        </Text>
                                    </Pressable>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}
