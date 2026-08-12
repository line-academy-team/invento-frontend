import { Image, ScrollView, TextInput, View, Text, Pressable } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import { useRouter } from "expo-router";

export default function UserEquipmentListPage() {
    const router = useRouter();
    const [selected, setSelected] = useState("전체");

    const categories = ["전체", "IT기기", "사무용품", "소모품", "기타"];

    // 💡 API 연동 전 UI 확인용 더미 데이터
    const mockData = [
        {
            id: 1,
            imageLink:
                "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
            name: "노트북 01",
            category: "IT기기",
            status: "이용가능",
        },
        {
            id: 2,
            imageLink: "https://fastly.picsum.photos/id/2/5000/3333.jpg?hmac=...",
            name: "샤프",
            category: "사무용품",
            status: "대여중",
        },
        {
            id: 3,
            imageLink: "https://fastly.picsum.photos/id/3/5000/3333.jpg?hmac=...",
            name: "줄자",
            category: "사무용품",
            status: "이용가능",
        },
        {
            id: 4,
            imageLink: "https://fastly.picsum.photos/id/4/5000/3333.jpg?hmac=...",
            name: "서류철",
            category: "소모품",
            status: "이용가능",
        },
    ];

    const filteredData = mockData.filter(data =>
        selected === "전체" ? true : data.category === selected,
    );

    return (
        <View className={"flex-1 bg-background-default relative"}>
            <MainHeader title={"장비 조회"} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 bg-background-default relative"}>
                    {/* 검색 바 */}
                    <View className={"relative"}>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-background-paper border border-divider",
                                "rounded-[16px] pl-[50px] text-text-main font-pretendard text-base",
                            )}
                            placeholder={"장비명 검색"}
                            placeholderTextColor={"#9CA3AF"}
                        />
                        <Image
                            source={require("@/assets/images/common/search.png")}
                            style={{ width: 24, height: 24 }}
                            className={"absolute top-[15px] left-[16px] opacity-50"}
                        />
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className={"mt-[30px] mb-2"}>
                        <View className="flex-row gap-x-6 px-1">
                            {categories.map((category, i) => (
                                <Pressable
                                    key={"category" + i}
                                    onPress={() => setSelected(category)}>
                                    <Text
                                        className={twMerge(
                                            "font-pretendard-semibold text-lg pb-2",
                                            selected === category
                                                ? "text-primary-main border-b-2 border-primary-main"
                                                : "text-text-secondary border-b-2 border-transparent",
                                        )}>
                                        {category}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>

                    {/* 장비 리스트 */}
                    <View
                        className={
                            "mt-4 rounded-[16px] bg-background-paper border border-divider overflow-hidden"
                        }>
                        {filteredData.map((data, i) => (
                            <Pressable
                                key={data.id}
                                onPress={() => router.push(`/user/equipment/${data.id}`)}>
                                <View
                                    className={twMerge(
                                        "flex-row p-6 justify-between items-center border-b border-divider",
                                        i === filteredData.length - 1 && "border-b-0",
                                    )}>
                                    <View className={"flex-row items-center"}>
                                        <Image
                                            source={{ uri: data.imageLink }}
                                            style={{ width: 64, height: 64 }}
                                            resizeMode={"cover"}
                                            className={"rounded-[16px] bg-gray-100"}
                                        />
                                        <View className={"ml-5 justify-center"}>
                                            <Text
                                                className={
                                                    "font-pretendard-semibold text-xl text-text-main mb-1"
                                                }>
                                                {data.name}
                                            </Text>
                                            <Text
                                                className={
                                                    "font-pretendard text-sm text-text-secondary"
                                                }>
                                                {data.category}
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
