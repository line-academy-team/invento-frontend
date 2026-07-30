import { ScrollView, View, Text, Image, Pressable } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import Badge from "@/components/common/Badge/Badge";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";

function ManagerMainPage() {
    const router = useRouter();

    const mockData = [
        {
            logo: require("@/assets/images/common/build_circle.png"),
            title: "전체 장비 수",
            number: "128",
            background: "bg-secondary-main",
        },
        {
            logo: require("@/assets/images/common/short_stay.png"),
            title: "대여중",
            number: "128",
            background: "bg-success-main",
        },
        {
            logo: require("@/assets/images/common/box_add.png"),
            title: "대여 요청",
            number: "128",
            background: "bg-warning-main",
        },
        {
            logo: require("@/assets/images/common/devices_off.png"),
            title: "고장 신고",
            number: "128",
            background: "bg-error-main",
        },
    ];
    const mockData2 = [
        {
            equipment: "노트북01",
            name: "김영희 대리",
            date: "07.24",
            status: "요청",
        },
        {
            equipment: "프로젝터",
            name: "이철수 과장",
            date: "07.24",
            status: "승인",
        },
        {
            equipment: "마이크",
            name: "유영수 연구원",
            date: "07.24",
            status: "반려",
        },
        {
            equipment: "마이크 4",
            name: "유영수 연구원",
            date: "07.24",
            status: "대기",
        },
    ];
    return (
        <ScrollView>
            <MainHeader variant={"userMain"} onMenuPress={() => {}} />
            <View className={"px-[30px] bg-background-default"}>
                <Text className={"mt-8 font-pretendard text-lg text-text-default"}>안녕하세요</Text>
                <View className={"mt-4 flex-row gap-3 items-center"}>
                    <Text className={"font-pretendard-semibold text-xl text-text-default"}>
                        김철수님
                    </Text>
                    <Badge status={"오너"} />
                </View>
                <View className={"mt-5 flex-row gap-3 flex-wrap"}>
                    {mockData.map((item, i) => (
                        <View
                            className={twMerge(
                                "w-[170px] h-[120px] rounded-[18px] p-4 justify-between",
                                item.background,
                            )}
                            key={i}>
                            <View className={"flex-row justify-between items-center"}>
                                <Image
                                    source={item.logo}
                                    style={{
                                        width: 36,
                                        height: 36,
                                    }}
                                />
                                <Text className={"font-pretendard-semibold text-lg text-white"}>
                                    {item.title}
                                </Text>
                            </View>
                            <Text className={"font-pretendard-bold text-xl text-white self-end"}>
                                {item.number}
                            </Text>
                        </View>
                    ))}
                </View>
                <View className={"mt-8 flex-row justify-between items-center"}>
                    <Text className={"font-pretendard-medium text-xl"}>최근 대여 요청</Text>
                    <Pressable
                        onPress={() => {
                            router.push("/manager/rental");
                        }}>
                        <View className={"flex-row gap-2 items-center"}>
                            <Text className={"text-text-secondary"}>전체 보기</Text>
                            <Image
                                source={require("@/assets/images/common/arrow_forward.png")}
                                style={{
                                    width: 18,
                                    height: 18,
                                }}
                            />
                        </View>
                    </Pressable>
                </View>
                <View className={"mt-3 bg-background-paper rounded-[16px]"}>
                    {mockData2.map((item, i) => (
                        <View
                            className={"py-5 px-5 border-b border-divider last:border-b-0"}
                            key={"비품" + i}>
                            <Text className={"font-pretendard-semibold text-lg text-text-default"}>
                                {item.equipment}
                            </Text>
                            <View className={"flex-row justify-between items-center mt-1"}>
                                <View className={"flex-row gap-1"}>
                                    <Text className={"font-pretendard text-text-secondary"}>
                                        {item.name}
                                    </Text>
                                    <Text className={"font-pretendard text-text-secondary"}>|</Text>
                                    <Text className={"font-pretendard text-text-secondary"}>
                                        {item.date}
                                    </Text>
                                </View>
                                <Badge status={item.status} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

export default ManagerMainPage;
