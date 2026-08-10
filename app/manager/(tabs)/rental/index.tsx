import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";
import { useState } from "react";

function ManagerRentalPage() {
    const router = useRouter();
    //const onMenuPress = () => {};
    const [selected, setSelected] = useState("전체");
    const categories = ["대기", "승인", "반려"];

    return (
        <View className={"flex-1"}>
            <MainHeader title={"대여 요청 관리"} />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 bg-background-default relative flex-1"}>
                    <View>
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
                </View>
            </ScrollView>
        </View>
    );
}
export default ManagerRentalPage;
