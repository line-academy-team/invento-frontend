import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, Alert } from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";

import { Member } from "@/types/member";
import managerOrganizationApi from "@/api/manager/managerOrganizationApi";
import { useUserStore } from "@/stores/user/useUserStore";

export default function OrganizationApprovalListPage() {
    const { authUser } = useUserStore();
    const ozId = authUser?.memberInfo?.organizationId;

    const [search, setSearch] = useState("");
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const fetchMembers = async () => {
        if (!ozId) return;
        try {
            const data = await managerOrganizationApi.getOrganizationDetail(ozId);
            setMembers(data.members || []);
        } catch (error) {
            console.error("멤버 목록 조회 실패:", error);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [ozId]);

    const filteredMembers = members.filter(
        m => m.user.name.includes(search) || m.user.email.includes(search),
    );

    const isAllSelected =
        filteredMembers.length > 0 && selectedIds.length === filteredMembers.length;

    const handleToggleAll = () => {
        if (isAllSelected) setSelectedIds([]);
        else setSelectedIds(filteredMembers.map(m => m.id));
    };

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
        );
    };

    const handleGoToDetail = (id: number) => {
        router.push(`/manager/management/approval/${id}` as Href);
    };

    const handleBatchAction = async (actionStatus: "APPROVED" | "REJECTED") => {
        if (!ozId) return;
        try {
            await managerOrganizationApi.updateMemberStatus(ozId, {
                memberIds: selectedIds,
                status: actionStatus,
            });

            Alert.alert(
                "알림",
                `일괄 ${actionStatus === "APPROVED" ? "승인" : "반려"} 처리되었습니다.`,
            );
            setSelectedIds([]);
            fetchMembers();
        } catch (error) {
            console.error("일괄 처리 실패:", error);
            Alert.alert("오류", "처리에 실패했습니다.");
        }
    };

    return (
        <View className="flex-1 bg-background-deep">
            <MainHeader variant="headerSub" title="조직 가입 승인" isBackPress />

            <View className="flex-1 px-6 pt-4">
                <View className="flex-row items-center bg-surface border border-divider rounded-xl px-4 h-[52px] mb-4 shadow-sm">
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="검색"
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-2 font-pretendard text-base text-text-default"
                    />
                </View>

                <Pressable
                    onPress={handleToggleAll}
                    className="flex-row items-center mb-4 self-start py-1">
                    <View
                        className={`w-5 h-5 rounded border items-center justify-center mr-2 ${
                            isAllSelected
                                ? "bg-primary-main border-primary-main"
                                : "border-gray-300 bg-surface"
                        }`}>
                        {isAllSelected && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                    </View>
                    <Text className="font-pretendard-bold text-sm text-primary-main">전체선택</Text>
                </Pressable>

                <FlatList
                    data={filteredMembers}
                    keyExtractor={item => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    renderItem={({ item }) => {
                        const isChecked = selectedIds.includes(item.id);

                        const statusText =
                            item.status === "PENDING"
                                ? "대기"
                                : item.status === "APPROVED"
                                  ? "승인"
                                  : item.status === "REJECTED"
                                    ? "반려"
                                    : "탈퇴";

                        const joinDate = item.joinedAt ? item.joinedAt.split("T")[0] : "날짜 없음";

                        return (
                            <Pressable
                                onPress={() => handleGoToDetail(item.id)}
                                className="flex-row items-center bg-surface p-5 rounded-2xl mb-3 shadow-sm active:opacity-80">
                                <Pressable
                                    onPress={e => {
                                        e.stopPropagation();
                                        handleToggleSelect(item.id);
                                    }}
                                    className="pr-4 py-2">
                                    <View
                                        className={`w-5 h-5 rounded border items-center justify-center ${
                                            isChecked
                                                ? "bg-primary-main border-primary-main"
                                                : "border-gray-300 bg-surface"
                                        }`}>
                                        {isChecked && (
                                            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                                        )}
                                    </View>
                                </Pressable>

                                <View className="flex-1">
                                    <View className="flex-row items-center justify-between mb-2">
                                        <Text className="font-pretendard-bold text-base text-text-default">
                                            {item.user.name}
                                        </Text>
                                        <Text className="font-pretendard text-xs text-text-secondary">
                                            {joinDate} 가입
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center justify-between">
                                        <Text className="font-pretendard text-sm text-text-secondary">
                                            {item.user.email}
                                        </Text>
                                        <Badge status={statusText} />
                                    </View>
                                </View>
                            </Pressable>
                        );
                    }}
                />
            </View>

            {selectedIds.length > 0 && (
                <View className="absolute bottom-6 left-6 right-6 bg-surface p-5 rounded-[24px] shadow-lg flex-row items-center justify-between border border-gray-100">
                    <Text className="font-pretendard-bold text-text-default text-base">
                        선택된 요청 <Text className="text-primary-main">{selectedIds.length}</Text>
                    </Text>
                    <View className="flex-row items-center gap-x-2">
                        <Pressable
                            onPress={() => handleBatchAction("REJECTED")}
                            className="bg-error-light px-4 py-2 rounded-xl">
                            <Text className="font-pretendard-semibold text-error-main">반려</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handleBatchAction("APPROVED")}
                            className="bg-primary-main px-4 py-2 rounded-xl">
                            <Text className="font-pretendard-semibold text-white">승인</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}
