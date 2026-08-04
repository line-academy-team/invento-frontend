import { Image, ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter } from "expo-router";
import Badge from "@/components/common/Badge/Badge";
import { twMerge } from "tailwind-merge";
import Button from "@/components/common/Button/Button";

function ManagerEquipmentDetailPage() {
    const router = useRouter();

    const mockData = {
        imageURL:
            "https://fastly.picsum.photos/id/1/5000/3333.jpg?hmac=Asv2DU3rA_5D1xSe22xZK47WEAN0wjWeFOhzd13ujW4",
    };
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
                    <View className={"h-[200px] w-full rounded-2xl bg-background-default"}></View>
                    <View className={"py-[30px] flex-1"}>
                        <View
                            className={twMerge(
                                ["flex-row", "justify-between", "items-center"],
                                ["py-5", "border-b", "border-text-secondary"],
                            )}>
                            <Text className={"font-semibold text-2xl"}>노트북01</Text>
                            <Badge status={"이용가능"} className={"self-end"} />
                        </View>
                        <View>
                            <View
                                className={twMerge(
                                    ["flex-row", "justify-between"],
                                    ["border-b border-divider py-5"],
                                )}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                    ])}>
                                    카테고리
                                </Text>
                                <Text className={twMerge(["text-lg", "text-text-default"])}>
                                    IT기기
                                </Text>
                            </View>
                            <View
                                className={twMerge(
                                    ["flex-row", "justify-between"],
                                    ["border-b border-divider py-5"],
                                )}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                    ])}>
                                    총 수량
                                </Text>
                                <Text className={twMerge(["text-lg", "text-text-default"])}>
                                    50
                                </Text>
                            </View>
                            <View
                                className={twMerge(
                                    ["flex-row", "justify-between"],
                                    ["border-b border-divider py-5"],
                                )}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                    ])}>
                                    사용가능
                                </Text>
                                <Text className={twMerge(["text-lg", "text-success-main"])}>
                                    28
                                </Text>
                            </View>
                            <View
                                className={twMerge(
                                    ["flex-row", "justify-between"],
                                    ["border-b border-divider py-5"],
                                )}>
                                <Text
                                    className={twMerge([
                                        "font-semibold",
                                        "text-lg",
                                        "text-text-default",
                                        "min-[100px]"
                                    ])}>
                                    설명
                                </Text>
                                <Text className={twMerge(["text-lg", "text-text-default"])}>
                                    업무용 노트북입니다.
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View className={twMerge(["flex-row", "w-full", "gap-2"])}>
                        <Button
                            variant={"outline"}
                            className={"h-[60px] w-auto flex-1"}
                            textClassName={"text-xl"}>
                            삭제
                        </Button>
                        <Button className={"h-[60px] w-auto flex-1"} textClassName={"text-xl"}>
                            수정
                        </Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
export default ManagerEquipmentDetailPage;
