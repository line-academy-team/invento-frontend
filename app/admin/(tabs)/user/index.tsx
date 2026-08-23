import { useEffect, useState } from "react";
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
import { User } from "@/types/user";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import Badge from "@/components/common/Badge/Badge";
import AdminUserByIdModal from "@/components/admin/adminUserByIdModal";
import { FaUser } from "react-icons/fa";

function AdminUserPage() {
    const [selected, setSelected] = useState("전체");
    const [search, setSearch] = useState("");
    const [userList, setUserList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModal, setIsModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const categories = ["전체", "USER", "ADMIN", "정지"];

    const loadOrgList = async () => {
        try {
            setIsLoading(true);
            const users = await adminApi.getUsers();
            setUserList(users);
        } catch (error) {
            console.log(error);
            const msg = "사용자 목록을 불러오는 데 실패했습니다.";
            if (Platform.OS === "web") {
                alert(msg);
            } else {
                Alert.alert("오류", msg);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrgList().then(() => {});
    }, []);

    const getStatus = (user: User) => {
        if (user.deletedAt) return "정지";
        return "정상";
    };

    const filteredUserList = userList.filter(user => {
        if (selected === "정지") {
            if (!user.deletedAt) return false;
        } else if (selected === "USER") {
            if (user.deletedAt || user.role !== "USER") return false;
        } else if (selected === "ADMIN") {
            if (user.deletedAt || user.role !== "ADMIN") return false;
        }

        if (search.trim() !== "") {
            const query = search.toLowerCase();
            const nameMatch = user.name?.toLowerCase().includes(query);
            const emailMatch = user.email?.toLowerCase().includes(query);
            return nameMatch || emailMatch;
        }

        return true;
    });

    return (
        <View className="flex-1 bg-background-paper relative">
            <MainHeader title={"유저 관리"} />

            <ScrollView className="flex-1" contentContainerClassName={"flex-grow"}>
                <View className="px-[30px] py-8 bg-background-paper relative">
                    <View className={"relative"}>
                        <TextInput
                            className={twMerge(
                                "w-full h-[54px] bg-background-paper border border-divider",
                                "rounded-[16px] pl-[50px] text-text-main font-pretendard text-base",
                            )}
                            placeholder={"유저 이름 또는 이메일 검색"}
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
                            "mt-4 bg-background-paper overflow-hidden"
                        }>
                        {isLoading ? (
                            <ActivityIndicator className="py-10" color="#7C3AED" />
                        ) : filteredUserList.length === 0 ? (
                            <Text className="py-10 text-center text-text-secondary">
                                조회된 사용자가 없습니다.
                            </Text>
                        ) : (
                            filteredUserList.map((data, i) => (
                                <Pressable
                                    key={data.id}
                                    onPress={() => {
                                        setSelectedUser(data);
                                        setIsModal(true);
                                    }}>
                                    <View
                                        className={twMerge(
                                            "flex-row p-6 justify-between items-center border-b border-divider",
                                            i === userList.length - 1 && "border-b-0",
                                        )}>
                                        <View className={"flex-row items-center"}>
                                            <View className="w-[64px] h-[64px] rounded-2xl justify-center items-center bg-primary-light">
                                                <FaUser size={30} className="text-primary-main" />
                                            </View>
                                            <View className={"ml-5 justify-center"}>
                                                <Text
                                                    className={
                                                        "font-pretendard-bold text-xl text-text-main mb-0.5"
                                                    }>
                                                    {data.name}
                                                </Text>
                                                <Text
                                                    className={
                                                        "font-pretendard-semibold text-xs text-text-secondary"
                                                    }>
                                                    {data.email}
                                                </Text>
                                                <Text
                                                    className={
                                                        "font-pretendard text-xs text-text-secondary"
                                                    }>
                                                    가입일 : {data.createdAt?.slice(0, 10)}
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
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>

            <AdminUserByIdModal
                visible={isModal}
                user={selectedUser}
                onClose={() => {
                    setIsModal(false);
                    setSelectedUser(null);
                }}
                onSuccess={() => {
                    loadOrgList().then(() => {});
                }}
            />
        </View>
    );
}

export default AdminUserPage;
