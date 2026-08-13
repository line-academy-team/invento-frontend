import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { Ionicons } from "@expo/vector-icons";
import memberEquipmentApi from "@/api/member/memberEquipmentApi";
import memberRentalApi from "@/api/member/memberRentalApi";
import { Equipment } from "@/types/equipment";
import { parseRentalDueDate } from "@/utils/date";

export default function UserEquipmentRentalPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [quantity, setQuantity] = useState("1");
    const [reason, setReason] = useState("");
    const [date, setDate] = useState("");
    const [memo, setMemo] = useState("");
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const canChangeQuantity = equipment?.type === "CONSUMABLE";

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

    const handleDecrease = () => {
        if (!canChangeQuantity) return;
        const num = parseInt(quantity, 10);
        if (num > 1) setQuantity((num - 1).toString());
    };

    const handleIncrease = () => {
        if (!canChangeQuantity) return;
        const num = parseInt(quantity, 10) || 0;
        if (!equipment || num < equipment.availableQuantity) {
            setQuantity((num + 1).toString());
        }
    };

    const handleRequest = async () => {
        if (!reason.trim() || !date.trim()) {
            Alert.alert("알림", "필수 항목(* )을 모두 입력해주세요.");
            return;
        }

        if (!equipment) return;

        const dueAt = parseRentalDueDate(date);
        if (!dueAt) {
            Alert.alert("알림", "사용예정 기간을 YYYY.MM.DD~YYYY.MM.DD 형식으로 입력해주세요.");
            return;
        }

        const requestQuantity = Number(quantity);
        if (
            !Number.isInteger(requestQuantity) ||
            requestQuantity < 1 ||
            requestQuantity > equipment.availableQuantity
        ) {
            Alert.alert("알림", `대여 수량은 1~${equipment.availableQuantity}개까지 가능합니다.`);
            return;
        }

        const requestReason = memo.trim()
            ? `${reason.trim()} / 추가 메모: ${memo.trim()}`
            : reason.trim();
        if (requestReason.length > 255) {
            Alert.alert("알림", "사용 목적과 추가 메모는 합쳐서 255자 이내로 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            await memberRentalApi.createRentalRequest({
                equipmentId: equipment.id,
                quantity: requestQuantity,
                reason: requestReason,
                dueAt,
            });
            Alert.alert("알림", "대여 신청이 완료되었습니다.", [
                {
                    text: "확인",
                    onPress: () => router.replace("/user/equipment"),
                },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("신청 실패", "대여 신청 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-[30px] pt-6 pb-4 border-b border-gray-100">
                <Text className="font-pretendard-bold text-xl text-primary-main">
                    장비대여 신청
                </Text>
                <Pressable onPress={() => router.back()} className="p-1 active:opacity-70">
                    <Ionicons name="close" size={24} color="#6B7280" />
                </Pressable>
            </View>

            {isLoading || !equipment ? (
                <View className="flex-1 items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator color="#7C3AED" />
                    ) : (
                        <Text className="text-text-secondary">장비 정보를 찾을 수 없습니다.</Text>
                    )}
                </View>
            ) : (
                <ScrollView className="flex-1" contentContainerClassName="p-[30px] pb-10 flex-grow">
                    <View className="flex-row items-center p-4 bg-primary-light/10 rounded-2xl mb-8 border border-primary-light/20">
                        <View className="w-[60px] h-[60px] bg-white rounded-xl mr-4 items-center justify-center border border-gray-100 overflow-hidden">
                            {equipment.imageUrl ? (
                                <Image
                                    source={{ uri: equipment.imageUrl }}
                                    className="w-full h-full"
                                />
                            ) : (
                                <Ionicons name="laptop-outline" size={32} color="#9CA3AF" />
                            )}
                        </View>
                        <View className="flex-1 justify-center">
                            <Text className="font-pretendard-bold text-lg text-text-default mb-1">
                                {equipment.name}
                            </Text>
                            <View className="flex-row items-center">
                                <Text className="font-pretendard-medium text-sm text-text-secondary mr-2">
                                    {equipment.category || "기타"}
                                </Text>
                                <Badge
                                    status={equipment.availableQuantity > 0 ? "이용가능" : "대여중"}
                                />
                            </View>
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="font-pretendard-bold text-base text-text-default mb-2">
                            수량
                        </Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-[56px] bg-white">
                            <TextInput
                                value={quantity}
                                onChangeText={value => canChangeQuantity && setQuantity(value)}
                                editable={canChangeQuantity}
                                keyboardType="numeric"
                                className="flex-1 font-pretendard-medium text-base text-text-default"
                            />
                            <View className="flex-row items-center gap-x-2">
                                <Pressable
                                    onPress={handleDecrease}
                                    disabled={!canChangeQuantity}
                                    className={`w-[30px] h-[30px] items-center justify-center border rounded-lg active:opacity-70 ${canChangeQuantity ? "border-primary-light" : "border-gray-200 bg-gray-100"}`}>
                                    <Ionicons
                                        name="remove"
                                        size={18}
                                        color={canChangeQuantity ? "#7C3AED" : "#9CA3AF"}
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={handleIncrease}
                                    disabled={!canChangeQuantity}
                                    className={`w-[30px] h-[30px] items-center justify-center rounded-lg active:opacity-70 ${canChangeQuantity ? "bg-primary-main" : "bg-gray-200"}`}>
                                    <Ionicons name="add" size={18} color="#FFFFFF" />
                                </Pressable>
                            </View>
                            {!canChangeQuantity && (
                                <Text className="font-pretendard text-sm text-text-secondary mt-2">
                                    소모품이 아닌 장비는 1개씩만 대여할 수 있습니다.
                                </Text>
                            )}
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="font-pretendard-bold text-base text-text-default mb-2">
                            사용 목적 <Text className="text-error-main">*</Text>
                        </Text>
                        <TextInput
                            value={reason}
                            onChangeText={setReason}
                            placeholder="예) 회의 행사 교육 등"
                            placeholderTextColor="#9CA3AF"
                            className="border border-gray-300 rounded-xl px-4 h-[56px] font-pretendard text-base text-text-default bg-white"
                        />
                    </View>

                    <View className="mb-6">
                        <Text className="font-pretendard-bold text-base text-text-default mb-2">
                            사용예정 기간 <Text className="text-error-main">*</Text>
                        </Text>
                        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 h-[56px] bg-white">
                            <TextInput
                                value={date}
                                onChangeText={setDate}
                                placeholder="2026.07.24~2026.07.30"
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 font-pretendard text-base text-text-default"
                            />
                            <Ionicons name="calendar-outline" size={20} color="#4B5563" />
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="font-pretendard-bold text-base text-text-default mb-2">
                            추가 메모
                        </Text>
                        <TextInput
                            value={memo}
                            onChangeText={setMemo}
                            placeholder="메모를 입력해주세요"
                            placeholderTextColor="#9CA3AF"
                            multiline
                            textAlignVertical="top"
                            className="border border-gray-300 rounded-xl p-4 min-h-[100px] font-pretendard text-base text-text-default bg-white"
                        />
                    </View>

                    {date.length > 0 && (
                        <View className="bg-primary-light/10 border border-primary-light rounded-xl p-4 mb-2">
                            <Text className="font-pretendard-medium text-sm text-primary-main">
                                예상 반납일
                            </Text>
                            <Text className="font-pretendard-bold text-base text-primary-main mt-1">
                                {date.split("~")[1]?.trim() || "입력 중..."}
                            </Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <View className="px-[30px] pb-8 pt-2 bg-white">
                <Button
                    className="h-[60px] rounded-[16px]"
                    textClassName="text-xl"
                    isLoading={isSubmitting}
                    disabled={!equipment || equipment.availableQuantity === 0}
                    onPress={handleRequest}>
                    신청완료
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}
