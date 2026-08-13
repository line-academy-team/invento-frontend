import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter, useLocalSearchParams } from "expo-router";
import Badge from "@/components/common/Badge/Badge";
import Button from "@/components/common/Button/Button";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";
import memberEquipmentApi from "@/api/member/memberEquipmentApi";
import { Equipment } from "@/types/equipment";

export default function UserEquipmentDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const equipmentId = Number(id);
        if (!Number.isInteger(equipmentId)) {
            setIsLoading(false);
            return;
        }

        memberEquipmentApi
            .getEquipmentById(equipmentId)
            .then(setEquipment)
            .catch(error => {
                console.error(error);
                Alert.alert("조회 실패", "장비 정보를 불러오지 못했습니다.");
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const status =
        equipment?.status === "BROKEN"
            ? "파손신고"
            : equipment?.status === "BORROWED" || equipment?.availableQuantity === 0
              ? "대여중"
              : "이용가능";

    if (isLoading || !equipment) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title="장비 상세" isBackPress onBackPress={() => router.back()} />
                <View className="flex-1 items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator color="#7C3AED" />
                    ) : (
                        <Text className="text-text-secondary">장비 정보를 찾을 수 없습니다.</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View className={"flex-1 bg-white"}>
            <MainHeader title={"장비 상세"} isBackPress onBackPress={() => router.back()} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 flex-1"}>
                    <View
                        className={
                            "h-[200px] w-full rounded-2xl bg-background-default overflow-hidden items-center justify-center"
                        }>
                        {equipment.imageUrl ? (
                            <Image
                                source={{ uri: equipment.imageUrl }}
                                className={"w-full h-full"}
                                resizeMode={"cover"}
                            />
                        ) : (
                            <Ionicons name={"image-outline"} size={48} color={"#9CA3AF"} />
                        )}
                    </View>

                    <View className={"py-[30px] flex-1"}>
                        <View
                            className={twMerge(
                                ["flex-row", "justify-between", "items-center"],
                                ["py-5", "border-b", "border-text-secondary"],
                            )}>
                            <Text className={"font-semibold text-2xl"}>{equipment.name}</Text>
                            <Badge status={status} />
                        </View>

                        <View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "items-center",
                                    "border-b border-divider py-5",
                                ])}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                    ])}>
                                    카테고리
                                </Text>
                                <Text className={twMerge(["text-lg", "text-text-default"])}>
                                    {equipment.category || "기타"}
                                </Text>
                            </View>

                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "items-center",
                                    "border-b border-divider py-5",
                                ])}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                    ])}>
                                    총 수량
                                </Text>
                                <Text className={twMerge(["text-lg", "text-text-default"])}>
                                    {equipment.totalQuantity}
                                </Text>
                            </View>

                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "items-center",
                                    "border-b border-divider py-5",
                                ])}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                    ])}>
                                    사용가능
                                </Text>
                                <Text className={twMerge(["text-lg", "text-success-main"])}>
                                    {equipment.availableQuantity}
                                </Text>
                            </View>

                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "items-center",
                                    "border-b border-divider py-5",
                                ])}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                        "min-[100px]",
                                    ])}>
                                    설명
                                </Text>
                                <Text className={twMerge(["text-lg", "text-text-default"])}>
                                    {equipment.description || "-"}
                                </Text>
                            </View>

                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "items-center",
                                    "border-b border-divider py-5",
                                ])}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                        "min-[100px]",
                                    ])}>
                                    보관 부서
                                </Text>
                                <Text className={twMerge(["text-lg", "text-text-default"])}>
                                    {equipment.department?.name || "공용"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View className={"px-[30px] pb-8 pt-4"}>
                <Button
                    className={"h-[60px] w-full"}
                    textClassName={"text-xl"}
                    disabled={equipment.availableQuantity === 0 || equipment.status !== "AVAILABLE"}
                    onPress={() => router.push(`/user/equipment/${id}/rental`)}>
                    대여요청
                </Button>
            </View>
        </View>
    );
}
