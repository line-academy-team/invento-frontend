import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";
import managerJoinApi, { JoinRequestMember } from "@/api/manager/managerJoinApi";

import { Member } from "@/types/member";
// import managerOrganizationApi from "@/api/manager/managerOrganizationApi";
import { useUserStore } from "@/stores/user/useUserStore";

const DUMMY_MEMBERS: Member[] = [
    {
        id: 1,
        organizationId: 1,
        userId: 101,
        role: "MEMBER",
        status: "PENDING",
        joinedAt: "2026-07-20T14:30:00.000Z",
        createdAt: "2026-07-20T14:30:00.000Z",
        user: { id: 101, name: "홍길동", email: "hong@company.com" },
    },
    {
        id: 2,
        organizationId: 1,
        userId: 102,
        role: "MEMBER",
        status: "APPROVED",
        joinedAt: "2026-07-20T14:30:00.000Z",
        createdAt: "2026-07-20T14:30:00.000Z",
        user: { id: 102, name: "홍길동", email: "hong@company.com" },
    },
    {
        id: 3,
        organizationId: 1,
        userId: 103,
        role: "MEMBER",
        status: "REJECTED",
        joinedAt: "2026-07-20T14:30:00.000Z",
        createdAt: "2026-07-20T14:30:00.000Z",
        user: { id: 103, name: "홍길동", email: "hong@company.com" },
    },
    {
        id: 4,
        organizationId: 1,
        userId: 104,
        role: "MEMBER",
        status: "PENDING",
        joinedAt: "2026-07-20T14:30:00.000Z",
        createdAt: "2026-07-20T14:30:00.000Z",
        user: { id: 104, name: "홍길동", email: "hong@company.com" },
    },
    {
        id: 5,
        organizationId: 1,
        userId: 105,
        role: "MEMBER",
        status: "PENDING",
        joinedAt: "2026-07-20T14:30:00.000Z",
        createdAt: "2026-07-20T14:30:00.000Z",
        user: { id: 105, name: "홍길동", email: "hong@company.com" },
    },
];

