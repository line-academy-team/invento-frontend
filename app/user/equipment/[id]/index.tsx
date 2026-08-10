import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter, useLocalSearchParams } from "expo-router";
import Badge from "@/components/common/Badge/Badge";
import Button from "@/components/common/Button/Button";
import { Ionicons } from "@expo/vector-icons";
import { twMerge } from "tailwind-merge";

export default function UserEquipmentDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const mockData = {
        imageURL:
            "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
        name: "노트북01",
        category: "IT기기",
        totalQuantity: 50,
        availableQuantity: 28,
        description: "업무용 노트북입니다.",
        department: "개발팀",
        status: "이용가능",
    };

    return (
        <View className={"flex-1 bg-white"}>
            <MainHeader title={"장비 상세"} isBackPress onBackPress={() => router.back()} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 flex-1"}>
                    <View
                        className={
                            "h-[200px] w-full rounded-2xl bg-background-default overflow-hidden items-center justify-center"
                        }>
                        {mockData.imageURL ? (
                            <Image
                                source={{ uri: mockData.imageURL }}
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
                            <Text className={"font-semibold text-2xl"}>{mockData.name}</Text>
                            <Badge status={mockData.status} />
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
                                    {mockData.category}
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
                                    {mockData.totalQuantity}
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
                                    {mockData.availableQuantity}
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
                                    {mockData.description}
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
                                    {mockData.department}
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
                    onPress={() => router.push(`/user/equipment/${id}/rental`)}>
                    대여요청
                </Button>
            </View>
        </View>
    );
}
