import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Pressable, FlatList, Alert } from "react-native";
import { Href, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";

import { Member } from "@/types/member";
// import managerOrganizationApi from "@/api/manager/managerOrganizationApi";
import { useUserStore } from "@/stores/user/useUserStore";

// 💡 시안과 동일한 5명의 가짜(Dummy) 데이터 세팅
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
    const { authUser } = useUserStore();
    const ozId = authUser?.memberInfo?.organizationId;

    const [search, setSearch] = useState("");
    // 💡 초기값으로 더미 데이터를 넣어줍니다.
    const [members, setMembers] = useState<Member[]>(DUMMY_MEMBERS);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [batchAction, setBatchAction] = useState<"APPROVED" | "REJECTED">("APPROVED");

    const fetchMembers = async () => {
        // if (!ozId) return;
        // try {
        //     const data = await managerOrganizationApi.getOrganizationDetail(ozId);
        //     setMembers(data.members || []);
        // } catch (error) {
        //     console.error("멤버 목록 조회 실패:", error);
        // }
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

    const handleGoToDetail = (item: Member) => {
        router.push({
            // 💡 1. 템플릿 리터럴(`${ }`)을 빼고 폴더 경로의 모양 그대로 적습니다.
            pathname: "/manager/organization/approval/[id]",
            params: {
                // 💡 2. 동적 경로인 [id]에 들어갈 값을 params 안에서 넘겨줍니다.
                id: item.id,
                name: item.user.name,
                email: item.user.email,
                joinedAt: item.joinedAt ? item.joinedAt.split("T")[0] : "날짜 없음",
                organization: "ABC 기업",
            },
        } as any); // Expo Router의 엄격한 타입 검사(Typed Routes)를 우회하여 빨간줄을 없앱니다.
    };

        const executeBatchAction = async () => {
            // if (!ozId) return;
            try {
                // await managerOrganizationApi.updateMemberStatus(ozId, {
                //     memberIds: selectedIds,
                //     status: batchAction,
                // });

                Alert.alert(
                    "알림",
                    `일괄 ${batchAction === "APPROVED" ? "승인" : "반려"} 처리되었습니다. (테스트)`,
                );

                // 💡 더미 데이터 상태 업데이트 (UI 바로 반영 테스트용)
                setMembers(prev =>
                    prev.map(m => (selectedIds.includes(m.id) ? { ...m, status: batchAction } : m)),
                );

                setSelectedIds([]);
            } catch (error) {
                console.error("일괄 처리 실패:", error);
                Alert.alert("오류", "처리에 실패했습니다.");
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
                        className="flex-row items-center mb-4 self-start py-1">
                        <View
                            className={`w-5 h-5 rounded border items-center justify-center mr-2 ${
                                isAllSelected
                                    ? "bg-primary-main border-primary-main"
                                    : "border-gray-300 bg-surface"
                            }`}>
                            {isAllSelected && (
                                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                            )}
                        </View>
                        <Text className="font-pretendard-bold text-sm text-primary-main">
                            전체선택
                        </Text>
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
                                const isChecked = selectedIds.includes(item.id);
                                const statusText =
                                    item.status === "PENDING"
                                        ? "대기"
                                        : item.status === "APPROVED"
                                          ? "승인"
                                          : item.status === "REJECTED"
                                            ? "반려"
                                            : "탈퇴";
                                const joinDate = item.joinedAt
                                    ? item.joinedAt.split("T")[0]
                                    : "날짜 없음";

                                return (
                                    <Pressable
                                        // 💡 변경된 부분: item 전체를 함수로 넘겨줍니다.
                                        onPress={() => handleGoToDetail(item)}
                                        className={`flex-row items-center p-5 active:opacity-80 ${
                                            index !== filteredMembers.length - 1
                                                ? "border-b border-gray-100"
                                                : ""
                                        }`}>
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

