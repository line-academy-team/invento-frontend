import React, { useState, useRef, useEffect } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { Href, useLocalSearchParams, useRouter } from "expo-router";
import { twMerge } from "tailwind-merge";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import Badge from "@/components/common/Badge/Badge";
import managerReportApi from "@/api/manager/managerReportApi";
import managerRentalApi from "@/api/manager/managerRentalApi";
import { useUserStore } from "@/stores/user/useUserStore";
import { Report, ReportTypes } from "@/types/report";
import { OrgRental } from "@/types/rental";
import { formatDate } from "@/utils/date";

const reportTypeLabels: Record<ReportTypes, string> = {
    LOST: "분실",
    BROKEN: "고장",
    SHORTAGE: "부족",
    EXCESS: "초과",
    ETC: "기타",
};

const reportTypesByLabel = Object.fromEntries(
    Object.entries(reportTypeLabels).map(([type, label]) => [label, type]),
) as Record<string, ReportTypes>;

function ManagerDamageReportDetailPage() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const organizationId = useUserStore(state => state.authUser?.memberInfo?.organizationId);

    const [isCompleted, setIsCompleted] = useState(false);
    const [report, setReport] = useState<Report | null>(null);
    const [rental, setRental] = useState<OrgRental | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isRentalInfoOpen, setIsRentalInfoOpen] = useState(false);
    const [rentalContentHeight, setRentalContentHeight] = useState(0);
    const rentalInfoHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isRentalInfoOpen) {
            Animated.timing(rentalInfoHeight, {
                toValue: rentalContentHeight,
                duration: 250,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(rentalInfoHeight, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }
    }, [isRentalInfoOpen, rentalContentHeight, rentalInfoHeight]);

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("분실");
    const categories = ["분실", "고장", "부족", "초과", "기타"];
    const [dropdownContentHeight, setDropdownContentHeight] = useState(0);
    const dropdownHeight = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isCategoryDropdownOpen) {
            Animated.timing(dropdownHeight, {
                toValue: dropdownContentHeight,
                duration: 250,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(dropdownHeight, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }).start();
        }
    }, [isCategoryDropdownOpen, dropdownContentHeight, dropdownHeight]);

    const [replyContent, setReplyContent] = useState("");

    useEffect(() => {
        const reportId = Number(id);
        if (!Number.isInteger(reportId)) {
            setIsLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                const [reportData, rentalData] = await Promise.all([
                    managerReportApi.getReportById(reportId),
                    organizationId
                        ? managerRentalApi.getOrgRentalRequestList(organizationId)
                        : Promise.resolve([]),
                ]);
                setReport(reportData);
                setIsCompleted(reportData.status === "COMPLETED");
                setSelectedCategory(reportTypeLabels[reportData.type]);
                setReplyContent(reportData.result || "");
                setRental(
                    rentalData.find(
                        item =>
                            item.equipmentId === reportData.equipmentId &&
                            item.memberId === reportData.reporterId,
                    ) || null,
                );
            } catch (error) {
                console.error(error);
                Alert.alert("조회 실패", "파손 신고 상세를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, organizationId]);

    const handleConfirm = async () => {
        if (!report || !replyContent.trim()) {
            Alert.alert("알림", "답변 내용을 입력해주세요.");
            return;
        }

        try {
            setIsSubmitting(true);
            const updatedReport = await managerReportApi.processReport(report.id, {
                type: reportTypesByLabel[selectedCategory],
                result: replyContent.trim(),
            });
            setReport(current => (current ? { ...current, ...updatedReport } : current));
            Alert.alert("확인", "처리가 완료되었습니다.", [
                {
                    text: "확인",
                    onPress: () => router.replace("/manager/report" as Href),
                },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("처리 실패", "파손 신고 답변 처리 중 오류가 발생했습니다.");
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
                    onBackPress={() => router.navigate("/manager/report" as Href)}
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
        <View className={"flex-1 bg-white"}>
            <MainHeader
                title={"파손신고 상세"}
                isBackPress
                onBackPress={() => {
                    router.navigate("/manager/report" as Href);
                }}
            />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] pt-1 pb-8 flex-1"}>
                    <View className={"flex-1"}>
                        <View className={"border-b border-gray-200 py-5 mb-3"}>
                            <View
                                className={twMerge(
                                    ["pb-3 mb-2 border-b border-gray-300"],
                                    ["flex-row justify-between items-center"],
                                )}>
                                <Text className={"text-lg font-bold"}>파손 정보</Text>

                                <Badge status={isCompleted ? "답변완료" : "답변대기"} />
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-2",
                                    "items-center",
                                ])}>
                                <Text className={"text-gray-500 text-base font-semibold"}>
                                    신청일시
                                </Text>
                                <Text className={"text-gray-800 text-base"}>
                                    {formatDate(report.createdAt, true)}
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-2",
                                    "items-center",
                                ])}>
                                <Text className={"text-gray-500 text-base font-semibold"}>
                                    신청자
                                </Text>
                                <Text className={"text-gray-800 text-base"}>
                                    {report.reporter?.user.name || "사용자"} (
                                    {report.reporter?.user.email || "-"})
                                </Text>
                            </View>
                            <View
                                className={twMerge([
                                    "flex-row",
                                    "justify-between",
                                    "py-2",
                                    "items-center",
                                ])}>
                                <Text className={"text-gray-500 text-base font-semibold"}>
                                    소속
                                </Text>
                                <Text className={"text-gray-800 text-base"}>
                                    {report.reporter?.department?.name || "미지정"} /{" "}
                                    {report.reporter?.role || "MEMBER"}
                                </Text>
                            </View>
                        </View>

                        <View className={"py-3"}>
                            <Text className={"pb-3 text-lg font-bold"}>파손사유</Text>
                            <View className={"bg-gray-100 rounded-2xl p-5 mb-3"}>
                                <Text className={"text-gray-800 text-base leading-6"}>
                                    {report.content}
                                </Text>
                            </View>
                        </View>
                        <View className={"py-3"}>
                            <Text className={"pb-3 text-lg font-bold"}>장비 정보</Text>
                            <View
                                className={twMerge(
                                    ["bg-purple-50", "rounded-2xl", "p-5", "mb-5"],
                                    ["flex-row", "items-center"],
                                )}>
                                <View
                                    className={
                                        "bg-white p-3 rounded-lg mr-4 border border-gray-200"
                                    }>
                                    <Feather
                                        name={"monitor"}
                                        size={32}
                                        className={"text-blue-500"}
                                        color="#3b82f6"
                                    />
                                </View>
                                <View>
                                    <Text
                                        className={twMerge([
                                            "text-gray-800",
                                            "text-lg",
                                            "font-bold",
                                        ])}>
                                        {report.equipment?.name || report.title}
                                    </Text>
                                    <Text className={"py-1 text-sm text-gray-500 font-medium"}>
                                        {report.equipment?.category || "기타"}
                                    </Text>
                                    <Text className={"text-sm text-gray-500 font-medium"}>
                                        수량 {rental?.quantity || 1}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className={"border border-gray-200 rounded-2xl mb-6 overflow-hidden"}>
                            <Pressable
                                className={
                                    "flex-row justify-between items-center p-5 bg-white z-10"
                                }
                                onPress={() => setIsRentalInfoOpen(!isRentalInfoOpen)}>
                                <Text className={"text-lg font-bold text-gray-800"}>
                                    대여정보 확인
                                </Text>
                                <Feather
                                    name={isRentalInfoOpen ? "chevron-up" : "chevron-down"}
                                    size={24}
                                    color="#333"
                                />
                            </Pressable>

                            <Animated.View style={{ height: rentalInfoHeight, overflow: "hidden" }}>
                                <View
                                    className={"absolute top-0 w-full"}
                                    onLayout={e =>
                                        setRentalContentHeight(e.nativeEvent.layout.height)
                                    }>
                                    <View className={"px-5 pb-5 bg-white"}>
                                        <View className={"h-[1px] bg-gray-200 w-full mb-4"} />
                                        <View
                                            className={
                                                "flex-row justify-between py-2 items-center"
                                            }>
                                            <Text className={"text-gray-500 text-sm font-semibold"}>
                                                신청일시
                                            </Text>
                                            <Text className={"text-gray-800 text-sm"}>
                                                {formatDate(rental?.requestedAt, true)}
                                            </Text>
                                        </View>
                                        <View
                                            className={
                                                "flex-row justify-between py-2 items-center"
                                            }>
                                            <Text className={"text-gray-500 text-sm font-semibold"}>
                                                대여기간
                                            </Text>
                                            <Text className={"text-gray-800 text-sm"}>
                                                {formatDate(
                                                    rental?.approvedAt || rental?.requestedAt,
                                                )}{" "}
                                                ~ {formatDate(rental?.dueAt)}
                                            </Text>
                                        </View>
                                        <View
                                            className={
                                                "flex-row justify-between py-2 items-center"
                                            }>
                                            <Text className={"text-gray-500 text-sm font-semibold"}>
                                                사용목적
                                            </Text>
                                            <Text className={"text-gray-800 text-sm"}>
                                                {rental?.reason || "-"}
                                            </Text>
                                        </View>
                                        <View className={"flex-row justify-between py-2 mt-1"}>
                                            <Text
                                                className={
                                                    "text-gray-500 text-sm font-semibold w-1/4"
                                                }>
                                                추가 메모
                                            </Text>
                                            <Text
                                                className={
                                                    "text-gray-800 text-sm w-3/4 text-right leading-5"
                                                }>
                                                {rental?.reason || "-"}
                                            </Text>
                                        </View>

                                        <View className={"bg-gray-100 rounded-xl p-4 mt-4"}>
                                            <Text
                                                className={
                                                    "text-gray-600 text-sm font-semibold mb-1"
                                                }>
                                                예상 반납일
                                            </Text>
                                            <Text className={"text-gray-800 text-base font-medium"}>
                                                {formatDate(rental?.dueAt)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Animated.View>
                        </View>

                        <View className={"py-3 mb-6"}>
                            {isCompleted ? (
                                <View>
                                    <Text className={"pb-3 text-lg font-bold"}>관리자 답변</Text>
                                    <View className={"bg-purple-50 rounded-2xl p-5"}>
                                        <View className={"flex-row items-center mb-3"}>
                                            <Text
                                                className={
                                                    "text-purple-600 font-bold mr-2 border border-purple-200 px-2 py-1 rounded-md text-xs bg-white"
                                                }>
                                                {selectedCategory || "선택 안됨"}
                                            </Text>
                                        </View>
                                        <Text className={"text-gray-800 text-base leading-6"}>
                                            {replyContent || "답변 내용이 없습니다."}
                                        </Text>
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <Text className={"pb-3 text-lg font-bold"}>파손 종류</Text>
                                    <View className={"mb-4"}>
                                        <Pressable
                                            className={
                                                "flex-row justify-between items-center border border-gray-300 rounded-xl p-4 bg-white"
                                            }
                                            onPress={() =>
                                                setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                                            }>
                                            <Text
                                                className={
                                                    selectedCategory
                                                        ? "text-gray-800"
                                                        : "text-gray-800 font-medium"
                                                }>
                                                {selectedCategory || "답변분류 선택"}
                                            </Text>
                                            <Feather
                                                name={
                                                    isCategoryDropdownOpen
                                                        ? "chevron-up"
                                                        : "chevron-down"
                                                }
                                                size={20}
                                                color="#333"
                                            />
                                        </Pressable>

                                        <Animated.View
                                            style={{ height: dropdownHeight, overflow: "hidden" }}>
                                            <View
                                                className={"absolute top-0 w-full"}
                                                onLayout={e =>
                                                    setDropdownContentHeight(
                                                        e.nativeEvent.layout.height,
                                                    )
                                                }>
                                                <View
                                                    className={
                                                        "mt-1 border border-gray-300 rounded-xl bg-white overflow-hidden"
                                                    }>
                                                    {categories.map((item, index) => (
                                                        <Pressable
                                                            key={index}
                                                            className={`p-4 border-b border-gray-100 ${selectedCategory === item ? "bg-purple-500" : "bg-white"}`}
                                                            onPress={() => {
                                                                setSelectedCategory(item);
                                                                setIsCategoryDropdownOpen(false);
                                                            }}>
                                                            <Text
                                                                className={`${selectedCategory === item ? "text-white font-bold" : "text-gray-800"}`}>
                                                                {item}
                                                            </Text>
                                                        </Pressable>
                                                    ))}
                                                </View>
                                            </View>
                                        </Animated.View>
                                    </View>

                                    <View className={"mt-2"}>
                                        <Text className={"pb-3 text-lg font-bold"}>답변</Text>
                                        <TextInput
                                            className={
                                                "w-full border border-gray-300 rounded-xl p-4 text-base text-gray-800 bg-white"
                                            }
                                            style={{ minHeight: 120, textAlignVertical: "top" }}
                                            multiline={true}
                                            placeholder="답변내용을 적어주세요"
                                            placeholderTextColor="#9ca3af"
                                            value={replyContent}
                                            onChangeText={setReplyContent}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                    {!isCompleted && (
                        <View className={"pt-4"}>
                            <Button
                                className={"h-[60px] w-full bg-purple-600 rounded-xl"}
                                textClassName={"text-xl text-white font-bold"}
                                isLoading={isSubmitting}
                                onPress={handleConfirm}>
                                확인
                            </Button>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

export default ManagerDamageReportDetailPage;
