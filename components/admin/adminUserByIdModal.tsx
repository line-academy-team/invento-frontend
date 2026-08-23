import React, { useState, useEffect } from "react";
import { Modal, View, Text, Pressable, Alert, Platform, ActivityIndicator } from "react-native";
import { User, UserRole } from "@/types/user";
import adminApi from "@/api/admin/adminApi";
import { FiUser } from "react-icons/fi";
import { MaterialIcons } from "@expo/vector-icons";

interface AdminUserByIdModalProps {
    visible: boolean;
    user: User | null;
    onClose: () => void;
    onSuccess: () => void;
}

function AdminUserByIdModal({ visible, user, onClose, onSuccess }: AdminUserByIdModalProps) {
    const [role, setRole] = useState<UserRole>("USER");
    const [isDeleted, setIsDeleted] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            setRole(user.role);
            setIsDeleted(!!user.deletedAt);
        }
    }, [user]);

    if (!user) return null;

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            await adminApi.updateUser(user.id, {
                role,
                isDeleted,
            });

            const msg = "회원 정보가 성공적으로 변경되었습니다.";
            if (Platform.OS === "web") alert(msg);
            else Alert.alert("성공", msg);

            onSuccess();
            onClose();
        } catch (error) {
            console.log(error);
            const msg = "회원 정보 수정에 실패했습니다.";
            if (Platform.OS === "web") alert(msg);
            else Alert.alert("오류", msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 bg-black/50 justify-center items-center px-5">
                <View className="w-96 bg-background-paper rounded-2xl px-5 py-7 shadow-lg">
                    <Text className="font-pretendard-bold text-xl text-text-main mb-5">
                        회원 정보 제어
                    </Text>

                    <View className="flex-row items-center gap-4 mb-6">
                        <View className="w-[64px] h-[64px] justify-center items-center bg-primary-light rounded-2xl">
                            <FiUser size={37} className="text-primary-main" />
                        </View>
                        <View className="justify-center">
                            <Text className="font-pretendard-bold text-lg text-text-main">
                                {user.name}
                            </Text>
                            <Text className="font-pretendard text-xs text-text-secondary">
                                {user.email}
                            </Text>
                            <Text className="font-pretendard text-xs text-text-secondary">
                                가입일 : {user.createdAt?.split("T")[0]}
                            </Text>
                        </View>
                    </View>

                    <View className="border border-divider rounded-2xl px-5 py-6 mb-5">
                        <Text className="font-pretendard-bold text-lg text-text-main mb-4">
                            권한 설정 (Role)
                        </Text>
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => setRole("USER")}
                                className={`flex-1 h-14 rounded-2xl justify-center items-center border ${
                                    role === "USER"
                                        ? "bg-primary-main border-primary-main"
                                        : "bg-white border-divider"
                                }`}>
                                <Text
                                    className={`font-pretendard-medium text-lg ${
                                        role === "USER" ? "text-white" : "text-text-secondary"
                                    }`}>
                                    USER {role === "USER" && "✓"}
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setRole("ADMIN")}
                                className={`flex-1 h-14 rounded-2xl justify-center items-center border ${
                                    role === "ADMIN"
                                        ? "bg-primary-main border-primary-main"
                                        : "bg-white border-divider"
                                }`}>
                                <Text
                                    className={`font-pretendard-medium text-lg ${
                                        role === "ADMIN" ? "text-white" : "text-text-secondary"
                                    }`}>
                                    ADMIN {role === "ADMIN" && "✓"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>

                    <View className="border border-divider rounded-2xl p-5 mb-5">
                        <Text className="font-pretendard-bold text-lg text-text-main mb-2">
                            계정 정지 설정 (isDeleted)
                        </Text>
                        <Pressable
                            onPress={() => setIsDeleted(!isDeleted)}
                            className="flex-row items-center gap-2 py-1">
                            <MaterialIcons
                                name={isDeleted ? "check-box" : "check-box-outline-blank"}
                                size={22}
                                color={isDeleted ? "#7C3AED" : "#9CA3AF"}
                            />
                            <Text className="font-pretendard-semibold text-[16px] text-text-main">
                                계정 이용 정지 처리
                            </Text>
                        </Pressable>
                        <Text className="font-pretendard-medium text-sm text-text-secondary ml-7">
                            정지 처리된 계정은 로그인 및 서비스 이용이 제한됩니다.
                        </Text>
                    </View>

                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={onClose}
                            className="flex-1 h-[60px] rounded-2xl justify-center items-center hover:bg-divider">
                            <Text className="font-pretendard-bold text-base text-text-secondary">
                                취소
                            </Text>
                        </Pressable>

                        <Pressable
                            disabled={isSubmitting}
                            onPress={handleSave}
                            className="flex-1 h-[60px] bg-primary-main rounded-2xl justify-center items-center active:opacity-90">
                            {isSubmitting ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <Text className="font-pretendard-bold text-base text-white">
                                    변경 사항 저장하기
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default AdminUserByIdModal;
