import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import memberReportApi from "@/api/member/memberReportApi";
import { Report } from "@/types/report";
import { formatDate } from "@/utils/date";

export default function UserReportDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const reportId = Number(id);
        if (!Number.isInteger(reportId)) {
            setIsLoading(false);
            return;
        }

        memberReportApi
            .getReportById(reportId)
            .then(setReport)
            .catch(error => {
                console.error(error);
                Alert.alert("조회 실패", "신고 상세를 불러오지 못했습니다.");
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    const handleCancel = async () => {
        if (!report || report.status !== "PENDING") return;

        try {
            setIsSubmitting(true);
            await memberReportApi.deleteReport(report.id);
            Alert.alert("신고 취소", "파손 신고가 취소되었습니다.", [
                {
                    text: "확인",
                    onPress: () => router.replace("/user/report" as Href),
                },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("취소 실패", "파손 신고 취소 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || !report) {
        return (
            <View className="flex-1 bg-white">
                <MainHeader
                    title="파손신고 상세"
                    isBackPress
                    onBackPress={() => router.navigate("/user/report" as Href)}
                />
                <View className="flex-1 items-center justify-center">
                    {isLoading ? (
                        <ActivityIndicator color="#7C3AED" />
                    ) : (
                        <Text className="text-text-secondary">신고 내역을 찾을 수 없습니다.</Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <MainHeader
                title="파손신고 상세"
                isBackPress
                onBackPress={() => router.navigate("/user/report" as Href)}
            />
            <ScrollView className="flex-1" contentContainerClassName="px-[30px] py-8 flex-grow">
                <View className="flex-row justify-between items-center border-b border-text-default pb-4 mb-5">
                    <Text className="font-pretendard-bold text-xl text-text-default flex-1 mr-3">
                        {report.equipment?.name || report.title}
                    </Text>
                    <Badge status={report.status === "COMPLETED" ? "답변완료" : "답변대기"} />
                </View>

                <View className="gap-y-5">
                    <View className="flex-row justify-between border-b border-divider pb-5">
                        <Text className="font-pretendard-semibold text-text-secondary">신고일</Text>
                        <Text className="font-pretendard text-text-default">
                            {formatDate(report.createdAt, true)}
                        </Text>
                    </View>
                    <View>
                        <Text className="font-pretendard-bold text-lg text-text-default mb-3">
                            {report.title}
                        </Text>
                        <View className="bg-background-default rounded-2xl p-5">
                            <Text className="font-pretendard text-base text-text-default leading-6">
                                {report.content}
                            </Text>
                        </View>
                    </View>

                    {report.status === "COMPLETED" && (
                        <View>
                            <Text className="font-pretendard-bold text-lg text-text-default mb-3">
                                관리자 답변
                            </Text>
                            <View className="bg-primary-light rounded-2xl p-5">
                                <Text className="font-pretendard text-base text-text-default leading-6">
                                    {report.result || "처리가 완료되었습니다."}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View className="px-[30px] pb-8 pt-2 bg-white">
                <Button
                    variant="outline"
                    className="h-[60px] border-error-main"
                    textClassName="text-xl text-error-main"
                    disabled={report.status !== "PENDING"}
                    isLoading={isSubmitting}
                    onPress={handleCancel}>
                    신고취소
                </Button>
            </View>
        </View>
    );
}
