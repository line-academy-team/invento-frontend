import { Image, ScrollView, TextInput, View, Text, Pressable } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import { useRouter } from "expo-router";
import memberEquipmentApi from "@/api/member/memberEquipmentApi";
import { Equipment, EquipmentStatusType } from "@/types/equipment";

const categories = ["전체", "IT기기", "사무용품", "소모품", "기타"];

const statusTextMap: Record<EquipmentStatusType, string> = {
    AVAILABLE: "이용가능",
    BORROWED: "대여중",
    LOST: "분실",
    BROKEN: "고장",
    DISPOSED: "폐기",
};

function ManagerEquipmentListPage() {
    const router = useRouter();
    const onMenuPress = () => {};

    const [selected, setSelected] = useState("전체");
    const [search, setSearch] = useState("");
    const [equipments, setEquipments] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let cancelled = false;

        const timer = setTimeout(async () => {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const data = await memberEquipmentApi.getEquipmentList({
                    category: selected === "전체" ? undefined : selected,
                    search: search.trim() || undefined,
                });

                if (!cancelled) {
                    setEquipments(data);
                }
            } catch (error) {
                console.error("장비 목록 조회 실패", error);

                if (!cancelled) {
                    setEquipments([]);
                    setErrorMessage("장비 목록을 불러오지 못했습니다.");
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [selected, search]);

    return (
        <View className={"flex-1 bg-background-default relative"}>
            <MainHeader title={"장비 관리"} onMenuPress={onMenuPress} />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 bg-background-default relative"}>
                    <View className={"relative"}>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-background-paper border border-divider",
                                "rounded-[16px] pl-[50px] text-text-main",
                            )}
                            placeholder={"장비명 검색"}
                            value={search}
                            onChangeText={setSearch}
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

                    <View className={"mt-6 rounded-[16px] bg-background-paper overflow-hidden"}>
                        {isLoading ? (
                            <View className={"p-8 items-center"}>
                                <Text className={"text-text-secondary"}>
                                    장비를 불러오는 중입니다.
                                </Text>
                            </View>
                        ) : errorMessage ? (
                            <View className={"p-8 items-center"}>
                                <Text className={"text-text-secondary"}>{errorMessage}</Text>
                            </View>
                        ) : equipments.length === 0 ? (
                            <View className={"p-8 items-center"}>
                                <Text className={"text-text-secondary"}>
                                    조건에 맞는 장비가 없습니다.
                                </Text>
                            </View>
                        ) : (
                            equipments.map(data => (
                                <Pressable
                                    key={data.id}
                                    onPress={() => {
                                        router.push(`/manager/equipment/${data.id}`);
                                    }}>
                                    <View
                                        className={
                                            "flex-row p-6 justify-between border-b border-divider last:border-b-0"
                                        }>
                                        <View className={"flex-row flex-1 mr-4"}>
                                            {data.imageUrl ? (
                                                <Image
                                                    source={{ uri: data.imageUrl }}
                                                    style={{ width: 64, height: 64 }}
                                                    resizeMode={"cover"}
                                                    className={"rounded-[16px]"}
                                                />
                                            ) : (
                                                <View
                                                    className={
                                                        "w-16 h-16 rounded-[16px] bg-background-default items-center justify-center"
                                                    }>
                                                    <Text className={"text-xs text-text-secondary"}>
                                                        이미지 없음
                                                    </Text>
                                                </View>
                                            )}

                                            <View className={"ml-5 justify-between flex-1"}>
                                                <Text
                                                    numberOfLines={1}
                                                    className={
                                                        "font-pretendard-semibold text-xl text-text-main"
                                                    }>
                                                    {data.name}
                                                </Text>
                                                <Text
                                                    className={
                                                        "font-pretendard text-text-secondary mb-1"
                                                    }>
                                                    {data.category ?? "카테고리 없음"}
                                                </Text>
                                            </View>
                                        </View>

                                        <Badge
                                            status={statusTextMap[data.status]}
                                            className={"self-end"}
                                        />
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            <Pressable
                className={"absolute bottom-4 right-4 z-10"}
                onPress={() => {
                    router.push("/manager/equipment/add");
                }}>
                <Image
                    source={require("@/assets/images/common/add_button.png")}
                    style={{
                        width: 72,
                        height: 72,
                    }}
                />
            </Pressable>
        </View>
    );
}

export default ManagerEquipmentListPage;
