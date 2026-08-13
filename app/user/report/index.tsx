import React, { useCallback, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from "react-native";
import { Href, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";
import memberReportApi from "@/api/member/memberReportApi";
import { Report } from "@/types/report";
import { formatDate } from "@/utils/date";
import { twMerge } from "tailwind-merge";

export default function UserReportListPage() {
    const router = useRouter();
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            setIsLoading(true);

            memberReportApi
                .getReportList()
                .then(data => isActive && setReports(data))
                .catch(error => {
                    console.error(error);
                    Alert.alert("조회 실패", "신고 목록을 불러오지 못했습니다.");
                })
                .finally(() => isActive && setIsLoading(false));

            return () => {
                isActive = false;
            };
        }, []),
    );

    return (
        <View className="flex-1 bg-background-default">
            <MainHeader
                title="내 파손신고"
                isBackPress
                onBackPress={() => router.navigate("/user" as Href)}
            />
            <ScrollView className="flex-1" contentContainerClassName="px-[30px] py-8 flex-grow">
                <View className="rounded-[20px] overflow-hidden bg-white shadow-sm shadow-black/5">
                    {isLoading ? (
                        <ActivityIndicator className="py-10" color="#7C3AED" />
                    ) : reports.length === 0 ? (
                        <Text className="py-10 text-center text-text-secondary">
                            접수한 신고가 없습니다.
                        </Text>
                    ) : (
                        reports.map((report, index) => (
                            <Pressable
                                key={report.id}
                                onPress={() => router.push(`/user/report/${report.id}` as Href)}>
                                <View
                                    className={twMerge(
                                        "p-6 border-b border-divider",
                                        index === reports.length - 1 && "border-b-0",
                                    )}>
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="font-pretendard-bold text-lg text-text-main flex-1 mr-3">
                                            {report.equipment?.name || report.title}
                                        </Text>
                                        <Badge
                                            status={
                                                report.status === "COMPLETED"
                                                    ? "답변완료"
                                                    : "답변대기"
                                            }
                                        />
                                    </View>
                                    <Text className="font-pretendard text-sm text-text-secondary mb-1">
                                        {report.title}
                                    </Text>
                                    <Text className="font-pretendard text-sm text-text-secondary">
                                        {formatDate(report.createdAt)}
                                    </Text>
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
