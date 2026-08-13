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
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import { Href, useRouter, usePathname } from "expo-router";
import { useCallback, useState } from "react";
import Badge from "@/components/common/Badge/Badge";
import SelectionActionBar from "@/components/common/selection/SelectionActionBar";
import { useFocusEffect } from "@react-navigation/native";
import managerRentalApi from "@/api/manager/managerRentalApi";
import { useUserStore } from "@/stores/user/useUserStore";
import { OrgRental } from "@/types/rental";
import { formatDate } from "@/utils/date";

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

            <Pressable onPress={() => router.push("/manager/report" as Href)}>
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
    const [search, setSearch] = useState("");
    const [checkedIds, setCheckedIds] = useState<number[]>([]);
    const [rentals, setRentals] = useState<OrgRental[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const organizationId = useUserStore(state => state.authUser?.memberInfo?.organizationId);

    const categories = ["대기", "승인", "반려"];

    const loadRentals = useCallback(async () => {
        if (!organizationId) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setRentals(await managerRentalApi.getOrgRentalRequestList(organizationId));
        } catch (error) {
            console.error(error);
            Alert.alert("조회 실패", "조직 대여 요청을 불러오지 못했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [organizationId]);

    useFocusEffect(
        useCallback(() => {
            loadRentals();
        }, [loadRentals]),
    );

    const getStatus = (rental: OrgRental) => {
        if (rental.status === "REQUESTED") return "대기";
        if (rental.status === "REJECTED") return "반려";
        if (rental.status === "BORROWED" || rental.status === "RETURNED") return "승인";
        return "취소";
    };

    const filteredData = rentals.filter(
        data =>
            data.equipment.name.toLowerCase().includes(search.trim().toLowerCase()) &&
            (selectedTab === "전체" ? true : getStatus(data) === selectedTab),
    );

    const selectableData = filteredData.filter(data => data.status === "REQUESTED");
    const isAllChecked =
        selectableData.length > 0 && selectableData.every(data => checkedIds.includes(data.id));

    const toggleAll = () => {
        if (isAllChecked) {
            setCheckedIds([]);
        } else {
            setCheckedIds(selectableData.map(d => d.id));
        }
    };

    const toggleItem = (id: number) => {
        if (rentals.find(rental => rental.id === id)?.status !== "REQUESTED") return;

        if (checkedIds.includes(id)) {
            setCheckedIds(checkedIds.filter(itemId => itemId !== id));
        } else {
            setCheckedIds([...checkedIds, id]);
        }
    };

    const handleComplete = async (actionType: string) => {
        if (!organizationId) return;

        try {
            await Promise.all(
                checkedIds.map(rentalId =>
                    managerRentalApi.processRental(organizationId, rentalId, {
                        status: actionType === "승인" ? "BORROWED" : "REJECTED",
                        ...(actionType === "반려" && { rejectedReason: "관리자 일괄 반려" }),
                    }),
                ),
            );
            Alert.alert("처리 완료", `${checkedIds.length}개의 요청을 ${actionType}했습니다.`);
            setCheckedIds([]);
            await loadRentals();
        } catch (error) {
            console.error(error);
            Alert.alert("처리 실패", "선택한 대여 요청 처리 중 오류가 발생했습니다.");
            setCheckedIds([]);
            await loadRentals();
        }
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
                            value={search}
                            onChangeText={setSearch}
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
                        {isLoading ? (
                            <ActivityIndicator className="py-10" color="#7C3AED" />
                        ) : filteredData.length === 0 ? (
                            <Text className="py-10 text-center text-text-secondary">
                                조회된 대여 요청이 없습니다.
                            </Text>
                        ) : (
                            filteredData.map((data, i) => (
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
                                                    {data.equipment.name}
                                                </Text>
                                                <View className={"flex-row items-center"}>
                                                    <Text
                                                        className={
                                                            "font-pretendard text-sm text-text-secondary mr-4"
                                                        }>
                                                        {data.member.user.name}
                                                    </Text>
                                                    <Text
                                                        className={
                                                            "font-pretendard text-sm text-text-secondary"
                                                        }>
                                                        {formatDate(data.requestedAt)}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                        <Badge status={getStatus(data)} />
                                    </View>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            <SelectionActionBar selectedCount={checkedIds.length} onComplete={handleComplete} />
        </View>
    );
}
export default ManagerRentalPage;
