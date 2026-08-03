import React, { useState } from "react";
import {
    View,
    Text,
    Pressable,
    FlatList,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import Button from "@/components/common/Button/Button";
import { Ionicons, Feather } from "@expo/vector-icons";

// 💡 더미 데이터용 타입
interface Department {
    id: number;
    name: string;
    createdAt: string;
}

// 💡 시안과 동일한 더미 데이터 초기화
const INITIAL_DEPARTMENTS: Department[] = [
    { id: 1, name: "관리부", createdAt: "2021-07-01 생성" },
    { id: 2, name: "디자인1팀", createdAt: "2026-07-20 생성" },
    { id: 3, name: "회계팀", createdAt: "2026-07-20 생성" },
];

export default function DepartmentCreatePage() {
    const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");

    // 부서 생성 로직 (현재는 로컬 상태에만 추가하여 테스트)
    const handleCreateDepartment = () => {
        if (!newDeptName.trim()) return;

        const newDept: Department = {
            id: Date.now(),
            name: newDeptName,
            // 현재 날짜를 YYYY-MM-DD 형식으로 가져옴
            createdAt: new Date().toISOString().split("T")[0] + " 생성",
        };

        setDepartments(prev => [...prev, newDept]);
        setNewDeptName("");
        setIsModalVisible(false);
    };

    // 부서 삭제 로직
    const handleDeleteDepartment = (id: number, name: string) => {
        Alert.alert("부서 삭제", `'${name}'을(를) 정말 삭제하시겠습니까?`, [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: () => {
                    setDepartments(prev => prev.filter(dept => dept.id !== id));
                },
            },
        ]);
    };

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="부서생성" isBackPress />

            {/* 부서 목록 리스트 */}
            <FlatList
                data={departments}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View className="bg-background-paper rounded-[20px] p-5 mb-4 border border-gray-100 shadow-sm flex-row justify-between items-center">
                        <View>
                            <Text className="font-pretendard-bold text-lg text-text-default mb-1">
                                {item.name}
                            </Text>
                            <Text className="font-pretendard text-sm text-text-secondary">
                                {item.createdAt}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-x-2">
                            {/* 삭제 버튼 (빨간색 테두리) */}
                            <Pressable
                                onPress={() => handleDeleteDepartment(item.id, item.name)}
                                className="w-[34px] h-[34px] items-center justify-center border border-error-light rounded-lg bg-error-light/20 active:opacity-70">
                                <Feather name="trash-2" size={16} color="#EF4444" />
                            </Pressable>
                            {/* 수정 버튼 (보라색 테두리) */}
                            <Pressable
                                onPress={() => Alert.alert("알림", "수정 기능은 준비 중입니다.")}
                                className="w-[34px] h-[34px] items-center justify-center border border-primary-light rounded-lg bg-primary-light/10 active:opacity-70">
                                <Feather name="edit-2" size={16} color="#7C3AED" />
                            </Pressable>
                        </View>
                    </View>
                )}
            />

            {/* 우측 하단 플로팅 액션 버튼 (FAB) */}
            <Pressable
                onPress={() => setIsModalVisible(true)}
                className="absolute bottom-8 right-6 w-14 h-14 bg-primary-main rounded-full items-center justify-center shadow-lg active:opacity-80">
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </Pressable>

            {/* 부서 생성 모달창 */}
            <Modal transparent visible={isModalVisible} animationType="fade">
                {/* 키보드가 올라올 때 모달이 가려지지 않도록 KeyboardAvoidingView 적용 */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="w-full bg-background-paper rounded-3xl p-6 shadow-xl">
                        <View className="flex-row items-center justify-between mb-8">
                            {/* 헤더 중앙 정렬을 위해 보이지 않는 뷰 삽입 */}
                            <View className="w-6" />
                            <Text className="font-pretendard-bold text-xl text-primary-main">
                                부서생성
                            </Text>
                            <Pressable
                                onPress={() => {
                                    setIsModalVisible(false);
                                    setNewDeptName("");
                                }}
                                className="p-1 active:opacity-70">
                                <Ionicons name="close" size={24} color="#9CA3AF" />
                            </Pressable>
                        </View>

                        <Text className="font-pretendard-bold text-base text-text-default mb-4 text-center">
                            부서명
                        </Text>
                        <TextInput
                            value={newDeptName}
                            onChangeText={setNewDeptName}
                            placeholder="부서명을 입력해주세요"
                            placeholderTextColor="#9CA3AF"
                            textAlign="center"
                            autoFocus
                            className="w-full h-[56px] border border-gray-300 rounded-2xl px-4 font-pretendard-medium text-base text-text-default mb-8"
                        />

                        {/* 입력값이 없으면 버튼 비활성화 (투명도 조절) */}
                        <Button
                            onPress={handleCreateDepartment}
                            disabled={!newDeptName.trim()}
                            className="h-[56px]">
                            완료
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
