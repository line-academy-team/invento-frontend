import React, { useState } from "react";
import {
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
import { useRouter } from "expo-router";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import { Ionicons } from "@expo/vector-icons";

export default function UserEquipmentRentalPage() {
    const router = useRouter();
    const [quantity, setQuantity] = useState("1");
    const [reason, setReason] = useState("");
    const [date, setDate] = useState("");
    const [memo, setMemo] = useState("");

    const handleDecrease = () => {
        const num = parseInt(quantity, 10);
        if (num > 1) setQuantity((num - 1).toString());
    };

    const handleIncrease = () => {
        const num = parseInt(quantity, 10) || 0;
        setQuantity((num + 1).toString());
    };

    const handleRequest = () => {
        if (!reason.trim() || !date.trim()) {
            Alert.alert("알림", "필수 항목(* )을 모두 입력해주세요.");
            return;
        }

        Alert.alert("알림", "대여 신청이 완료되었습니다.", [
            {
                text: "확인",
                onPress: () => router.navigate("/user/equipment"),
            },
        ]);
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

            <ScrollView className="flex-1" contentContainerClassName="p-[30px] pb-10 flex-grow">
                <View className="flex-row items-center p-4 bg-primary-light/10 rounded-2xl mb-8 border border-primary-light/20">
                    <View className="w-[60px] h-[60px] bg-white rounded-xl mr-4 items-center justify-center border border-gray-100 overflow-hidden">
                        <Ionicons name="laptop-outline" size={32} color="#9CA3AF" />
                    </View>
                    <View className="flex-1 justify-center">
                        <Text className="font-pretendard-bold text-lg text-text-default mb-1">
                            노트북01
                        </Text>
                        <View className="flex-row items-center">
                            <Text className="font-pretendard-medium text-sm text-text-secondary mr-2">
                                IT 기기
                            </Text>
                            <Badge status="이용가능" />
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
                            onChangeText={setQuantity}
                            keyboardType="numeric"
                            className="flex-1 font-pretendard-medium text-base text-text-default"
                        />
                        <View className="flex-row items-center gap-x-2">
                            <Pressable
                                onPress={handleDecrease}
                                className="w-[30px] h-[30px] items-center justify-center border border-primary-light rounded-lg active:opacity-70">
                                <Ionicons name="remove" size={18} color="#7C3AED" />
                            </Pressable>
                            <Pressable
                                onPress={handleIncrease}
                                className="w-[30px] h-[30px] items-center justify-center bg-primary-main rounded-lg active:opacity-70">
                                <Ionicons name="add" size={18} color="#FFFFFF" />
                            </Pressable>
                        </View>
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

            <View className="px-[30px] pb-8 pt-2 bg-white">
                <Button className="h-[60px] rounded-[16px]" textClassName="text-xl" onPress={handleRequest}>
                    신청완료
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}