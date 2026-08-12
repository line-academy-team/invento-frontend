import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { useRouter, usePathname } from "expo-router"; // usePathname 추가
import { useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import SelectionActionBar from "@/components/common/selection/SelectionActionBar";

const Checkbox = ({ isChecked, onPress }: { isChecked: boolean; onPress: () => void }) => (
    <Pressable
        onPress={onPress}
        className={twMerge(
            "w-5 h-5 rounded-[4px] border items-center justify-center mr-2",
            isChecked ? "bg-primary-main border-primary-main" : "bg-white border-divider",
        )}>
        {isChecked && <Text className="text-white text-xs font-bold">✓</Text>}
    </Pressable>
);


const TabTitle = () => {
    const router = useRouter();
    const pathname = usePathname();

    const isRental = pathname.includes("rental");

    return (
        <View className="flex-row items-center">
            <Pressable onPress={() => router.push("/manager/rental")}>
                <Text
                    className={twMerge(
                        "font-pretendard-bold text-2xl",
                        isRental ? "text-text-main" : "text-text-secondary",
                    )}>
                    대여 관리
                </Text>
            </Pressable>


            <Text className="text-2xl font-pretendard-light text-text-secondary mx-3 mb-1">|</Text>


            <Pressable onPress={() => router.push("/manager/report")}>
                <Text
                    className={twMerge(
                        "font-pretendard-bold text-2xl",
                        !isRental ? "text-text-main" : "text-text-secondary",
                    )}>
                    파손관리
                </Text>
            </Pressable>
        </View>
    );
};

function ManagerRentalPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("전체");

    const [checkedIds, setCheckedIds] = useState<number[]>([]);

    const categories = ["대기", "승인", "반려"];

    const mockData = [
        { id: 1, name: "노트북 01", userName: "김사용", date: "2026.07.24", status: "대기" },
        { id: 2, name: "노트북 02", userName: "이사용", date: "2026.07.24", status: "승인" },
        { id: 3, name: "노트북 03", userName: "박사용", date: "2026.07.24", status: "반려" },
        { id: 4, name: "노트북 04", userName: "최사용", date: "2026.07.25", status: "대기" },
    ];

    const filteredData = mockData.filter(data =>
        selectedTab === "전체" ? true : data.status === selectedTab,
    );

    const isAllChecked = filteredData.length > 0 && checkedIds.length === filteredData.length;

    const toggleAll = () => {
        if (isAllChecked) {
            setCheckedIds([]);
        } else {
            setCheckedIds(filteredData.map(d => d.id));
        }
    };

    const toggleItem = (id: number) => {
        if (checkedIds.includes(id)) {
            setCheckedIds(checkedIds.filter(itemId => itemId !== id));
        } else {
            setCheckedIds([...checkedIds, id]);
        }
    };

    const handleComplete = (actionType: string) => {
        console.log(`선택된 ID: ${checkedIds}, 처리 상태: ${actionType}`);
        alert(`${checkedIds.length}개의 요청이 ${actionType} 처리되었습니다.`);
        setCheckedIds([]);
    };

    return (
        <View className={"flex-1 bg-background-default"}>
            <MainHeader customTitle={<TabTitle />} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow pb-[120px]"}>
                <View className={"flex-1 px-[30px] py-8"}>
                    <View>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-white border border-transparent rounded-[16px] pl-[50px] text-text-main",
                                "shadow-sm shadow-black/5",
                            )}
                            placeholder={"장비명 검색"}
                        />
                        <Image
                            source={require("@/assets/images/common/search.png")}
                            style={{ width: 24, height: 24, tintColor: "#888" }}
                            className={"absolute top-[15px] left-[16px]"}
                        />
                    </View>

                    <View className={"mt-8 flex-row justify-between items-center"}>
                        <View className={"flex-row items-center"}>
                            <Checkbox isChecked={isAllChecked} onPress={toggleAll} />
                            <Pressable onPress={() => setSelectedTab("전체")}>
                                <Text
                                    className={twMerge(
                                        "font-pretendard-semibold text-base",
                                        selectedTab === "전체"
                                            ? "text-primary-main"
                                            : "text-text-secondary",
                                    )}>
                                    전체선택
                                </Text>
                            </Pressable>
                        </View>

                        <View className={"flex-row space-x-6"}>
                            {categories.map(category => (
                                <Pressable
                                    key={category}
                                    onPress={() => {
                                        setSelectedTab(category);
                                        setCheckedIds([]);
                                    }}>
                                    <Text
                                        className={twMerge(
                                            "font-pretendard-semibold text-base",
                                            selectedTab === category
                                                ? "text-primary-main"
                                                : "text-text-secondary",
                                        )}>
                                        {category}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View
                        className={
                            "mt-4 rounded-2xl overflow-hidden bg-white shadow-sm shadow-black/5"
                        }>
                        {filteredData.map((data, i) => (
                            <Pressable
                                key={data.id}
                                onPress={() => router.push(`/manager/rental/${data.id}`)}>
                                <View
                                    className={twMerge(
                                        "flex-row p-5 items-center justify-between border-b border-divider",
                                        i === filteredData.length - 1 && "border-b-0",
                                    )}>
                                    <View className={"flex-row items-center flex-1"}>
                                        <Checkbox
                                            isChecked={checkedIds.includes(data.id)}
                                            onPress={() => toggleItem(data.id)}
                                        />
                                        <View className={"ml-2 justify-between"}>
                                            <Text
                                                className={
                                                    "font-pretendard-semibold text-lg text-text-main mb-1"
                                                }>
                                                {data.name}
                                            </Text>
                                            <View className={"flex-row items-center"}>
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary mr-4"
                                                    }>
                                                    {data.userName}
                                                </Text>
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary"
                                                    }>
                                                    {data.date}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Badge status={data.status} />
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <SelectionActionBar selectedCount={checkedIds.length} onComplete={handleComplete} />
        </View>
    );
}
export default ManagerRentalPage;
