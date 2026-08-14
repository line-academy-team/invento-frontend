import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { twMerge } from "tailwind-merge";
import { useCallback, useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import { useRouter, Href } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";
import { useFocusEffect } from "@react-navigation/native";
import memberRentalApi from "@/api/member/memberRentalApi";
import memberReportApi from "@/api/member/memberReportApi";
import { MyRental } from "@/types/rental";
import { formatDate } from "@/utils/date";

export default function UserRentalListPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("전체");
    const [search, setSearch] = useState("");
    const [rentals, setRentals] = useState<MyRental[]>([]);
    const [reportedEquipmentIds, setReportedEquipmentIds] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const categories = ["전체", "신청", "반납예정", "파손신고"];

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            setIsLoading(true);

            Promise.all([memberRentalApi.getMyRentalRequestList(), memberReportApi.getReportList()])
                .then(([rentalData, reportData]) => {
                    if (!isActive) return;
                    setRentals(rentalData);
                    setReportedEquipmentIds(
                        reportData
                            .filter(
                                report =>
                                    report.type === "BROKEN" &&
                                    report.status === "PENDING" &&
                                    report.equipmentId,
                            )
                            .map(report => report.equipmentId as number),
                    );
                })
                .catch(error => {
                    console.error(error);
                    Alert.alert("조회 실패", "내 대여 목록을 불러오지 못했습니다.");
                })
                .finally(() => isActive && setIsLoading(false));

            return () => {
                isActive = false;
            };
        }, []),
    );

    const getStatus = (rental: MyRental) => {
        if (reportedEquipmentIds.includes(rental.equipmentId)) return "파손신고";
        if (rental.status === "REQUESTED") return "신청중";
        if (rental.status === "REJECTED") return "반려";
        if (rental.status === "BORROWED") return rental.dueAt ? "반납예정" : "사용중";
        if (rental.status === "RETURNED") return "반납완료";
        return "취소";
    };

    const filteredData = rentals.filter(
        data =>
            data.equipment.name.toLowerCase().includes(search.trim().toLowerCase()) &&
            (selectedTab === "전체"
                ? true
                : selectedTab === "신청"
                  ? getStatus(data) === "신청중"
                  : selectedTab === "반납예정"
                    ? getStatus(data) === "반납예정" || getStatus(data) === "사용중"
                    : getStatus(data) === "파손신고"),
    );

    return (
        <View className={"flex-1 bg-background-default"}>
            <MainHeader title={"내 대여 목록"} />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow pb-[120px]"}>
                <View className={"flex-1 px-[30px] py-8"}>
                    <View className="mb-[30px] relative">
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-white border border-transparent rounded-[16px] pl-[50px] text-text-main",
                                "shadow-sm shadow-black/5",
                            )}
                            placeholder={"장비명 검색"}
                            placeholderTextColor={"#9CA3AF"}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <Image
                            source={require("@/assets/images/common/search.png")}
                            style={{ width: 24, height: 24, tintColor: "#888" }}
                            className={"absolute top-[15px] left-[16px]"}
                        />
                    </View>

                    <View className={"flex-row justify-between mb-6"}>
                        {categories.map(category => (
                            <Pressable
                                key={category}
                                onPress={() => setSelectedTab(category)}
                                className="flex-1 items-center">
                                <Text
                                    className={twMerge(
                                        "font-pretendard-bold text-base",
                                        selectedTab === category
                                            ? "text-primary-main"
                                            : "text-text-main",
                                    )}>
                                    {category}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    <View
                        className={
                            "rounded-[20px] overflow-hidden bg-white shadow-sm shadow-black/5"
                        }>
                        {isLoading ? (
                            <ActivityIndicator className="py-10" color="#7C3AED" />
                        ) : filteredData.length === 0 ? (
                            <Text className="py-10 text-center text-text-secondary">
                                조회된 대여 내역이 없습니다.
                            </Text>
                        ) : (
                            filteredData.map((data, i) => (
                                <Pressable
                                    key={data.id}
                                    onPress={() => router.push(`/user/rental/${data.id}` as Href)}>
                                    <View
                                        className={twMerge(
                                            "flex-row p-6 items-center justify-between border-b border-divider",
                                            i === filteredData.length - 1 && "border-b-0",
                                        )}>
                                        <View className={"justify-between flex-1"}>
                                            <Text
                                                className={
                                                    "font-pretendard-bold text-lg text-text-main mb-3"
                                                }>
                                                {data.equipment.name}
                                            </Text>

                                            <View className={"flex-row items-center mb-1.5"}>
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary w-[90px]"
                                                    }>
                                                    신청일
                                                </Text>
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary"
                                                    }>
                                                    {formatDate(data.requestedAt || data.createdAt)}
                                                </Text>
                                            </View>
                                            <View className={"flex-row items-center"}>
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary w-[90px]"
                                                    }>
                                                    {data.status === "RETURNED"
                                                        ? "반납일"
                                                        : "반납예정일"}
                                                </Text>
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary"
                                                    }>
                                                    {formatDate(
                                                        data.status === "RETURNED"
                                                            ? data.returnedAt
                                                            : data.dueAt,
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                        <Badge status={getStatus(data)} />
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
