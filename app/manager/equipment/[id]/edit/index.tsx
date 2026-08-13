import MainHeader from "@/components/layout/MainHeader";
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
import { useEffect, useState } from "react";
import Dropdown from "@/components/common/Dropdown/Dropdown";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/Button/Button";
import { useLocalSearchParams, useRouter } from "expo-router";
import managerEquipmentApi from "@/api/manager/managerEquipmentApi";
import memberEquipmentApi from "@/api/member/memberEquipmentApi";
import { UpdateEquipmentInputType } from "@/schemas/manager/managerEquipmentSchema";
import { Equipment } from "@/types/equipment";

function EditEquipmentPage() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const rawEquipmentId = params.equipmentId ?? params.id;
    const equipmentIdParam = Array.isArray(rawEquipmentId) ? rawEquipmentId[0] : rawEquipmentId;
    const equipmentId = Number(equipmentIdParam);

    const selectOptions = ["IT기기", "사무용품", "소모품", "기타"];

    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [selectedCategory, setSelectedCategory] = useState("IT기기");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isConsumable = selectedCategory === "소모품";

    useEffect(() => {
        if (!Number.isInteger(equipmentId) || equipmentId < 1) {
            setIsLoading(false);
            return;
        }

        const fetchEquipment = async () => {
            try {
                setIsLoading(true);

                const data = await memberEquipmentApi.getEquipmentById(equipmentId);
                setEquipment(data);

                setSelectedCategory(data.category ?? "기타");
                setName(data.name);
                setQuantity(String(data.totalQuantity));
                setImageUrl(data.imageUrl ?? "");
                setDescription(data.description ?? "");
            } catch (error) {
                console.error("장비 정보 조회 실패", error);
                Alert.alert("조회 실패", "수정할 장비 정보를 불러오지 못했습니다.", [
                    {
                        text: "확인",
                        onPress: () => router.replace("/manager/equipment"),
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchEquipment();
    }, [equipmentId, router]);

    const handleQuantityChange = (text: string) => {
        const onlyNumber = text.replace(/[^0-9]/g, "");
        setQuantity(onlyNumber);
    };

    const handleUpdate = async () => {
        if (!equipment || isSubmitting) return;

        const trimmedName = name.trim();
        const parsedQuantity = Number(quantity);

        if (!trimmedName) {
            Alert.alert("입력 확인", "장비명을 입력해주세요.");
            return;
        }

        if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
            Alert.alert("입력 확인", "수량은 1개 이상이어야 합니다.");
            return;
        }

        const trimmedImageUrl = imageUrl.trim();
        const trimmedDescription = description.trim();

        const input: UpdateEquipmentInputType = {
            name: trimmedName,
            category: selectedCategory,
            type: isConsumable ? "CONSUMABLE" : "INDIVIDUAL",
            totalQuantity: isConsumable ? parsedQuantity : 1,
            description: trimmedDescription,
            imageUrl: trimmedImageUrl,
        };

        try {
            setIsSubmitting(true);
            await managerEquipmentApi.updateEquipment(equipment.id, input);
            router.replace("/manager/equipment");
        } catch (error) {
            console.error("장비 수정 실패", error);
            Alert.alert("수정 실패", "장비 정보 수정 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (Number.isInteger(equipmentId) && equipmentId > 0) {
            router.navigate(`/manager/equipment/${equipmentId}`);
            return;
        }

        router.navigate("/manager/equipment");
    };

    if (isLoading) {
        return (
            <View className={"flex-1"}>
                <MainHeader title={"장비 수정"} isBackPress onBackPress={handleBack} />
                <View className={"flex-1 items-center justify-center"}>
                    <ActivityIndicator size={"large"} />
                </View>
            </View>
        );
    }

    if (!equipment) {
        return (
            <View className={"flex-1"}>
                <MainHeader title={"장비 수정"} isBackPress onBackPress={handleBack} />
                <View className={"flex-1 items-center justify-center px-[30px]"}>
                    <Text className={"text-lg text-text-default"}>
                        수정할 장비 정보를 찾을 수 없습니다.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView>
            <MainHeader title={"장비 수정"} isBackPress onBackPress={handleBack} />

            <View className={"px-[30px] py-8 min-h-[740px] justify-between"}>
                <View>
                    <Dropdown
                        label={"카테고리"}
                        options={selectOptions}
                        selectedValue={selectedCategory}
                        onSelect={value => {
                            setSelectedCategory(value);

                            if (value !== "소모품") {
                                setQuantity("1");
                            } else if (Number(quantity) < 1) {
                                setQuantity("1");
                            }
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
                            onChangeText={handleQuantityChange}
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
                    className={"h-[60px] mt-8"}
                    textClassName={"text-lg font-pretendard-semibold"}
                    onPress={handleUpdate}>
                    {isSubmitting ? "수정 중..." : "수정 완료"}
                </Button>
            </View>
        </ScrollView>
    );
}

export default EditEquipmentPage;
