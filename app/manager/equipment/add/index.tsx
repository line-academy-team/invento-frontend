import MainHeader from "@/components/layout/MainHeader";
import { Alert, Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/Button/Button";
import { useRouter } from "expo-router";
import managerEquipmentApi from "@/api/manager/managerEquipmentApi";
import { CreateEquipmentInputType } from "@/schemas/manager/managerEquipmentSchema";

function AddEquipmentPage() {
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState("IT기기");
    const selectOptions = ["IT기기", "사무용품", "소모품", "기타"];
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isConsumable = selectedCategory === "소모품";

    const handleChange = (text: string) => {
        const onlyNumber = text.replace(/[^0-9]/g, "");
        setQuantity(onlyNumber);
    };

    const handleCreate = async () => {
        if (isSubmitting) return;

        const trimmedName = name.trim();
        const parsedQuantity = Number(quantity);

        if (!trimmedName) {
            const message = "장비명을 입력해주세요.";
            if (Platform.OS === "web") {
                window.alert(`입력 확인\n${message}`);
            } else {
                Alert.alert("입력 확인", message);
            }
            return;
        }

        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
            const message = "수량은 1개 이상이어야 합니다.";
            if (Platform.OS === "web") {
                window.alert(`입력 확인\n${message}`);
            } else {
                Alert.alert("입력 확인", message);
            }
            return;
        }

        const trimmedDescription = description.trim();
        const trimmedImageUrl = imageUrl.trim();

        const input: CreateEquipmentInputType = {
            name: trimmedName,
            type: isConsumable ? "CONSUMABLE" : "INDIVIDUAL",
            totalQuantity: isConsumable ? parsedQuantity : 1,
            category: selectedCategory,
            ...(trimmedDescription && { description: trimmedDescription }),
            ...(trimmedImageUrl && { imageUrl: trimmedImageUrl }),
        };

        try {
            setIsSubmitting(true);
            await managerEquipmentApi.createEquipment(input);
            router.replace("/manager/equipment");
        } catch (error) {
            console.error("장비 등록 실패", error);
            const message = "장비 등록 중 오류가 발생했습니다.";
            if (Platform.OS === "web") {
                window.alert(`등록 실패\n${message}`);
            } else {
                Alert.alert("등록 실패", message);
            }
        } finally {
            setIsSubmitting(false);
        }
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
                        placeholder={"IT기기"}
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
                            value={name}
                            onChangeText={setName}
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
                                        if (Number(quantity) <= 1) return;
                                        setQuantity((Number(quantity) - 1).toString());
                                    }}
                                    className={"absolute right-[52px] top-11"}>
                                    <Image
                                        source={require("@/assets/images/common/minus_button.png")}
                                        style={{ width: 28, height: 28 }}
                                    />
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setQuantity((Number(quantity || "0") + 1).toString());
                                    }}
                                    className={"absolute right-4 top-11"}>
                                    <Image
                                        source={require("@/assets/images/common/plus_button.png")}
                                        style={{ width: 28, height: 28 }}
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
                                "w-full h-[54px] px-5",
                                "bg-white border-2 border-divider rounded-[16px]",
                                "text-base text-text-main",
                            )}
                            placeholder={"이미지 URL"}
                            value={imageUrl}
                            onChangeText={setImageUrl}
                            autoCapitalize={"none"}
                        />
                    </View>
                    <View className={"mt-6"}>
                        <Text className={"font-pretendard-bold text-base text-text-default mb-2"}>
                            추가 메모
                        </Text>
                        <TextInput
                            multiline
                            textAlignVertical={"top"}
                            className={twMerge(
                                "w-full h-[108px] p-5",
                                "bg-white border-2 border-divider rounded-[16px]",
                                "text-base text-text-main",
                            )}
                            placeholder={"내용을 입력해주세요"}
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>
                </View>
                <Button
                    className={"h-[60px]"}
                    textClassName={"text-lg font-pretendard-semibold"}
                    onPress={handleCreate}>
                    {isSubmitting ? "추가 중..." : "추가"}
                </Button>
            </View>
        </ScrollView>
    );
}

export default AddEquipmentPage;
