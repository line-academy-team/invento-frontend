import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import memberRentalApi from "@/api/member/memberRentalApi";
import memberReportApi from "@/api/member/memberReportApi";
import { MyRental } from "@/types/rental";
import { formatDate } from "@/utils/date";

export default function UserDamageReportCreatePage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [rental, setRental] = useState<MyRental | null>(null);
    const [content, setContent] = useState("");
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
                Alert.alert("조회 실패", "대여 정보를 불러오지 못했습니다.");
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleSubmit = async () => {
        if (!rental || rental.status !== "BORROWED") return;
        if (!content.trim()) {
            Alert.alert("알림", "파손 사유나 문제점을 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            await memberReportApi.createReport({
                equipmentId: rental.equipmentId,
                type: "BROKEN",
                title: `${rental.equipment.name} 파손 신고`.slice(0, 100),
                content: content.trim(),
            });
            Alert.alert("파손신고 접수", "파손 신고가 접수되었습니다.", [
                {
                    text: "확인",
                    onPress: () => router.replace("/user/report" as Href),
                },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("신고 실패", "파손 신고 접수 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !rental) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader title="장비파손신고" isBackPress onBackPress={() => router.back()} />
                <View className="flex-1 items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator color="#7C3AED" />
                    ) : (
                        <Text className="text-text-secondary">대여 정보를 찾을 수 없습니다.</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white">
            <MainHeader title="장비파손신고" isBackPress onBackPress={() => router.back()} />

            <ScrollView className="flex-1" contentContainerClassName="px-[30px] py-8 flex-grow">
                <View className="bg-background-default border border-divider rounded-2xl p-5 mb-8">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="font-pretendard-bold text-xl text-text-default">
                            {rental.equipment.name}
                        </Text>
                        <Badge status={rental.status === "BORROWED" ? "대여중" : "신고불가"} />
                    </View>
                    <Text className="font-pretendard text-sm text-text-secondary mb-2">
                        {rental.equipment.category || "기타"} · 수량 {rental.quantity}
                    </Text>
                    <Text className="font-pretendard text-sm text-text-secondary">
                        사용기간 {formatDate(rental.approvedAt)} ~ {formatDate(rental.dueAt)}
                    </Text>
                </View>

                <View className="mb-8">
                    <Text className="font-pretendard-bold text-lg text-text-default mb-3">
                        문제점 <Text className="text-error-main">*</Text>
                    </Text>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        editable={rental.status === "BORROWED"}
                        placeholder="파손 사유나 문제점을 상세히 적어주세요."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        textAlignVertical="top"
                        className="border border-gray-300 rounded-xl p-4 min-h-[180px] font-pretendard text-base text-text-default bg-white"
                    />
                </View>

                {rental.status !== "BORROWED" && (
                    <View className="bg-warning-light rounded-xl p-4">
                        <Text className="font-pretendard-medium text-warning-main">
                            대여중인 장비만 파손 신고를 접수할 수 있습니다.
                        </Text>
                    </View>
                )}
            </ScrollView>

            <View className="px-[30px] pb-8 pt-2 bg-white">
                <Button
                    className="h-[60px]"
                    textClassName="text-xl"
                    disabled={rental.status !== "BORROWED" || !content.trim()}
                    isLoading={isSubmitting}
                    onPress={handleSubmit}>
                    신고완료
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}
