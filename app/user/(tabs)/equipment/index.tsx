import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    TextInput,
    View,
    Text,
    Pressable,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import { useRouter } from "expo-router";
import memberEquipmentApi from "@/api/member/memberEquipmentApi";
import { Equipment } from "@/types/equipment";
import { useIsFocused } from "@react-navigation/native";

export default function UserEquipmentListPage() {
    const router = useRouter();
    const [selected, setSelected] = useState("전체");
    const [search, setSearch] = useState("");
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    const categories = ["전체", "IT기기", "사무용품", "소모품", "기타"];

    useEffect(() => {
        if (!isFocused) return;

        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                const data = await memberEquipmentApi.getEquipmentList({
                    category: selected === "전체" ? undefined : selected,
                    search: search.trim() || undefined,
                });
                setEquipmentList(data);
            } catch (error) {
                console.error(error);
                Alert.alert("조회 실패", "장비 목록을 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [isFocused, search, selected]);

    const getStatus = (equipment: Equipment) => {
        if (equipment.status === "BROKEN") return "파손신고";
        if (equipment.status === "BORROWED" || equipment.availableQuantity === 0) return "대여중";
        return "이용가능";
    };

    return (
        <View className={"flex-1 bg-background-default relative"}>
            <MainHeader title={"장비 조회"} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 bg-background-default relative"}>
                    <View className={"relative"}>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-background-paper border border-divider",
                                "rounded-[16px] pl-[50px] text-text-main font-pretendard text-base",
                            )}
                            placeholder={"장비명 검색"}
                            placeholderTextColor={"#9CA3AF"}
                            value={search}
                            onChangeText={setSearch}
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

                    <View
                        className={
                            "mt-4 rounded-[16px] bg-background-paper border border-divider overflow-hidden"
                        }>
                        {isLoading ? (
                            <ActivityIndicator className="py-10" color="#7C3AED" />
                        ) : equipmentList.length === 0 ? (
                            <Text className="py-10 text-center text-text-secondary">
                                조회된 장비가 없습니다.
                            </Text>
                        ) : (
                            equipmentList.map((data, i) => (
                                <Pressable
                                    key={data.id}
                                    onPress={() => router.push(`/user/equipment/${data.id}`)}>
                                    <View
                                        className={twMerge(
                                            "flex-row p-6 justify-between items-center border-b border-divider",
                                            i === equipmentList.length - 1 && "border-b-0",
                                        )}>
                                        <View className={"flex-row items-center"}>
                                            <Image
                                                source={
                                                    data.imageUrl
                                                        ? { uri: data.imageUrl }
                                                        : require("@/assets/images/common/box.png")
                                                }
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
                                                    {data.category || "기타"}
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
