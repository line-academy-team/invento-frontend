import { Image, ScrollView, TextInput, View, Text, Pressable } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import { useRouter } from "expo-router";

function ManagerEquipmentListPage() {
    const router = useRouter();
    const onMenuPress = () => {};
    const [selected, setSelected] = useState("전체");

    const categories = ["전체", "IT기기", "사무용품", "소모품", "기타"];

    const mockData = [
        {
            imageLink:
                "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
            name: "노트북 1",
            category: "IT기기",
            status: "이용가능",
            id: 1,
        },
        {
            imageLink:
                "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
            name: "샤프",
            category: "사무용품",
            status: "대여중",
            id: 2,
        },
        {
            imageLink:
                "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
            name: "줄자",
            category: "사무용품",
            status: "이용가능",
            id: 3,
        },
        {
            imageLink:
                "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
            name: "노트북 1",
            category: "IT기기",
            status: "이용가능",
            id: 4,
        },
        {
            imageLink:
                "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
            name: "서류철",
            category: "소모품",
            status: "이용가능",
            id: 5,
        },
        {
            imageLink:
                "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
            name: "기타엔 뭐가 들어가지",
            category: "기타",
            status: "이용가능",
            id: 6,
        },
    ];

    return (
        <ScrollView>
            <MainHeader title={"장비 관리"} onMenuPress={onMenuPress} />
            <View className={"px-[30px] py-8 bg-background-default min-h-[650px]"}>
                <View className={"relative"}>
                    <TextInput
                        className={twMerge(
                            "w-full h-[54px] bg-background-paper border border-divider",
                            "rounded-[16px] pl-[50px] text-text-main",
                        )}
                        placeholder={"장비명 검색"}
                    />
                    <Image
                        source={require("@/assets/images/common/search.png")}
                        style={{ width: 24, height: 24 }}
                        className={"absolute top-[16px] left-[16px]"}
                    />
                </View>
                <View className={"mt-[30px] flex-row justify-between"}>
                    {categories.map((category, i) => (
                        <Pressable
                            key={"category" + i}
                            onPress={() => {
                                setSelected(category);
                            }}>
                            <Text
                                className={twMerge(
                                    "text-text-secondary font-pretendard-semibold text-lg",
                                    selected === category && "text-primary-main",
                                )}>
                                {category}
                            </Text>
                        </Pressable>
                    ))}
                </View>
                <View className={"mt-6 rounded-[16px] bg-background-paper"}>
                    {mockData
                        .filter(data => (selected === "전체" ? true : data.category === selected))
                        .map((data, _) => (
                            <Pressable
                                onPress={() => {
                                    router.push("/");
                                }}>
                                <View
                                    className={
                                        "flex-row p-6 justify-between border-b border-divider last:border-b-0"
                                    }
                                    key={"equipment" + data.id}>
                                    <View className={"flex-row"}>
                                        <Image
                                            source={{ uri: data.imageLink }}
                                            style={{ width: 64, height: 64 }}
                                            resizeMode={"cover"}
                                            className={"rounded-[16px]"}
                                        />
                                        <View className={"ml-5 justify-between"}>
                                            <Text
                                                className={
                                                    "font-pretendard-semibold text-xl text-text-main"
                                                }>
                                                {data.name}
                                            </Text>
                                            <Text
                                                className={
                                                    "font-pretendard text-text-secondary mb-1"
                                                }>
                                                {data.category}
                                            </Text>
                                        </View>
                                    </View>
                                    <Badge status={data.status} className={"self-end"} />
                                </View>
                            </Pressable>
                        ))}
                </View>
            </View>
        </ScrollView>
    );
}

export default ManagerEquipmentListPage;
