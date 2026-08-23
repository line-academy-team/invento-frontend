import { useEffect, useState } from "react";
import { OrganizationCount } from "@/types/organization";
import adminApi from "@/api/admin/adminApi";
import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import Badge from "@/components/common/Badge/Badge";
import { useRouter } from "expo-router";
import { FaUser } from "react-icons/fa";
import { MaterialIcons } from "@expo/vector-icons";

function AdminOrganizationPage() {
    const router = useRouter();
    const [selected, setSelected] = useState("전체");
    const [search, setSearch] = useState("");
    const [orgList, setOrgList] = useState<OrganizationCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const categories = ["전체", "정상", "정지"];

    useEffect(() => {
        const loadOrgList = async () => {
            try {
                setIsLoading(true);
                const organizations = await adminApi.getOrganizations();
                setOrgList(organizations);
            } catch (error) {
                console.log(error);
                const msg = "조직 목록을 불러오는 데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                } else {
                    Alert.alert("오류", msg);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadOrgList().then(() => {});
    }, []);

    const getStatus = (org: OrganizationCount) => {
        if (org.deletedAt) return "정지";
        return "정상";
    };

    return (
        <View className="flex-1 bg-background-paper relative">
            <MainHeader title={"조직 관리"} />

            <ScrollView className="flex-1" contentContainerClassName={"flex-grow"}>
                <View className="px-[30px] py-8 bg-background-paper relative">
                    <View className={"relative"}>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-background-paper border border-divider",
                                "rounded-[16px] pl-[50px] text-text-main font-pretendard text-base",
                            )}
                            placeholder={"조직명 검색"}
                            placeholderTextColor={"#9CA3AF"}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <Image
                            source={require("@/assets/images/common/search.png")}
                            style={{ width: 24, height: 24 }}
                            className={"absolute top-[15px] left-[16px] opacity-50"}
                        />
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className={"mt-[30px] mb-2"}>
                        <View className="flex-row gap-x-6 px-1">
                            {categories.map((category, i) => (
                                <Pressable
                                    key={"category" + i}
                                    onPress={() => setSelected(category)}>
                                    <Text
                                        className={twMerge(
                                            "font-pretendard-semibold text-lg pb-2",
                                            selected === category
                                                ? "text-primary-main border-b-2 border-primary-main"
                                                : "text-text-secondary border-b-2 border-transparent",
                                        )}>
                                        {category}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>

                    <View
                        className={
                            "mt-4 bg-background-paper border-b border-divider overflow-hidden"
                        }>
                        {isLoading ? (
                            <ActivityIndicator className="py-10" color="#7C3AED" />
                        ) : orgList.length === 0 ? (
                            <Text className="py-10 text-center text-text-secondary">
                                조회된 조직이 없습니다.
                            </Text>
                        ) : (
                            orgList.map((data, i) => (
                                <View
                                    key={i}
                                    className={twMerge(
                                        "flex-row p-6 justify-between items-center border-b border-divider",
                                        i === orgList.length - 1 && "border-b-0",
                                    )}>
                                    <View className={"flex-row items-center"}>
                                        <View className="w-[64px] h-[64px] rounded-2xl justify-center items-center bg-primary-light">
                                            <MaterialIcons
                                                name={"domain"}
                                                size={45}
                                                className="text-primary-main"
                                            />
                                        </View>
                                        <View className={"ml-5 justify-center"}>
                                            <Text
                                                className={
                                                    "font-pretendard-bold text-xl text-text-main mb-0.5"
                                                }>
                                                {data.name}
                                            </Text>
                                            <View className="flex-row gap-1 items-center">
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary"
                                                    }>
                                                    대표자
                                                </Text>
                                                <FaUser size={12} style={{ color: "#6B7280 " }} />
                                                <Text
                                                    className={
                                                        "font-pretendard text-sm text-text-secondary"
                                                    }>
                                                    {data.creator.name}
                                                </Text>
                                            </View>
                                            <View className="flex-row gap-1 items-center">
                                                <Text
                                                    className={
                                                        "font-pretendard-semibold text-sm text-text-secondary"
                                                    }>
                                                    멤버 {data._count.members} •{" "}
                                                    {data._count.equipment}
                                                </Text>
                                            </View>

                                            <Text
                                                className={
                                                    "font-pretendard-medium text-sm text-text-secondary"
                                                }>
                                                생성일 : {data.createdAt?.slice(0, 10)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="gap-3 justify-center items-center">
                                        <Badge status={getStatus(data)} />
                                        <View className="border border-primary-main w-[72px] h-[24px] rounded-[16px] items-center justify-center">
                                            <Text className="text-primary-main font-pretendard-bold text-[14px]">
                                                관리
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

export default AdminOrganizationPage;
