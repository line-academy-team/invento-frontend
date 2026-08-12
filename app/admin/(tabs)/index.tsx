import { Alert, Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useUserStore } from "@/stores/user/useUserStore";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { Organization } from "@/types/organization";
import adminApi from "@/api/admin/adminApi";
import Badge from "@/components/common/Badge/Badge";
import { twMerge } from "tailwind-merge";
import { FiUsers } from "react-icons/fi";
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

function AdminMainPage() {
    const { authUser } = useUserStore();
    const [userList, setUserList] = useState<User[]>([]);
    const [orgList, setOrgList] = useState<Organization[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const user = authUser?.user;

    useEffect(() => {
        const loadAdmin = async () => {
            try {
                setIsLoading(true);
                const users = await adminApi.getUsers();
                setUserList(users);
                const organizations = await adminApi.getOrganizations();
                setOrgList(organizations);
            } catch (error) {
                console.log(error);
                const msg = "사용자, 조직 현황을 불러오는데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                } else {
                    Alert.alert("오류", msg);
                }
            } finally {
                setIsLoading(false);
            }
        };
        loadAdmin().then(() => {});
    }, []);

    const todayDate = new Date().toISOString().split("T")[0];

    const dashboardData = [
        {
            logo: (
                <View className="w-[50px] h-[50px] justify-center items-center bg-primary-light rounded-2xl">
                    <FiUsers size={37} className="text-primary-main" />
                </View>
            ),
            title: "전체 회원",
            count: userList.length,
            subTitle: "전체 등록된 회원 수",
        },
        {
            logo: (
                <View className="w-[50px] h-[50px] justify-center items-center bg-success-light rounded-2xl">
                    <MaterialIcons name={"domain"} size={37} className="text-success-main" />
                </View>
            ),
            title: "전체 조직",
            count: orgList.length,
            subTitle: "전체 등록된 조직 수",
        },
        {
            logo: (
                <View className="w-[50px] h-[50px] justify-center items-center bg-[#EFF5FF] rounded-2xl">
                    <MaterialCommunityIcons
                        name={"shield-account"}
                        size={37}
                        className="text-secondary-main"
                    />
                </View>
            ),
            title: "관리자 계정",
            count: userList.filter(u => u.role === "ADMIN").length,
            subTitle: "ADMIN 권한 계정 수",
        },
        {
            logo: (
                <View className="w-[50px] h-[50px] justify-center items-center bg-warning-light rounded-2xl">
                    <AntDesign name={"user-add"} size={37} className="text-warning-main" />
                </View>
            ),
            title: "오늘 가입 회원",
            count: userList.filter(u => u.createdAt && u.createdAt.split("T")[0] === todayDate)
                .length,
            subTitle: "오늘 신규 가입 회원 수",
        },
    ];

    return (
        <ScrollView>
            <MainHeader variant={"adminMain"} onMenuPress={() => {}} />
            <View className={"flex-1 px-[30px] py-8 bg-background-default"}>
                <Text className={"font-pretendard-medium text-lg text-text-default"}>
                    안녕하세요
                </Text>
                <View className={"flex-row gap-3 items-center"}>
                    <Text className={"font-pretendard-bold text-2xl text-text-default"}>
                        {user?.name || "관리자"}님
                    </Text>
                    <Badge status={"앱 관리자"} />
                </View>
                <View className={"mt-5 flex-row justify-between flex-wrap gap-2"}>
                    {dashboardData.map((item, i) => (
                        <View
                            key={i}
                            className={twMerge(
                                "w-[48%] h-[120px] rounded-[18px] p-4 justify-between",
                                "border border-divider bg-background-paper",
                            )}>
                            <View className="flex-row gap-2.5 items-center">
                                {item.logo}

                                <Text className="font-pretendard-semibold text-lg">
                                    {item.title}
                                </Text>
                            </View>
                            <View className="flex-row justify-between items-end">
                                <Text className="font-pretendard-semibold text-text-secondary text-xs">
                                    {item.subTitle}
                                </Text>
                                <Text className="font-pretendard-bold text-2xl">{item.count}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="mt-8 flex-row justify-between flex-wrap gap-2">
                    <View className="w-[48%]">
                        <View className={"flex-row justify-between items-center"}>
                            <Text className={"font-pretendard-medium text-xl"}>최근 가입 회원</Text>

                            <Pressable onPress={() => router.push("/admin/user" as any)}>
                                <View className={"flex-row gap-2 items-center"}>
                                    <Text className={"text-text-secondary"}>All</Text>

                                    <Image
                                        source={require("@/assets/images/common/arrow_forward.png")}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </View>
                            </Pressable>
                        </View>

                        <View className={"mt-3 bg-background-paper rounded-[16px] overflow-hidden"}>
                            {userList.slice(0, 5).map((item, i) => (
                                <View
                                    key={i}
                                    className="py-5 px-5 border-b border-divider flex-row gap-2 items-center">
                                    <Image
                                        source={require("@/assets/images/common/user.png")}
                                        style={{ width: 35, height: 35 }}
                                    />

                                    <View>
                                        <Text className="font-pretendard-semibold text-sm">
                                            {item.name}
                                        </Text>
                                        <Text
                                            className={
                                                "font-pretendard text-xs text-text-secondary"
                                            }>
                                            {item.email}
                                        </Text>
                                        <Text
                                            className={
                                                "font-pretendard text-xs text-text-secondary"
                                            }>
                                            {item.createdAt?.slice(0, 10)}
                                        </Text>
                                    </View>
                                    <Text></Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View className="w-[48%]">
                        <View className={"flex-row justify-between items-center"}>
                            <Text className={"font-pretendard-medium text-xl"}>최근 생성 조직</Text>

                            <Pressable onPress={() => router.push("/admin/organization" as any)}>
                                <View className={"flex-row gap-2 items-center"}>
                                    <Text className={"text-text-secondary"}>All</Text>

                                    <Image
                                        source={require("@/assets/images/common/arrow_forward.png")}
                                        style={{ width: 18, height: 18 }}
                                    />
                                </View>
                            </Pressable>
                        </View>

                        <View
                            className={
                                "mt-3 bg-background-paper rounded-[16px] overflow-hidden"
                            }></View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

export default AdminMainPage;
