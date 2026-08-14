import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    View,
    Text,
    Image,
    Pressable,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useUserStore } from "@/stores/user/useUserStore";
import memberRentalApi from "@/api/member/memberRentalApi";
import { MyRental } from "@/types/rental";
import memberReportApi from "@/api/member/memberReportApi";
import { formatDate } from "@/utils/date";
import { useFocusEffect } from "@react-navigation/native";

function UserMainPage() {
    const router = useRouter();
    const [rentalList, setRentalList] = useState<MyRental[]>([]);
    const [reportCount, setReportCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { authUser } = useUserStore();
    const userName = authUser?.user.name ?? "회원";
    const memberRoleText = "사용자";

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const loadUserDashboard = async () => {
                try {
                    setIsLoading(true);
                    const [myRentals, myReports] = await Promise.all([
                        memberRentalApi.getMyRentalRequestList(),
                        memberReportApi.getReportList(),
                    ]);
                    if (isActive) {
                        setRentalList(myRentals);
                        setReportCount(myReports.length);
                    }
                } catch {
                    const msg = "대여 현황 정보를 불러오는데 실패했습니다.";
                    if (Platform.OS === "web") {
                        alert(msg);
                    } else {
                        Alert.alert("오류", msg);
                    }
                } finally {
                    if (isActive) setIsLoading(false);
                }
            };

            loadUserDashboard();

            return () => {
                isActive = false;
            };
        }, []),
    );

    const summaryCards = [
        {
            logo: require("@/assets/images/common/build_circle.png"),
            title: "내 대여 장비",
            number: rentalList.filter(rental => rental.status === "BORROWED").length.toString(),
            background: "bg-secondary-main",
            route: "/user/report",
        },
        {
            logo: require("@/assets/images/common/short_stay.png"),
            title: "내 반납예정",
            number: rentalList
                .filter(rental => rental.status === "BORROWED" && rental.dueAt)
                .length.toString(),
            background: "bg-success-main",
            route: "/user/rental",
        },
        {
            logo: require("@/assets/images/common/box_add.png"),
            title: "내 요청",
            number: rentalList.filter(rental => rental.status === "REQUESTED").length.toString(),
            background: "bg-warning-main",
            route: "/user/rental",
        },
        {
            logo: require("@/assets/images/common/devices_off.png"),
            title: "내 신고",
            number: reportCount.toString(),
            background: "bg-error-main",
            route: "/user/rental",
        },
    ];

    const getStatus = (rental: MyRental) => {
        if (rental.status === "REQUESTED") return "신청중";
        if (rental.status === "REJECTED") return "반려";
        if (rental.status === "BORROWED") return rental.dueAt ? "반납예정" : "대여중";
        if (rental.status === "RETURNED") return "반납완료";
        return "취소";
    };

    const rentalStatusList = rentalList.slice(0, 3);

    return (
        <View className={"flex-1 bg-background-default"}>
            <MainHeader variant={"userMain"} onMenuPress={() => {}} />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 bg-background-default"}>
                    <Text className={"font-pretendard text-lg text-text-default"}>안녕하세요</Text>

                    <View className={"mt-4 flex-row gap-3 items-center"}>
                        <Text className={"font-pretendard-semibold text-xl text-text-default"}>
                            {userName}님
                        </Text>

                        <Badge status={memberRoleText} />
                    </View>

                    <View className={"mt-5 flex-row justify-between flex-wrap gap-2"}>
                        {summaryCards.map((item, i) => (
                            <Pressable
                                key={i}
                                onPress={() => router.push(item.route as any)}
                                className={twMerge(
                                    "w-[48%] h-[120px] rounded-[18px] p-4 justify-between active:opacity-90",
                                    item.background,
                                )}>
                                <View className={"flex-row justify-between items-center"}>
                                    <Image source={item.logo} style={{ width: 36, height: 36 }} />

                                    <Text className={"font-pretendard-semibold text-lg text-white"}>
                                        {item.title}
                                    </Text>
                                </View>

                                <Text
                                    className={"font-pretendard-bold text-xl text-white self-end"}>
                                    {item.number}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View className={"mt-8 flex-row justify-between items-center"}>
                        <Text className={"font-pretendard-medium text-xl"}>내 대여 현황</Text>

                        <Pressable onPress={() => router.push("/user/rental" as any)}>
                            <View className={"flex-row gap-2 items-center"}>
                                <Text className={"text-text-secondary"}>전체 보기</Text>

                                <Image
                                    source={require("@/assets/images/common/arrow_forward.png")}
                                    style={{ width: 18, height: 18 }}
                                />
                            </View>
                        </Pressable>
                    </View>

                    <View className={"mt-3 bg-background-paper rounded-[16px] overflow-hidden"}>
                        {isLoading ? (
                            <ActivityIndicator className="py-10" color="#7C3AED" />
                        ) : rentalStatusList.length === 0 ? (
                            <Text className="py-10 text-center text-text-secondary">
                                대여 내역이 없습니다.
                            </Text>
                        ) : (
                            rentalStatusList.map((item, i) => (
                                <View
                                    key={"rental" + i}
                                    className={twMerge(
                                        "py-5 px-5 border-b border-divider flex-row justify-between items-center",
                                        i === rentalStatusList.length - 1 && "border-b-0",
                                    )}>
                                    <View>
                                        <Text
                                            className={
                                                "font-pretendard-semibold text-lg text-text-default mb-1"
                                            }>
                                            {item.equipment.name}
                                        </Text>

                                        <Text className={"font-pretendard text-text-secondary"}>
                                            {item.status === "RETURNED"
                                                ? `${formatDate(item.returnedAt)} 반납완료`
                                                : `${formatDate(item.dueAt)} 반납예정`}
                                        </Text>
                                    </View>

                                    <Badge status={getStatus(item)} />
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserMainPage;
