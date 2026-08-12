import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import { useRouter, Href } from "expo-router";
import MainHeader from "@/components/layout/MainHeader";

export default function UserRentalListPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("전체");

    const categories = ["전체", "신청", "반납예정", "파손신고"];

    const mockData = [
        {
            id: 1,
            name: "노트북 01",
            labels: ["신청일", "대여시작일"],
            dates: ["2026.07.26", "2026.07.30"],
            status: "신청중",
        },
        {
            id: 2,
            name: "노트북 01",
            labels: ["대여일", "파손신고일"],
            dates: ["2026.07.20", "2026.07.30"],
            status: "파손신고",
        },
        {
            id: 3,
            name: "노트북 01",
            labels: ["대여일", "반납예정일"],
            dates: ["2026.07.20", "2026.07.30(D-2일)"],
            status: "반납예정",
        },
        {
            id: 4,
            name: "노트북 01",
            labels: ["대여일", "반납예정일"],
            dates: ["2026.07.20", "2026.07.30"],
            status: "사용중",
        },
    ];

    const filteredData = mockData.filter(data =>
        selectedTab === "전체"
            ? true
            : selectedTab === "신청"
              ? data.status === "신청중"
              : selectedTab === "반납예정"
                ? data.status === "반납예정" || data.status === "사용중"
                : data.status === "파손신고",
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
                        {filteredData.map((data, i) => (
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
                                            {data.name}
                                        </Text>

                                        <View className={"flex-row items-center mb-1.5"}>
                                            <Text
                                                className={
                                                    "font-pretendard text-sm text-text-secondary w-[90px]"
                                                }>
                                                {data.labels[0]}
                                            </Text>
                                            <Text
                                                className={
                                                    "font-pretendard text-sm text-text-secondary"
                                                }>
                                                {data.dates[0]}
                                            </Text>
                                        </View>
                                        <View className={"flex-row items-center"}>
                                            <Text
                                                className={
                                                    "font-pretendard text-sm text-text-secondary w-[90px]"
                                                }>
                                                {data.labels[1]}
                                            </Text>
                                            <Text
                                                className={
                                                    "font-pretendard text-sm text-text-secondary"
                                                }>
                                                {data.dates[1]}
                                            </Text>
                                        </View>
                                    </View>
                                    <Badge status={data.status} />
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
