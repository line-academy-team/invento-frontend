import React, { useState } from "react";
import { ScrollView, Text, View, Modal, TextInput, Pressable, Alert } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Feather, Ionicons } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";

export default function UserRentalDetailPage() {
    const router = useRouter();

    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [reportMemo, setReportMemo] = useState("");

    const handleReturnComplete = () => {
        Alert.alert("반납 완료", "장비 반납 처리가 완료되었습니다.", [
            { text: "확인", onPress: () => router.navigate("/user/rental") },
        ]);
    };

    const handleReportComplete = () => {
        setIsReportModalVisible(false);
        Alert.alert("파손신고 접수", "파손 신고가 접수되었습니다.", [
            { text: "확인", onPress: () => router.navigate("/user/rental") },
        ]);
        setReportMemo("");
    };

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
                        <Ionicons name={"laptop-outline"} size={80} color={"#9CA3AF"} />
                    </View>

                    <View className={"flex-1"}>
                        <View className={"border-b border-divider py-5 mb-3"}>
                            <View
                                className={twMerge(
                                    ["pb-3 mb-2 border-b border-text-default"],
                                    ["flex-row justify-between items-center"],
                                )}>
                                <Text className={"text-2xl font-semibold"}>노트북01</Text>
                                <Badge status={"대여중"} />
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
                                <Text className={"text-text-default text-base"}>IT 기기</Text>
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
                                <Text className={"text-text-default text-base"}>2026.07.20</Text>
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
                                <Text className={"text-text-default text-base"}>1대</Text>
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
                                <Text className={"text-text-default text-base"}>2026.07.20</Text>
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
                                    2026.07.30
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
                                    거치대도 추가해주세요
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className={twMerge(["flex-row", "w-full", "gap-2"])}>
                        <Button
                            variant={"outline"}
                            className={"h-[60px] w-auto flex-1 border-error-main"}
                            textClassName={"text-xl text-error-main font-semibold"}
                            onPress={() => setIsReportModalVisible(true)}>
                            파손신고
                        </Button>
                        <Button
                            className={"h-[60px] w-auto flex-1 bg-primary-main"}
                            textClassName={"text-xl text-white font-semibold"}
                            onPress={handleReturnComplete}>
                            반납완료
                        </Button>
                    </View>
                </View>
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={isReportModalVisible}
                onRequestClose={() => setIsReportModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50 px-[40px]">
                    <View className="bg-white w-full max-w-[430px] rounded-[20px] p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-primary-main">
                                장비파손신고
                            </Text>
                            <Pressable onPress={() => setIsReportModalVisible(false)}>
                                <Feather name="x" size={24} color="#666" />
                            </Pressable>
                        </View>

                        <View className="bg-background-default border border-gray-100 rounded-2xl p-4 mb-5">
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="font-semibold text-lg text-text-default">
                                    노트북01
                                </Text>
                                <Text className="text-sm text-text-secondary">IT 기기</Text>
                            </View>
                            <Text className="text-sm text-text-secondary">
                                사용기간 : 2026.07.24~2026.07.30
                            </Text>
                        </View>

                        <View className="mb-8">
                            <Text className="text-lg font-bold mb-3">문제점</Text>
                            <TextInput
                                className="w-full border border-gray-300 rounded-xl p-4 text-base text-gray-800"
                                style={{ minHeight: 120, textAlignVertical: "top" }}
                                multiline={true}
                                placeholder="파손 사유나 문제점을 상세히 적어주세요."
                                placeholderTextColor="#9ca3af"
                                value={reportMemo}
                                onChangeText={setReportMemo}
                            />
                        </View>

                        <Button
                            className="h-[56px] bg-primary-main rounded-xl"
                            textClassName="text-white text-lg font-bold"
                            onPress={handleReportComplete}>
                            신청완료
                        </Button>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