export default function OrganizationApprovalListPage() {
    const [search, setSearch] = useState("");
    const [members, setMembers] = useState<JoinRequestMember[]>([]);
    //const [members, setMembers] = useState<Member[]>(DUMMY_MEMBERS);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [batchAction, setBatchAction] = useState<"APPROVED" | "REJECTED">("APPROVED");

    const fetchMembers = async () => {
        try {
            const data = await managerJoinApi.getJoinRequestList();
            setMembers(data || []);
        } catch (error: any) {
            console.error(error);
            Alert.alert("오류", error.response?.data?.message || "멤버 목록 조회에 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const filteredMembers = members.filter(
        m => m.user.name.includes(search) || m.user.email.includes(search),
    );

    const pendingMembers = filteredMembers.filter(m => m.status === "PENDING");

    const isAllSelected = pendingMembers.length > 0 && selectedIds.length === pendingMembers.length;

    const handleToggleAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pendingMembers.map(m => m.id));
        }
    };

    const handleToggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id],
        );
    };

    const handleGoToDetail = (item: JoinRequestMember) => {
        router.push({
            pathname: "/manager/organization/approval/[id]",
            params: {
                id: item.id,
                name: item.user.name,
                email: item.user.email,
                joinedAt: item.createdAt ? item.createdAt.split("T")[0] : "날짜 없음",
                organization: item.department?.name || "부서 미지정",
            },
        } as any);
    };

    const executeBatchAction = async () => {
        if (selectedIds.length === 0) return;

        try {
            await managerJoinApi.processJoinRequest({
                memberIds: selectedIds,
                status: batchAction,
            });

            Alert.alert(
                "알림",
                `일괄 ${batchAction === "APPROVED" ? "승인" : "반려"} 처리되었습니다.`,
            );
                Alert.alert(
                    "알림",
                    `일괄 ${batchAction === "APPROVED" ? "승인" : "반려"} 처리되었습니다. (테스트)`,
                );

                setMembers(prev =>
                    prev.map(m => (selectedIds.includes(m.id) ? { ...m, status: batchAction } : m)),
                );

            setSelectedIds([]);
            await fetchMembers();
        } catch (error: any) {
            console.error(error);
            Alert.alert("오류", error.response?.data?.message || "처리에 실패했습니다.");
        }
    };

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader variant="headerSub" title="조직 가입 승인" isBackPress />

            <View className="flex-1 px-6 pt-4">
                <View className="flex-row items-center bg-background-paper border border-gray-300 rounded-full px-5 h-[52px] mb-4">
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
                    disabled={pendingMembers.length === 0}
                    className={`flex-row items-center mb-4 self-start py-1 ${
                        pendingMembers.length === 0 ? "opacity-50" : "active:opacity-80"
                    }`}>
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

                <View className="flex-1 bg-background-paper rounded-3xl border border-gray-100 overflow-hidden mb-6">
                    <FlatList
                        data={filteredMembers}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: selectedIds.length > 0 ? 120 : 20,
                        }}
                        renderItem={({ item, index }) => {
                            const isProcessed = item.status !== "PENDING";
                            const isChecked = selectedIds.includes(item.id);
                            const statusText =
                                item.status === "PENDING"
                                    ? "대기"
                                    : item.status === "APPROVED"
                                      ? "승인"
                                      : item.status === "REJECTED"
                                        ? "반려"
                                        : "탈퇴";
                            const joinDate = item.createdAt
                                ? item.createdAt.split("T")[0]
                                : "날짜 없음";

                            return (
                                <Pressable
                                    disabled={isProcessed}
                                    onPress={() => handleGoToDetail(item)}
                                    className={`flex-row items-center p-5 ${
                                        isProcessed
                                            ? "opacity-40 bg-gray-50/50"
                                            : "active:opacity-80"
                                    } ${
                                        index !== filteredMembers.length - 1
                                            ? "border-b border-gray-100"
                                            : ""
                                    }`}>
                                    <Pressable
                                        disabled={isProcessed}
                                        onPress={e => {
                                            e.stopPropagation();
                                            handleToggleSelect(item.id);
                                        }}
                                        className="pr-4 py-2">
                                        <View
                                            className={`w-5 h-5 rounded border items-center justify-center ${
                                                isChecked
                                                    ? "bg-primary-main border-primary-main"
                                                    : isProcessed
                                                      ? "border-gray-200 bg-gray-100"
                                                      : "border-gray-300 bg-surface"
                                            }`}>
                                            {isChecked && (
                                                <Ionicons
                                                    name="checkmark"
                                                    size={14}
                                                    color="#FFFFFF"
                                                />
                                            )}
                                        </View>
                                    </Pressable>

                                    <View className="flex-1">
                                        <View className="flex-row items-center justify-between mb-1">
                                            <Text className="font-pretendard-bold text-base text-text-default">
                                                {item.user.name}
                                            </Text>
                                            <Text className="font-pretendard text-xs text-text-secondary">
                                                {joinDate} 요청
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
            </View>
            {selectedIds.length > 0 && (
                <View className="absolute bottom-0 w-full bg-surface rounded-t-[32px] pt-3 pb-8 px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border border-gray-100 z-50">
                    <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-6" />

                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="font-pretendard-bold text-lg text-text-default">
                            선택된 요청
                        </Text>

                        <Pressable
                            onPress={() =>
                                setBatchAction(prev =>
                                    prev === "APPROVED" ? "REJECTED" : "APPROVED",
                                )
                            }
                            className="flex-row items-center bg-primary-main rounded-full px-5 py-2.5 gap-x-2 active:opacity-80">
                            <Text className="font-pretendard-semibold text-white text-base">
                                {batchAction === "APPROVED" ? "승인" : "반려"}
                            </Text>
                            <Ionicons name="chevron-down" size={16} color="#FFFFFF" />
                        </Pressable>

                        <Pressable
                            onPress={executeBatchAction}
                            className="px-2 py-2 active:opacity-70">
                            <Text className="font-pretendard-bold text-lg text-text-default">
                                완료
                            </Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}
