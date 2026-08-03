import MainHeader from "@/components/layout/MainHeader";
import { ScrollView, TextInput, View, Text, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/Button/Button";
import { useRouter } from "expo-router";

function AddEquipmentPage() {
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState("IT용품");
    const selectOptions = ["IT용품", "사무용품", "소모품", "기타"];
    const [quantity, setQuantity] = useState("1");
    const isConsumable = selectedCategory === "소모품";
    const handleChange = (text: string) => {
        const onlyNumber = text.replace(/[^0-9]/g, "");
        setQuantity(onlyNumber);
    };

    return (
        <ScrollView>
            <MainHeader
                title={"장비 추가"}
                isBackPress
                onBackPress={() => {
                    router.navigate("/manager/equipment");
                }}
            />
            <View className={"px-[30px] py-8 min-h-[740px] justify-between"}>
                <View>
                    <Dropdown
                        label={"카테고리"}
                        options={selectOptions}
                        selectedValue={selectedCategory}
                        onSelect={value => {
                            setSelectedCategory(value);
                            if (value !== "소모품") setQuantity("1");
                        }}
                        placeholder={"IT용품"}
                    />
                    <View className={"mt-6"}>
                        <Text className={"font-pretendard-bold text-base text-text-default mb-2"}>
                            장비명
                        </Text>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] px-5",
                                "bg-white border-2 border-divider rounded-[16px]",
                                "text-base text-text-main",
                            )}
                            placeholder={"예) 삼성 노트북 0001"}
                        />
                    </View>
                    <View className={"mt-6 relative"}>
                        <Text className={"font-pretendard-bold text-base text-text-default mb-2"}>
                            수량
                        </Text>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] px-5",
                                "bg-white border-2 border-divider rounded-[16px]",
                                "text-base text-text-main",
                                !isConsumable && "bg-divider",
                            )}
                            keyboardType={"number-pad"}
                            value={quantity}
                            onChangeText={handleChange}
                            editable={isConsumable}
                            selectTextOnFocus={isConsumable}
                            contextMenuHidden={!isConsumable}
                        />
                        {isConsumable && (
                            <>
                                <Pressable
                                    onPress={() => {
                                        if (Number(quantity) < 1) return;
                                        setQuantity((Number(quantity) - 1).toString());
                                    }}
                                    className={"absolute right-[52px] top-11"}>
                                    <Image
                                        source={require("@/assets/images/common/minus_button.png")}
                                        style={{
                                            width: 28,
                                            height: 28,
                                        }}
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setQuantity((Number(quantity) + 1).toString());
                                    }}
                                    className={"absolute right-4 top-11"}>
                                    <Image
                                        source={require("@/assets/images/common/plus_button.png")}
                                        style={{
                                            width: 28,
                                            height: 28,
                                        }}
                                    />
                                </Pressable>
                            </>
                        )}
                    </View>
                    <View className={"mt-6"}>
                        <Text className={"font-pretendard-bold text-base text-text-default mb-2"}>
                            장비 이미지 URL (선택)
                        </Text>
                        <TextInput
                            className={twMerge(
                                " w-full h-[54px] px-5",
                                "bg-white border-2 border-divider rounded-[16px]",
                                "text-base text-text-main",
                            )}
                            placeholder={"이미지 URL"}
                        />
                    </View>
                    <View className={"mt-6"}>
                        <Text className={"font-pretendard-bold text-base text-text-default mb-2"}>
                            추가 메모
                        </Text>
                        <TextInput
                            multiline={true}
                            textAlignVertical={"top"}
                            className={twMerge(
                                "w-full h-[108px] p-5",
                                "bg-white border-2 border-divider rounded-[16px]",
                                "text-base text-text-main",
                            )}
                            placeholder={"내용을 입력해주세요"}
                        />
                    </View>
                </View>
                <Button
                    className={"h-[60px]"}
                    textClassName={"text-lg font-pretendard-semibold"}
                    onPress={() => {
                        router.push("/manager/equipment");
                    }}>
                    추가
                </Button>
            </View>
        </ScrollView>
    );
}

export default AddEquipmentPage;
