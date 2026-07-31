import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/stores/user/useUserStore";
import MainHeader from "@/components/layout/MainHeader";
import MainFooter from "@/components/layout/MainFooter"; // 👈 푸터 가져오기!

export default function ManagerManagementPage() {
    const { authUser } = useUserStore();
    const role = authUser?.memberInfo?.role || "MEMBER";
    const isOwner = role === "OWNER";

    return (
        <View className="flex-1 bg-background-default">
            <MainHeader variant="headerSub" title="조직관리" />

            <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="gap-y-4">
                    <Pressable
                        onPress={() => router.push("/manager/management/approval" as Href)}
                        className="w-full h-[64px] bg-primary-main rounded-2xl flex-row items-center justify-between px-6 shadow-sm active:opacity-90">
                        <Text className="font-pretendard-bold text-lg text-white">
                            조직 가입 승인
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
                    </Pressable>

                    {isOwner && (
                        <Pressable
                            onPress={() =>
                                router.push("/manager/management/department/create" as Href)
                            }
                            className="w-full h-[64px] bg-white rounded-2xl flex-row items-center justify-between px-6 shadow-sm border border-gray-100 active:opacity-80">
                            <Text className="font-pretendard-bold text-lg text-text-default">
                                부서 생성
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </Pressable>
                    )}

                    {isOwner && (
                        <Pressable
                            onPress={() =>
                                router.push("/manager/management/department/assign-manager" as Href)
                            }
                            className="w-full h-[64px] bg-white rounded-2xl flex-row items-center justify-between px-6 shadow-sm border border-gray-100 active:opacity-80">
                            <Text className="font-pretendard-bold text-lg text-text-default">
                                부서 관리자 임명
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </Pressable>
                    )}

                    <Pressable
                        onPress={() =>
                            router.push("/manager/management/department/transfer" as Href)
                        }
                        className="w-full h-[64px] bg-white rounded-2xl flex-row items-center justify-between px-6 shadow-sm border border-gray-100 active:opacity-80">
                        <Text className="font-pretendard-bold text-lg text-text-default">
                            부서 이동
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </Pressable>
                </View>
            </ScrollView>

            <MainFooter variant="manager" />
        </View>
    );
}
