import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import memberRentalApi from "@/api/member/memberRentalApi";
import { MyRental } from "@/types/rental";
import { formatDate } from "@/utils/date";

export default function UserRentalDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [rental, setRental] = useState<MyRental | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const rentalId = Number(id);
        if (!Number.isInteger(rentalId)) {
            setIsLoading(false);
            return;
        }

        memberRentalApi
            .getMyRentalById(rentalId)
            .then(setRental)
            .catch(error => {
                console.error(error);
                Alert.alert("조회 실패", "대여 상세 내역을 불러오지 못했습니다.");
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleReturnComplete = async () => {
        if (!rental) return;

        try {
            setIsSubmitting(true);
            await memberRentalApi.returnRental(rental.id);
            Alert.alert("반납 완료", "장비 반납 처리가 완료되었습니다.", [
                { text: "확인", onPress: () => router.replace("/user/rental") },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("반납 실패", "장비 반납 처리 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelRequest = async () => {
        if (!rental) return;
        try {
            setIsSubmitting(true);
            await memberRentalApi.deleteRentalRequest(rental.id);
            Alert.alert("신청 취소", "대여 신청이 취소되었습니다.", [
                { text: "확인", onPress: () => router.replace("/user/rental") },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("취소 실패", "대여 신청 취소 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const rentalStatus =
        rental?.status === "REQUESTED"
            ? "신청중"
            : rental?.status === "REJECTED"
              ? "반려"
              : rental?.status === "BORROWED"
                ? "대여중"
                : rental?.status === "RETURNED"
                  ? "반납완료"
                  : "취소";

    if (isLoading || !rental) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader
                    title="대여목록 상세"
                    isBackPress
                    onBackPress={() => router.navigate("/user/rental")}
                />
                <View className="flex-1 items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator color="#7C3AED" />
                    ) : (
                        <Text className="text-text-secondary">대여 내역을 찾을 수 없습니다.</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View className={"flex-1 bg-white"}>
            <MainHeader
                title={"대여목록 상세"}
                isBackPress
                onBackPress={() => router.navigate("/user/rental")}
            />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] pt-1 pb-8 flex-1"}>
                    <View
                        className={
                            "h-[200px] w-full rounded-2xl bg-background-default overflow-hidden items-center justify-center mb-5 mt-4"
                        }>
                        {rental.equipment.imageUrl ? (
                            <Image
                                source={{ uri: rental.equipment.imageUrl }}
                                className="w-full h-full"
                            />
                        ) : (
                            <Ionicons name={"laptop-outline"} size={80} color={"#9CA3AF"} />
                        )}
                    </View>

                    <View className={"flex-1"}>
                        <View className={"border-b border-divider py-5 mb-3"}>
                            <View
                                className={twMerge(
                                    ["pb-3 mb-2 border-b border-text-default"],
                                    ["flex-row justify-between items-center"],
                                )}>
                                <Text className={"text-2xl font-semibold"}>
                                    {rental.equipment.name}
                                </Text>
                                <Badge status={rentalStatus} />
                            </View>

                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-3",
                                    "items-center",
                                ])}>
                                <Text className={"text-text-secondary text-base font-semibold"}>
                                    카테고리
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {rental.equipment.category || "기타"}
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
                                    신청일
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {formatDate(rental.requestedAt)}
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
                                    대여수량
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {rental.quantity}대
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
                                    대여일
                                </Text>
                                <Text className={"text-text-default text-base"}>
                                    {formatDate(rental.approvedAt)}
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
                                    반납예정일
                                </Text>
                                <Text className={"text-primary-main text-base font-bold"}>
                                    {formatDate(rental.dueAt)}
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
                                    메모
                                </Text>
                                <Text
                                    className={
                                        "text-text-default text-base text-right flex-1 ml-4"
                                    }>
                                    {rental.reason || "-"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className={twMerge(["flex-row", "w-full", "gap-2"])}>
                        <Button
                            variant={"outline"}
                            className={"h-[60px] w-auto flex-1 border-error-main"}
                            textClassName={"text-xl text-error-main font-semibold"}
                            isLoading={isSubmitting}
                            disabled={rental.status !== "REQUESTED" && rental.status !== "BORROWED"}
                            onPress={
                                rental.status === "REQUESTED"
                                    ? handleCancelRequest
                                    : () => router.push(`/user/rental/${rental.id}/report` as Href)
                            }>
                            {rental.status === "REQUESTED" ? "신청취소" : "파손신고"}
                        </Button>
                        <Button
                            className={"h-[60px] w-auto flex-1 bg-primary-main"}
                            textClassName={"text-xl text-white font-semibold"}
                            isLoading={isSubmitting}
                            disabled={rental.status !== "BORROWED"}
                            onPress={handleReturnComplete}>
                            반납완료
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
