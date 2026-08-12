import { Alert, Platform, ScrollView, View, Text, Image, Pressable } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user/useUserStore";
import memberRentalApi from "@/api/member/memberRentalApi";
import { MyRental } from "@/types/rental";

function UserMainPage() {
    const router = useRouter();
    const [rentalList, setRentalList] = useState<MyRental[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { authUser } = useUserStore();
    const userName = authUser?.user.name ?? "회원";
    const memberRoleText = "사용자";

    useEffect(() => {
        const loadUserDashboard = async () => {
            try {
                setIsLoading(true);
                const myRentals = await memberRentalApi.getMyRentalRequestList();
                setRentalList(myRentals);
            } catch (error) {
                console.log(error);
                const msg = "대여 현황 정보를 불러오는데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                } else {
                    Alert.alert("오류", msg);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadUserDashboard();
    }, []);

    const summaryCards = [
        {
            logo: require("@/assets/images/common/build_circle.png"),
            title: "내 대여 장비",
            number: "5",
            background: "bg-secondary-main",
            route: "/user/rental",
        },
        {
            logo: require("@/assets/images/common/short_stay.png"),
            title: "내 반납예정",
            number: "2",
            background: "bg-success-main",
            route: "/user/rental",
        },
        {
            logo: require("@/assets/images/common/box_add.png"),
            title: "내 요청",
            number: "3",
            background: "bg-warning-main",
            route: "/user/rental",
        },
        {
            logo: require("@/assets/images/common/devices_off.png"),
            title: "내 신고",
            number: "2",
            background: "bg-error-main",
            route: "/user/report",
        },
    ];

    const mockRentalStatusList = [
        {
            equipment: "노트북01",
            desc: "반납예정 2일남았습니다.",
            status: "반납예정",
        },
        {
            equipment: "프로젝터",
            desc: "~08.01 반납예정일",
            status: "대여중",
        },
        {
            equipment: "마이크",
            desc: "유명수연구원",
            status: "파손신고",
        },
    ];

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
                        {mockRentalStatusList.map((item, i) => (
                            <View
                                key={"rental" + i}
                                className={twMerge(
                                    "py-5 px-5 border-b border-divider flex-row justify-between items-center",
                                    i === mockRentalStatusList.length - 1 && "border-b-0",
                                )}>
                                <View>
                                    <Text
                                        className={
                                            "font-pretendard-semibold text-lg text-text-default mb-1"
                                        }>
                                        {item.equipment}
                                    </Text>

                                    <Text className={"font-pretendard text-text-secondary"}>
                                        {item.desc}
                                    </Text>
                                </View>

                                <Badge status={item.status} />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserMainPage;
