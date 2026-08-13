import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import managerRentalApi from "@/api/manager/managerRentalApi";
import { useUserStore } from "@/stores/user/useUserStore";
import { OrgRental } from "@/types/rental";
import { formatDate } from "@/utils/date";

function ManagerRentalRequestDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const organizationId = useUserStore(state => state.authUser?.memberInfo?.organizationId);

    const [isApproveModalVisible, setIsApproveModalVisible] = useState(false);
    const [memo, setMemo] = useState("");

    const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
    const [rejectMemo, setRejectMemo] = useState("");
    const [rental, setRental] = useState<OrgRental | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const rentalId = Number(id);
        if (!organizationId || !Number.isInteger(rentalId)) {
            setIsLoading(false);
            return;
        }

        managerRentalApi
            .getOrgRentalById(organizationId, rentalId)
            .then(setRental)
            .catch(error => {
                console.error(error);
                Alert.alert("조회 실패", "대여 요청 상세를 불러오지 못했습니다.");
            })
            .finally(() => setIsLoading(false));
    }, [id, organizationId]);

    const handleApproveComplete = async () => {
        if (!organizationId || !rental) return;

        try {
            setIsSubmitting(true);
            await managerRentalApi.processRental(organizationId, rental.id, {
                status: "BORROWED",
            });
            setIsApproveModalVisible(false);
            Alert.alert("승인 완료", "승인 처리가 완료되었습니다.", [
                { text: "확인", onPress: () => router.replace("/manager/rental") },
            ]);
            setMemo("");
        } catch (error) {
            console.error(error);
            Alert.alert("승인 실패", "대여 승인 처리 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectComplete = async () => {
        if (!organizationId || !rental) return;
        if (!rejectMemo.trim()) {
            Alert.alert("알림", "반려 사유를 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            await managerRentalApi.processRental(organizationId, rental.id, {
                status: "REJECTED",
                rejectedReason: rejectMemo.trim(),
            });
            setIsRejectModalVisible(false);
            Alert.alert("반려 완료", "반려 처리가 완료되었습니다.", [
                { text: "확인", onPress: () => router.replace("/manager/rental") },
            ]);
            setRejectMemo("");
        } catch (error) {
            console.error(error);
            Alert.alert("반려 실패", "대여 반려 처리 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const status =
        rental?.status === "REQUESTED"
            ? "대기"
            : rental?.status === "REJECTED"
              ? "반려"
              : rental?.status === "BORROWED" || rental?.status === "RETURNED"
                ? "승인"
                : "취소";

    if (isLoading || !rental) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader
                    title="대여 요청 상세"
                    isBackPress
                    onBackPress={() => router.navigate("/manager/rental")}
                />
                <View className="flex-1 items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator color="#7C3AED" />
                    ) : (
                        <Text className="text-text-secondary">대여 요청을 찾을 수 없습니다.</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View className={"flex-1 bg-white"}>
            <MainHeader
                title={"대여 요청 상세"}
                isBackPress
                onBackPress={() => {
                    router.navigate("/manager/rental");
                }}
            />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] pt-1 pb-8 flex-1"}>
                    <View className={"flex-1"}>
                        <View className={"border-b border-divider py-5 mb-3"}>
                            <View
                                className={twMerge(
                                    ["pb-3 mb-2 border-b border-text-default"],
                                    ["flex-row justify-between items-center"],
                                )}>
                                <Text className={"text-lg font-semibold"}>신청정보</Text>
                                <Badge status={status} />
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    신청일시
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {formatDate(rental.requestedAt, true)}
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    신청자
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {rental.member.user.name} ({rental.member.user.email})
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "pt-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    소속
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {rental.member.department?.name || "미지정"} /{" "}
                                    {rental.member.role}
                                </Text>
                            </View>
                        </View>

                        <View className={"py-5 mb-3"}>
                            <Text className={"pb-3 text-lg font-semibold"}>장비정보</Text>
                            <View
                                className={twMerge(
                                    ["bg-background-default", "rounded-2xl", "p-5"],
                                    ["flex-row"],
                                )}>
                                <View>
                                    <Feather
                                        name={"image"}
                                        size={36}
                                        className={"text-text-secondary mr-4"}
                                    />
                                </View>
                                <View>
                                    <Text
                                        className={twMerge([
                                            "text-text-default",
                                            "text-xl",
                                            "font-semibold",
                                        ])}>
                                        {rental.equipment.name}
                                    </Text>
                                    <Text className={"py-2 text-sm text-text-secondary"}>
                                        {rental.equipment.category || "기타"}
                                    </Text>
                                    <Text className={"text-sm text-text-secondary"}>
                                        수량 {rental.quantity}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className={"border-b border-divider py-5 mb-3"}>
                            <Text
                                className={
                                    "pb-3 mb-2 border-b border-text-default text-lg font-semibold"
                                }>
                                대여정보
                            </Text>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    대여기간
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {formatDate(rental.approvedAt || rental.requestedAt)} ~{" "}
                                    {formatDate(rental.dueAt)}
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-lg font-semibold"}>
                                    사용목적
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {rental.reason || "-"}
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "pt-3",
                                    "pb-5",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-lg font-semibold"}>
                                    추가메모
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {rental.reason || "-"}
                                </Text>
                            </View>
                        </View>

                        <View className={"py-5 mb-3"}>
                            <View
                                className={twMerge(
                                    ["bg-background-deep", "rounded-2xl", "p-5"],
                                    ["flex-row", "justify-between"],
                                )}>
                                <Text className={"text-text-default font-semibold"}>
                                    예상 반납일
                                </Text>
                                <Text className={"text-text-default"}>
                                    {formatDate(rental.dueAt)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {rental.status === "REQUESTED" && (
                        <View className={twMerge(["flex-row", "w-full", "gap-2"])}>
                            <Button
                                variant={"outline"}
                                className={"h-[60px] w-auto flex-1"}
                                textClassName={"text-xl text-red-500"}
                                onPress={() => setIsRejectModalVisible(true)}>
                                반려
                            </Button>
                            <Button
                                className={"h-[60px] w-auto flex-1 bg-purple-700"}
                                textClassName={"text-xl text-white"}
                                onPress={() => setIsApproveModalVisible(true)}>
                                승인
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isApproveModalVisible}
                onRequestClose={() => setIsApproveModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50 px-[40px]">
                    <View className="bg-white w-full max-w-[430px] rounded-[20px] p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-purple-600">승인처리</Text>
                            <Pressable onPress={() => setIsApproveModalVisible(false)}>
                                <Feather name="x" size={24} color="#666" />
                            </Pressable>
                        </View>

                        <View className="items-center mb-8">
                            <Text className="text-lg font-bold mb-3">메모</Text>
                            <TextInput
                                className="w-full border border-gray-400 rounded-xl p-4 text-base text-gray-800"
                                style={{ minHeight: 100, textAlignVertical: "top" }}
                                multiline={true}
                                placeholder="승인 메모를 입력해주세요."
                                placeholderTextColor="#9ca3af"
                                value={memo}
                                onChangeText={setMemo}
                            />
                        </View>

                        <Button
                            className="h-[56px] bg-purple-500 rounded-xl"
                            textClassName="text-white text-lg font-bold"
                            isLoading={isSubmitting}
                            onPress={handleApproveComplete}>
                            승인 완료
                        </Button>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isRejectModalVisible}
                onRequestClose={() => setIsRejectModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50 px-[40px]">
                    <View className="bg-white w-full max-w-[430px] rounded-[20px] p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-red-500">반려처리</Text>
                            <Pressable onPress={() => setIsRejectModalVisible(false)}>
                                <Feather name="x" size={24} color="#666" />
                            </Pressable>
                        </View>

                        <View className="items-center mb-8">
                            <Text className="text-lg font-bold mb-3">메모</Text>
                            <TextInput
                                className="w-full border border-gray-400 rounded-xl p-4 text-base text-gray-800"
                                style={{ minHeight: 100, textAlignVertical: "top" }}
                                multiline={true}
                                placeholder="반려 사유를 입력해주세요."
                                placeholderTextColor="#9ca3af"
                                value={rejectMemo}
                                onChangeText={setRejectMemo}
                            />
                        </View>

                        <Button
                            variant="outline"
                            className="h-[56px] rounded-xl border-red-500 bg-white border"
                            textClassName="text-red-500 text-lg font-bold"
                            isLoading={isSubmitting}
                            onPress={handleRejectComplete}>
                            반려 완료
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
export default ManagerRentalRequestDetailPage;
