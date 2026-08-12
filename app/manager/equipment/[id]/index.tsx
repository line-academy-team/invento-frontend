import { ActivityIndicator, Alert, Image, ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import Badge from "@/components/common/Badge/Badge";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/Button/Button";
import { useEffect, useState } from "react";
import { Equipment } from "@/types/equipment";
import memberEquipmentApi from "@/api/member/memberEquipmentApi";
import managerEquipmentApi from "@/api/manager/managerEquipmentApi";

function ManagerEquipmentDetailPage() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const rawEquipmentId = params.equipmentId ?? params.id;
    const equipmentIdParam = Array.isArray(rawEquipmentId) ? rawEquipmentId[0] : rawEquipmentId;
    const equipmentId = Number(equipmentIdParam);

    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

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
            } catch (error) {
                console.error("장비 상세 조회 실패", error);
                Alert.alert("조회 실패", "장비 정보를 불러오지 못했습니다.", [
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

    const handleDelete = () => {
        if (!equipment || isDeleting) return;

        Alert.alert("장비 삭제", `\"${equipment.name}\" 장비를 삭제할까요?`, [
            { text: "취소", style: "cancel" },
            {
                text: "삭제",
                style: "destructive",
                onPress: async () => {
                    try {
                        setIsDeleting(true);
                        await managerEquipmentApi.deleteEquipment(equipment.id);
                        router.replace("/manager/equipment");
                    } catch (error) {
                        console.error("장비 삭제 실패", error);
                        Alert.alert("삭제 실패", "장비 삭제 중 오류가 발생했습니다.");
                    } finally {
                        setIsDeleting(false);
                    }
                },
            },
        ]);
    };

    if (isLoading) {
        return (
            <View className={"flex-1"}>
                <MainHeader
                    title={"장비 상세"}
                    isBackPress
                    onBackPress={() => router.navigate("/manager/equipment")}
                />
                <View className={"flex-1 items-center justify-center"}>
                    <ActivityIndicator size={"large"} />
                </View>
            </View>
        );
    }

    if (!equipment) {
        return (
            <View className={"flex-1"}>
                <MainHeader
                    title={"장비 상세"}
                    isBackPress
                    onBackPress={() => router.navigate("/manager/equipment")}
                />
                <View className={"flex-1 items-center justify-center px-[30px]"}>
                    <Text className={"text-lg text-text-default"}>
                        장비 정보를 찾을 수 없습니다.
                    </Text>
                </View>
            </View>
        );
    }

    const isAvailable = equipment.availableQuantity > 0 && equipment.status === "AVAILABLE";

    return (
        <View className={"flex-1"}>
            <MainHeader
                title={"장비 상세"}
                isBackPress
                onBackPress={() => {
                    router.navigate("/manager/equipment");
                }}
            />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"px-[30px] py-8 flex-1"}>
                    {equipment.imageUrl ? (
                        <Image
                            source={{ uri: equipment.imageUrl }}
                            className={"h-[200px] w-full rounded-2xl bg-background-default"}
                            resizeMode={"cover"}
                        />
                    ) : (
                        <View
                            className={
                                "h-[200px] w-full rounded-2xl bg-background-default items-center justify-center"
                            }>
                            <Text className={"text-text-secondary"}>등록된 이미지가 없습니다.</Text>
                        </View>
                    )}

                    <View className={"py-[30px] flex-1"}>
                        <View
                            className={twMerge(
                                ["flex-row", "justify-between", "items-center"],
                                ["py-5", "border-b", "border-text-secondary"],
                            )}>
                            <Text className={"font-semibold text-2xl flex-1 mr-3"}>
                                {equipment.name}
                            </Text>
                            {isAvailable ? (
                                <Badge status={"이용가능"} className={"self-end"} />
                            ) : (
                                <Text className={"text-text-secondary"}>이용불가</Text>
                            )}
                        </View>

                        <View>
                            <InfoRow label={"카테고리"} value={equipment.category ?? "미지정"} />
                            <InfoRow label={"부서"} value={equipment.department?.name ?? "공용"} />
                            <InfoRow label={"총 수량"} value={String(equipment.totalQuantity)} />
                            <InfoRow
                                label={"사용가능"}
                                value={String(equipment.availableQuantity)}
                                valueClassName={"text-success-main"}
                            />
                            <InfoRow
                                label={"설명"}
                                value={equipment.description?.trim() || "등록된 설명이 없습니다."}
                            />
                        </View>
                    </View>

                    <View className={twMerge(["flex-row", "w-full", "gap-2"])}>
                        <Button
                            variant={"outline"}
                            className={"h-[60px] w-auto flex-1"}
                            textClassName={"text-xl"}
                            onPress={handleDelete}>
                            {isDeleting ? "삭제 중..." : "삭제"}
                        </Button>
                        <Button
                            className={"h-[60px] w-auto flex-1"}
                            textClassName={"text-xl"}
                            onPress={() => {
                                router.push(`/manager/equipment/${equipment.id}/edit`);
                            }}>
                            수정
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

interface InfoRowProps {
    label: string;
    value: string;
    valueClassName?: string;
}

function InfoRow({ label, value, valueClassName }: InfoRowProps) {
    return (
        <View className={twMerge(["flex-row", "justify-between", "border-b border-divider py-5"])}>
            <Text className={"font-semibold text-lg text-text-default min-w-[100px]"}>{label}</Text>
            <Text
                className={twMerge(
                    "text-lg text-text-default flex-1 text-right ml-4",
                    valueClassName,
                )}>
                {value}
            </Text>
        </View>
    );
}

export default ManagerEquipmentDetailPage;
