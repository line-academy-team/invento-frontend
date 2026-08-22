import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import adminApi from "@/api/admin/adminApi";
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { OrganizationCount } from "@/types/organization";
import { MaterialIcons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

function AdminOrganizationDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const orgId = Number(id);
    const [org, setOrg] = useState<OrganizationCount | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadOrg = useCallback(async () => {
        try {
            setIsLoading(true);
            const organization = await adminApi.getOrganizationById(orgId);
            setOrg(organization);
        } catch (error) {
            console.log(error);
            const msg = "조직 정보를 불러오는 데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    }, [orgId]);

    useEffect(() => {
        if (!orgId) return;
        loadOrg().then(() => {});
    }, [loadOrg, orgId]);

    const handleToggleSuspend = async () => {
        if (!org) return;
        const isSuspended = !org.deletedAt;
        const actionText = isSuspended ? "정지" : "정지 해제";

        const processUpdate = async () => {
            try {
                setIsSubmitting(true);
                await adminApi.updateOrganization(org.id, { isSuspended });
                const msg = `조직이 ${actionText} 처리되었습니다.`;
                if (Platform.OS === "web") alert(msg);
                else Alert.alert("성공", msg);
                loadOrg().then(() => {});
            } catch (error) {
                console.log(error);
                const msg = `조직 ${actionText} 처리에 실패했습니다.`;
                if (Platform.OS === "web") alert(msg);
                else Alert.alert("오류", msg);
            } finally {
                setIsSubmitting(false);
            }
        };

        if (Platform.OS === "web") {
            if (confirm(`정말 이 조직을 ${actionText}하시겠습니까?`)) {
                await processUpdate();
            }
        } else {
            Alert.alert("조직 상태 변경", `정말 이 조직을 ${actionText}하시겠습니까?`, [
                { text: "취소", style: "cancel" },
                { text: "확인", onPress: processUpdate },
            ]);
        }
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background-paper">
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    const isSuspended = !!org?.deletedAt;

    return (
        <View className="flex-1 bg-background-paper">
            <MainHeader title={"조직 상세"} isBackPress onBackPress={() => router.back()} />

            {!org ? (
                <View className="flex-1 justify-center items-center bg-background-paper">
                    <Text className="text-text-secondary font-pretendard">
                        조직 정보를 찾을 수 없습니다.
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1" contentContainerClassName="p-[30px] pb-5">
                    <View className="flex-row bg-background-paper border border-border rounded-[10px] p-6 items-center justify-between gap-5 mb-6">
                        <View className="w-[70px] h-[70px] justify-center items-center bg-primary-light rounded-2xl">
                            <MaterialIcons name="domain" size={50} className="text-primary-main" />
                        </View>
                        <View className="justify-center">
                            <Text className="font-pretendard-bold text-2xl text-text-main mb-1">
                                {org.name}
                            </Text>
                            <View
                                className={twMerge(
                                    "w-20, h-6, justify-center items-center rounded-2xl",
                                    isSuspended ? "bg-success-light" : "bg-error-light",
                                )}></View>
                            <Text className="font-pretendard text-xs text-text-secondary mt-3">
                                등록 장비: {org._count.equipment ?? 0}개 | 멤버:{" "}
                                {org._count?.members ?? 0}명
                            </Text>
                        </View>
                        <Text className="font-pretendard-bold text-lg text-text-main mb-4">
                            기본 정보
                        </Text>
                        <View className="gap-y-4 mb-8">
                            <View className="flex-row justify-between items-center">
                                <Text className="font-pretendard text-base text-text-secondary">
                                    대표자
                                </Text>
                                <Text className="font-pretendard-semibold text-base text-text-main">
                                    {org.creator?.name || "-"}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="font-pretendard text-base text-text-secondary">
                                    초대코드
                                </Text>
                                <Text className="font-pretendard-semibold text-base text-text-main">
                                    {org.inviteCode}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="font-pretendard text-base text-text-secondary">
                                    생성일
                                </Text>
                                <Text className="font-pretendard-semibold text-base text-text-main">
                                    {org.createdAt?.split("T")[0]}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="font-pretendard text-base text-text-secondary">
                                    상태
                                </Text>
                                <Text
                                    className={`font-pretendard-semibold text-base ${isSuspended ? "text-error-main" : "text-success-main"}`}>
                                    {isSuspended ? "운영 정지" : "정상 운영 중"}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="font-pretendard text-base text-text-secondary">
                                    멤버 수
                                </Text>
                                <Text className="font-pretendard-bold text-base text-text-main">
                                    {org._count?.members ?? 0}명
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="font-pretendard text-base text-text-secondary">
                                    등록 비품 수
                                </Text>
                                <Text className="font-pretendard-bold text-base text-text-main">
                                    {org._count?.equipment ?? 0}개
                                </Text>
                            </View>
                        </View>
                        <Text className="font-pretendard-bold text-lg text-text-main mb-2">
                            설명
                        </Text>
                        <Text className="font-pretendard text-sm text-text-secondary mb-8 leading-6">
                            {org.description || "등록된 설명이 없습니다."}
                        </Text>
                        <Text className="font-pretendard-bold text-lg text-text-main mb-4">
                            관리 기능
                        </Text>
                        <Pressable
                            disabled={isSubmitting}
                            onPress={handleToggleSuspend}
                            className={`w-full h-[52px] border rounded-[16px] justify-center items-center active:opacity-80 ${
                                isSuspended
                                    ? "border-primary-main bg-primary-light"
                                    : "border-error-main bg-error-light/20"
                            }`}>
                            <Text
                                className={`font-pretendard-bold text-base ${isSuspended ? "text-primary-main" : "text-error-main"}`}>
                                {isSuspended ? "조직 정지 해제하기" : "⚠️ 조직 정지하기"}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

export default AdminOrganizationDetailPage;
