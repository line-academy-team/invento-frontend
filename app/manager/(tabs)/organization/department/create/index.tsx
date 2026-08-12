import React, { useState, useEffect } from "react";
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
import ownerDepartmentApi, { Department } from "@/api/owner/ownerDepartmentApi";

export default function DepartmentCreatePage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newDeptName, setNewDeptName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await ownerDepartmentApi.getDepartmentList();
            setDepartments(data);
        } catch (error: any) {
            console.log(error);
            Alert.alert(
                "오류",
                error.response?.data?.message || "부서 목록을 불러오지 못했습니다.",
            );
        }
    };

    const handleCreateDepartment = async () => {
        if (!newDeptName.trim()) return;

        try {
            setIsLoading(true);
            await ownerDepartmentApi.createDepartment(newDeptName.trim());

            setNewDeptName("");
            setIsModalVisible(false);

            await fetchDepartments();
        } catch (error: any) {
            console.log(error);
            Alert.alert(
                "오류",
                error.response?.data?.message || "부서 생성 중 오류가 발생했습니다.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteDepartment = (id: number, name: string) => {
        Alert.alert("부서 삭제", `'${name}'을(를) 정말 삭제하시겠습니까?`, [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    try {
                        await ownerDepartmentApi.deleteDepartment(id);
                        await fetchDepartments();
                    } catch (error: any) {
                        console.log(error);
                        Alert.alert(
                            "오류",
                            error.response?.data?.message || "부서 삭제 중 오류가 발생했습니다.",
                        );
                    }
                },
            },
        ]);
    };

    const formatDate = (dateString: string) => {
        // 방어 로직: dateString이 없을 경우 빈 문자열 반환
        if (!dateString) return "";
        return dateString.split("T")[0] + " 생성";
    };

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="부서생성" isBackPress />

            <FlatList
                data={departments}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View className="bg-background-paper rounded-[20px] p-5 mb-4 border border-divider shadow-sm flex-row justify-between items-center">
                        <View>
                            <Text className="font-pretendard-bold text-lg text-text-default mb-1">
                                {item.name}
                            </Text>
                            <Text className="font-pretendard text-sm text-text-secondary">
                                {formatDate(item.createdAt)}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-x-2">
                            <Pressable
                                onPress={() => handleDeleteDepartment(item.id, item.name)}
                                className="w-[34px] h-[34px] items-center justify-center border border-error-light rounded-lg bg-error-light/20 active:opacity-70">
                                <Feather name="trash-2" size={16} color="#EF4444" />
                            </Pressable>
                            <Pressable
                                onPress={() => Alert.alert("알림", "수정 기능은 준비 중입니다.")}
                                className="w-[34px] h-[34px] items-center justify-center border border-primary-light rounded-lg bg-primary-light/10 active:opacity-70">
                                <Feather name="edit-2" size={16} color="#7C3AED" />
                            </Pressable>
                        </View>
                    </View>
                )}
            />

            <Pressable
                onPress={() => setIsModalVisible(true)}
                className="absolute bottom-8 right-6 w-14 h-14 bg-primary-main rounded-full items-center justify-center shadow-lg active:opacity-80">
                <Ionicons name="add" size={32} color="#FFFFFF" />
            </Pressable>

            <Modal transparent visible={isModalVisible} animationType="fade">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="w-full bg-background-paper rounded-3xl p-6 shadow-xl">
                        <View className="flex-row items-center justify-between mb-8">
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
                            className="w-full h-[56px] border border-divider rounded-2xl px-4 font-pretendard-medium text-base text-text-default mb-8"
                        />

                        <Button
                            onPress={handleCreateDepartment}
                            disabled={!newDeptName.trim()}
                            isLoading={isLoading}
                            className="h-[56px]">
                            완료
                        </Button>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
