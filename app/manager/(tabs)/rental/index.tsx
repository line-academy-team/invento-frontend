import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { useRouter } from "expo-router";
import { useState } from "react";
import Badge from "@/components/common/Badge/Badge";
// 방금 만든 컴포넌트 불러오기 (경로를 맞춰주세요)
import SelectionActionBar from "@/components/common/selection/SelectionActionBar";

// 체크박스 컴포넌트
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

export default function ManagerRentalPage() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState("전체");

    // 체크된 아이디들을 관리하는 상태
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

    // 하단 바 컴포넌트에서 완료 버튼을 눌렀을 때 실행될 함수
    const handleComplete = (actionType: string) => {
        console.log(`선택된 ID: ${checkedIds}, 처리 상태: ${actionType}`);
        alert(`${checkedIds.length}개의 요청이 ${actionType} 처리되었습니다.`);
        setCheckedIds([]); // 처리 후 체크박스 초기화
    };

    return (
        <View className={"flex-1 bg-background-default"}>
            <MainHeader title={"대여 관리"} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow pb-[120px]"}>
                <View className={"flex-1 px-[30px] py-8"}>
                    {/* 검색 영역 */}
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

                    {/* 카테고리 탭 & 전체선택 */}
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
                                        setCheckedIds([]); // 탭 변경 시 선택 초기화
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

                    {/* 리스트 영역 */}
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

            {/* 분리한 하단 바 컴포넌트에 Props 전달 */}
            <SelectionActionBar selectedCount={checkedIds.length} onComplete={handleComplete} />
        </View>
    );
}
