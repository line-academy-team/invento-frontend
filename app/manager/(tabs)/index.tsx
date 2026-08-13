import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useUserStore } from "@/stores/user/useUserStore";
import managerDashboardApi, {
    DashboardRentalStatus,
    ManagerDashboardData,
} from "@/api/manager/managerDashboardApi";
import { useFocusEffect } from "@react-navigation/native";

const rentalStatusText: Record<DashboardRentalStatus, string> = {
    REQUESTED: "요청",
    REJECTED: "반려",
    BORROWED: "대여중",
    RETURNED: "반납",
    CANCELLED: "취소",
};

function ManagerMainPage() {
    const router = useRouter();
    const { authUser } = useUserStore();

    const [dashboard, setDashboard] = useState<ManagerDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const loadDashboard = async () => {
                try {
                    setIsLoading(true);
                    const data = await managerDashboardApi.getDashboard();
                    if (isActive) setDashboard(data);
                } catch {
                    const message = "대시보드 정보를 불러오는데 실패했습니다.";

                    if (Platform.OS === "web") {
                        alert(message);
                    } else {
                        Alert.alert("오류", message);
                    }
                } finally {
                    if (isActive) setIsLoading(false);
                }
            };

            loadDashboard();

            return () => {
                isActive = false;
            };
        }, []),
    );

    const userName = authUser?.user.name ?? "회원";

    const memberRoleText =
        authUser?.memberInfo?.role === "OWNER"
            ? "오너"
            : authUser?.memberInfo?.role === "MANAGER"
              ? "관리자"
              : "회원";

    const summaryCards = useMemo(
        () => [
            {
                logo: require("@/assets/images/common/build_circle.png"),
                title: "전체 장비 수",
                number: dashboard?.summary.totalEquipment ?? 0,
                background: "bg-secondary-main",
            },
            {
                logo: require("@/assets/images/common/short_stay.png"),
                title: "대여중",
                number: dashboard?.summary.borrowed ?? 0,
                background: "bg-success-main",
            },
            {
                logo: require("@/assets/images/common/box_add.png"),
                title: "대여 요청",
                number: dashboard?.summary.requested ?? 0,
                background: "bg-warning-main",
            },
            {
                logo: require("@/assets/images/common/devices_off.png"),
                title: "고장 신고",
                number: dashboard?.summary.brokenReports ?? 0,
                background: "bg-error-main",
            },
        ],
        [dashboard],
    );

    return (
        <ScrollView>
            <MainHeader variant={"managerMain"} onMenuPress={() => {}} />

            <View className={"flex-1 bg-background-default"}>
                <View className={"px-[30px] py-8 bg-background-default"}>
                    <Text className={"font-pretendard text-lg text-text-default"}>안녕하세요</Text>

                    <View className={"mt-4 flex-row gap-3 items-center"}>
                        <Text className={"font-pretendard-semibold text-xl text-text-default"}>
                            {userName}님
                        </Text>

                        <Badge status={memberRoleText} />
                    </View>

                    <View className={"mt-5 flex-row justify-between flex-wrap gap-2"}>
                        {summaryCards.map(item => (
                            <View
                                className={twMerge(
                                    "w-[48%] h-[120px] rounded-[18px] p-4 justify-between",
                                    item.background,
                                )}
                                key={item.title}>
                                <View className={"flex-row justify-between items-center"}>
                                    <Image
                                        source={item.logo}
                                        style={{
                                            width: 36,
                                            height: 36,
                                        }}
                                    />

                                    <Text className={"font-pretendard-semibold text-lg text-white"}>
                                        {item.title}
                                    </Text>
                                </View>

                                <Text
                                    className={"font-pretendard-bold text-xl text-white self-end"}>
                                    {isLoading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        item.number
                                    )}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View className={"mt-8 flex-row justify-between items-center"}>
                        <Text className={"font-pretendard-medium text-xl"}>최근 대여 요청</Text>

                        <Pressable
                            onPress={() => {
                                router.push("/manager/rental");
                            }}>
                            <View className={"flex-row gap-2 items-center"}>
                                <Text className={"text-text-secondary"}>전체 보기</Text>

                                <Image
                                    source={require("@/assets/images/common/arrow_forward.png")}
                                    style={{
                                        width: 18,
                                        height: 18,
                                    }}
                                />
                            </View>
                        </Pressable>
                    </View>

                    <View className={"mt-3 bg-background-paper rounded-[16px]"}>
                        {isLoading ? (
                            <View className={"py-8 items-center"}>
                                <ActivityIndicator color="#7C3AED" />
                            </View>
                        ) : dashboard && dashboard.recentRentals.length > 0 ? (
                            dashboard.recentRentals.map(item => (
                                <View
                                    className={"py-5 px-5 border-b border-divider last:border-b-0"}
                                    key={item.id}>
                                    <Text
                                        className={
                                            "font-pretendard-semibold text-lg text-text-default"
                                        }>
                                        {item.equipment}
                                    </Text>

                                    <View className={"flex-row justify-between items-center mt-1"}>
                                        <View className={"flex-row gap-1"}>
                                            <Text className={"font-pretendard text-text-secondary"}>
                                                {item.name}
                                            </Text>

                                            <Text className={"font-pretendard text-text-secondary"}>
                                                |
                                            </Text>

                                            <Text className={"font-pretendard text-text-secondary"}>
                                                {item.date}
                                            </Text>
                                        </View>

                                        <Badge
                                            status={rentalStatusText[item.status] ?? item.status}
                                        />
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View className={"py-8 items-center"}>
                                <Text className={"font-pretendard text-text-secondary"}>
                                    최근 대여 내역이 없습니다.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default ManagerMainPage;
