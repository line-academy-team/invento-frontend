import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/stores/user/useUserStore";
import MainHeader from "@/components/layout/MainHeader";

export default function ManagerManagementPage() {
    const { authUser } = useUserStore();
    const role = authUser?.memberInfo?.role || "MEMBER";
    const isOwner = role === "OWNER";

    return (
        <View className="flex-1 bg-backg      round-default">
            <MainHeader variant="headerSub" title="조직관리" />

            <ScrollView className="flex-1 px-6 pt-6" contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="gap-y-4">
                    <Pressable
                        onPress={() => router.push("/manager/management/approval" as Href)}
                        className="w-full h-[64px] bg-white hover:bg-primary-main rounded-2xl flex-row items-center justify-between px-6 group active:opacity-90">
                        <Text className="font-pretendard-bold text-lg text-text-default group-hover:text-white">
                            조직 가입 승인
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </Pressable>

                    {isOwner && (
                        <Pressable
                            onPress={() =>
                                router.push("/manager/management/department/create" as Href)
                            }
                            className="w-full h-[64px] bg-white hover:bg-primary-main rounded-2xl flex-row items-center justify-between px-6 group active:opacity-80">
                            <Text className="font-pretendard-bold text-lg text-text-default group-hover:text-white">
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
                            className="w-full h-[64px] bg-white hover:bg-primary-main rounded-2xl flex-row items-center justify-between px-6 group active:opacity-80">
                            <Text className="font-pretendard-bold text-lg text-text-default group-hover:text-white">
                                부서 관리자 임명
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                        </Pressable>
                    )}

                    <Pressable
                        onPress={() =>
                            router.push("/manager/management/department/transfer" as Href)
                        }
                        className="w-full h-[64px] bg-white hover:bg-primary-main rounded-2xl flex-row items-center justify-between px-6 group active:opacity-80">
                        <Text className="font-pretendard-bold text-lg text-text-default group-hover:text-white">
                            부서 이동
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
