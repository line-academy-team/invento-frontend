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
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { Href, useRouter, usePathname } from "expo-router";
import { useCallback, useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import { useFocusEffect } from "@react-navigation/native";
import managerReportApi from "@/api/manager/managerReportApi";
import { useUserStore } from "@/stores/user/useUserStore";
import { Report } from "@/types/report";
import { formatDate } from "@/utils/date";

const TabTitle = () => {
    const router = useRouter();
    const pathname = usePathname();

    const isRental = pathname.includes("rental");

    return (
        <View className="flex-row items-center">
            <Pressable onPress={() => router.push("/manager/rental")}>
                <Text
                    className={twMerge(
                        "font-pretendard-bold text-2xl",
                        isRental ? "text-text-main" : "text-text-secondary",
                    )}>
                    대여 관리
                </Text>
            </Pressable>

            <Text className="text-2xl font-pretendard-light text-text-secondary mx-3 mb-1">|</Text>

            <Pressable onPress={() => router.push("/manager/report" as Href)}>
                <Text
                    className={twMerge(
                        "font-pretendard-bold text-2xl",
                        !isRental ? "text-text-main" : "text-text-secondary",
                    )}>
                    파손관리
                </Text>
            </Pressable>
        </View>
    );
};

function ManagerReportPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("전체");
    const [search, setSearch] = useState("");
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const organizationId = useUserStore(state => state.authUser?.memberInfo?.organizationId);

    const categories = ["답변대기", "답변완료"];

    useFocusEffect(
        useCallback(() => {
            if (!organizationId) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            managerReportApi
                .getReportList(organizationId)
                .then(setReports)
                .catch(error => {
                    console.error(error);
                    Alert.alert("조회 실패", "조직 신고 목록을 불러오지 못했습니다.");
                })
                .finally(() => setIsLoading(false));
        }, [organizationId]),
    );

    const getStatus = (report: Report) => (report.status === "COMPLETED" ? "답변완료" : "답변대기");

    const filteredData = reports.filter(
        data =>
            `${data.equipment?.name || ""} ${data.title}`
                .toLowerCase()
                .includes(search.trim().toLowerCase()) &&
            (selectedTab === "전체" ? true : getStatus(data) === selectedTab),
    );

    return (
        <View className={"flex-1 bg-background-default"}>
            <MainHeader customTitle={<TabTitle />} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow pb-[40px]"}>
                <View className={"flex-1 px-[30px] py-8"}>
                    <View>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-white border border-transparent rounded-[16px] pl-[50px] text-text-main",
                                "shadow-sm shadow-black/5",
                            )}
                            placeholder={"장비명 검색"}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <Image
                            source={require("@/assets/images/common/search.png")}
                            style={{ width: 24, height: 24, tintColor: "#888" }}
                            className={"absolute top-[15px] left-[16px]"}
                        />
                    </View>

                    <View className={"mt-8 flex-row justify-between items-center"}>
                        <View className={"flex-row items-center"}>
                            <Pressable onPress={() => setSelectedTab("전체")}>
                                <Text
                                    className={twMerge(
                                        "font-pretendard-semibold text-base",
                                        selectedTab === "전체"
                                            ? "text-primary-main"
                                            : "text-text-secondary",
                                    )}>
                                    전체
                                </Text>
                            </Pressable>
                        </View>

                        <View className={"flex-row space-x-6"}>
                            {categories.map(category => (
                                <Pressable key={category} onPress={() => setSelectedTab(category)}>
                                    <Text
                                        className={twMerge(
                                            "font-pretendard-semibold text-base",
                                            selectedTab === category
                                                ? "text-primary-main"
                                                : "text-text-secondary",
                                        )}>
                                        {category}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View
                        className={
                            "mt-4 rounded-2xl overflow-hidden bg-white shadow-sm shadow-black/5"
                        }>
                        {isLoading ? (
                            <ActivityIndicator className="py-10" color="#7C3AED" />
                        ) : filteredData.length === 0 ? (
                            <Text className="py-10 text-center text-text-secondary">
                                조회된 신고가 없습니다.
                            </Text>
                        ) : (
                            filteredData.map((data, i) => (
                                <Pressable
                                    key={data.id}
                                    onPress={() =>
                                        router.push(`/manager/report/${data.id}` as Href)
                                    }>
                                    <View
                                        className={twMerge(
                                            "flex-row p-5 items-center justify-between border-b border-divider",
                                            i === filteredData.length - 1 && "border-b-0",
                                        )}>
                                        <View className={"flex-row items-center flex-1"}>
                                            <View className={"justify-between"}>
                                                <Text
                                                    className={
                                                        "font-pretendard-semibold text-lg text-text-main mb-1"
                                                    }>
                                                    {data.equipment?.name || data.title}
                                                </Text>
                                                <View className={"flex-row items-center"}>
                                                    <Text
                                                        className={
                                                            "font-pretendard text-sm text-text-secondary mr-4"
                                                        }>
                                                        {data.reporter?.user.name || "사용자"}
                                                    </Text>
                                                    <Text
                                                        className={
                                                            "font-pretendard text-sm text-text-secondary"
                                                        }>
                                                        {formatDate(data.createdAt)}
                                                    </Text>
                                                </View>
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

export default ManagerReportPage;
