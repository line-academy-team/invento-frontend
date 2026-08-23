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
                <ScrollView className="flex-1 p-5">
                    <View className="flex-row bg-background-paper border border-divider rounded-[10px] p-5 items-center gap-5 mb-5">
                        <View className="w-[70px] h-[70px] justify-center items-center bg-primary-light rounded-2xl">
                            <MaterialIcons name="domain" size={50} className="text-primary-main" />
                        </View>
                        <View>
                            <Text className="font-pretendard-semibold text-2xl text-text-main mb-1">
                                {org.name}
                            </Text>
                            <View style={{width: 85}} className="mb-1 items-center justify-center">
                                <View
                                    className={`px-3 py-1 rounded-2xl ${
                                        isSuspended ? "bg-error-light" : "bg-success-light"
                                    }`}>
                                    <Text
                                        className={`font-pretendard-semibold text-xs ${
                                            isSuspended ? "text-error-main" : "text-success-main"
                                        }`}>
                                        {isSuspended ? "운영 정지" : "정상 운영 중"}
                                    </Text>
                                </View>
                            </View>
                            <Text className="font-pretendard-semibold text-xs text-text-secondary">
                                등록 장비: {org._count?.equipment ?? 0}개 | 멤버:{" "}
                                {org._count?.members ?? 0}명
                            </Text>
                        </View>
                    </View>

                    <View className="mb-4" style={{ paddingHorizontal: 10 }}>
                        <Text className="font-pretendard-bold text-lg text-text-main mb-3">
                            기본 정보
                        </Text>
                        <View
                            style={{ borderTopWidth: 1, borderBottomWidth: 1 }}
                            className="border-text-secondary">
                            <View className="flex-row justify-between items-center p-5 border-b border-divider">
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    대표자
                                </Text>
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    {org.creator?.name || "-"}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center p-5 border-b border-divider">
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    초대코드
                                </Text>
                                <View className="flex-row items-center gap-1">
                                    <Text className="font-pretendard-semibold text-sm text-text-main">
                                        {org.inviteCode}
                                    </Text>
                                    <MaterialIcons name="content-copy" size={22} color="#000000" />
                                </View>
                            </View>
                            <View className="flex-row justify-between items-center p-5 border-b border-divider">
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    대표자
                                </Text>
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    {org.createdAt.split("T")[0]}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center p-5 border-b border-divider">
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    상태
                                </Text>
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    <View className="items-center mb-1">
                                        <View
                                            className={`px-3 py-1 rounded-2xl ${
                                                isSuspended ? "bg-error-light" : "bg-success-light"
                                            }`}>
                                            <Text
                                                className={`font-pretendard-semibold text-xs ${
                                                    isSuspended
                                                        ? "text-error-main"
                                                        : "text-success-main"
                                                }`}>
                                                {isSuspended ? "운영 정지" : "정상 운영 중"}
                                            </Text>
                                        </View>
                                    </View>
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center p-5 border-b border-divider">
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    멤버 수
                                </Text>
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    {org._count.members ?? 0}명
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-center p-5 border-b border-divider">
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    등록 비품 수
                                </Text>
                                <Text className="font-pretendard-medium text-[16px] text-text-main">
                                    {org._count.equipment ?? 0}개
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="mb-5">
                        <View className="border border-divider bg-background-paper rounded-[10px] px-3 py-4">
                            <Text className="font-pretendard-bold text-lg text-text-main mb-2">
                                설명
                            </Text>
                            <Text className="font-pretendard text-[16px] text-text-main">
                                {org.description || "등록된 설명이 없습니다."}
                            </Text>
                        </View>
                    </View>

                    <View
                        style={{  marginHorizontal: 10, borderTopWidth: 1 }}
                        className="pt-2 border-divider"
                    >
                        <Text className="font-pretendard-bold text-lg text-text-main mb-2">
                            관리 기능
                        </Text>
                        <Pressable
                            disabled={isSubmitting}
                            onPress={handleToggleSuspend}
                            className={`w-full h-[60px] border-2 border-error-main rounded-2xl flex-row justify-center items-center gap-2 ${
                                isSuspended
                                    ? "border-primary-main bg-primary-light"
                                    : "border-error-main bg-white"
                            }`}>
                            <MaterialIcons
                                name={isSuspended ? "play-circle-outline" : "warning-amber"}
                                size={28}
                                color={isSuspended ? "#7C3AED" : "#EF4444"}
                            />
                            <Text
                                className={`font-pretendard-bold text-xl ${
                                    isSuspended ? "text-primary-main" : "text-error-main"
                                }`}>
                                {isSuspended ? "조직 정지 해제하기" : "조직 정지하기"}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            )}
        </View>
    );
}

export default AdminOrganizationDetailPage;
