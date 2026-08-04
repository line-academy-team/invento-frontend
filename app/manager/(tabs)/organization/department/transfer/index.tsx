import React, { useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";

interface TransferMember {
    id: number;
    name: string;
    role: string;
    department: string;
}

interface DepartmentType {
    id: number;
    name: string;
}

const DUMMY_MEMBERS: TransferMember[] = [
    { id: 1, name: "홍길동", role: "부장", department: "개발1팀" },
    { id: 2, name: "이상해", role: "과장", department: "개발1팀" },
    { id: 3, name: "김영희", role: "대리", department: "개발1팀" },
    { id: 4, name: "이철수", role: "사원", department: "개발2팀" },
    { id: 5, name: "남개발", role: "사원", department: "개발2팀" },
    { id: 6, name: "김영주", role: "대리", department: "디자인1팀" },
    { id: 7, name: "유감영", role: "사원", department: "비서팀" },
];

const DEPARTMENTS: DepartmentType[] = [
    { id: 1, name: "개발1팀" },
    { id: 2, name: "개발2팀" },
    { id: 3, name: "개발3팀" },
    { id: 4, name: "회계팀" },
    { id: 5, name: "마케팅팀" },
];

export default function DepartmentTransferPage() {
    const [search, setSearch] = useState("");
    const [members, setMembers] = useState<TransferMember[]>(DUMMY_MEMBERS);

    const [selectedMember, setSelectedMember] = useState<TransferMember | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [targetDept, setTargetDept] = useState<DepartmentType | null>(null);

    const filteredMembers = members.filter(
        m => m.name.includes(search) || m.department.includes(search),
    );

    const handleCloseModal = () => {
        setSelectedMember(null);
        setTargetDept(null);
        setIsDropdownOpen(false);
    };

    const handleTransferComplete = () => {
        if (!selectedMember || !targetDept) return;

        setMembers(prev =>
            prev.map(m => (m.id === selectedMember.id ? { ...m, department: targetDept.name } : m)),
        );

        Alert.alert(
            "알림",
            `${selectedMember.name} ${selectedMember.role}님이 ${targetDept.name}(으)로 이동되었습니다.`,
        );
        handleCloseModal();
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
                                            {item.name}{" "}
                                            <Text className="font-pretendard-medium text-text-secondary">
                                                {item.role}
                                            </Text>
                                        </Text>
                                    </View>

                                    <Text className="font-pretendard text-sm text-text-secondary">
                                        {item.department}
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
                                    {selectedMember.name} {selectedMember.role}님의 현재 부서
                                </Text>
                                <View className="bg-divider rounded-2xl h-[52px] items-center justify-center mb-4">
                                    <Text className="font-pretendard-bold text-base text-text-secondary">
                                        {selectedMember.department}
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
                                            {DEPARTMENTS.map((dept, index) => {

                                                const isSelected = targetDept?.id === dept.id;
                                                return (
                                                    <Pressable
                                                        key={dept.id}
                                                        onPress={() => {
                                                            setTargetDept(dept);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`p-4 ${isSelected ? "bg-primary-main" : "bg-background-paper"} ${
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

                                <View className="flex-row items-center gap-x-3">
                                    <Pressable
                                        onPress={handleCloseModal}
                                        className="flex-1 h-[52px] rounded-2xl border border-primary-main bg-background-paper items-center justify-center active:opacity-70">
                                        <Text className="font-pretendard-bold text-base text-primary-main">
                                            부서이동취소
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        disabled={!targetDept}
                                        onPress={handleTransferComplete}
                                        className={`flex-1 h-[52px] rounded-2xl items-center justify-center transition-colors ${
                                            targetDept ? "bg-primary-main" : "bg-background-paper"
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
