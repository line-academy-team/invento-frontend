import { ScrollView, Text, View, Image as RNImage } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import Badge from "@/components/common/Badge/Badge";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";
import { useUserStore } from "@/stores/user/useUserStore";
import { Href, useRouter } from "expo-router";

interface ProfileRowProps {
    label: string;
    value: string;
    isLast?: boolean;
}

function ProfileRow({ label, value, isLast = false }: ProfileRowProps) {
    return (
        <View
            className={twMerge(
                "flex-row",
                "items-center",
                "justify-between",
                "p-5",
                !isLast && "border-b border-divider",
            )}>
            <Text className={twMerge(["font-semibold", "text-lg", "text-text-secondary"])}>
                {label}
            </Text>

            <Text
                className={twMerge([
                    "flex-1",
                    "ml-5",
                    "text-right",
                    "text-lg",
                    "text-text-secondary",
                ])}>
                {value}
            </Text>
        </View>
    );
}

function UserMyInfoPage() {
    const router = useRouter();
    const authUser = useUserStore(state => state.authUser);
    const logout = useUserStore(state => state.logout);

    const formatDate = (date?: string | null) => {
        if (!date) {
            return "-";
        }
        return date.split("T")[0];
    };

    const handleLogout = async () => {
        await logout();
        router.replace("/");
    };

    if (!authUser) {
        return (
            <View className={"flex-1"}>
                <MainHeader title={"마이"} />

                <View
                    className={twMerge([
                        "flex-1",
                        "items-center",
                        "justify-center",
                        "px-[30px]",
                        "bg-background-default",
                    ])}>
                    <Text className={"text-lg text-text-secondary"}>
                        사용자 정보를 불러올 수 없습니다.
                    </Text>
                </View>
            </View>
        );
    }

    const { user, memberInfo } = authUser;
    const profileImageUrl = user.imageUrl ?? null;

    const isManager = memberInfo?.role === "OWNER" || memberInfo?.role === "MANAGER";

    const memberRoleText = isManager
        ? memberInfo?.role === "OWNER"
            ? "오너"
            : "관리자"
        : "일반 유저";

    return (
        <View className={"flex-1"}>
            <MainHeader title={"마이"} />

            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"flex-1 px-[30px] py-8 bg-background-default"}>
                    <View
                        className={twMerge([
                            "flex-row",
                            "items-center",
                            "pb-8",
                            "justify-between",
                        ])}>
                        <View className={twMerge(["flex-row", "items-center"])}>
                            <View
                                className={twMerge([
                                    "w-20",
                                    "h-20",
                                    "rounded-full",
                                    "overflow-hidden",
                                    "bg-background-paper",
                                    "justify-center",
                                    "items-center",
                                    "mr-4",
                                ])}>
                                {profileImageUrl ? (
                                    <RNImage
                                        source={{ uri: profileImageUrl }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Feather name="user" size={36} color="#111827" />
                                )}
                            </View>

                            <View>
                                <Text
                                    className={twMerge([
                                        "text-xl",
                                        "text-text-default",
                                        "font-semibold",
                                        "pb-2",
                                    ])}>
                                    {user.name}님
                                </Text>

                                <Badge status={memberRoleText} />
                            </View>
                        </View>

                        <Button
                            onPress={() => router.push("/user/settings/profile" as Href)}
                            className="w-24 self-end p-2 mb-2">
                            정보수정
                        </Button>
                    </View>

                    <View
                        className={twMerge([
                            "bg-background-paper",
                            "rounded-2xl",
                            "overflow-hidden",
                        ])}>
                        <ProfileRow label={"이메일"} value={user.email} />

                        {memberInfo?.organizationName && (
                            <ProfileRow label={"단체"} value={memberInfo.organizationName} />
                        )}

                        <ProfileRow
                            label={"계정 가입일"}
                            value={formatDate(user.createdAt)}
                            isLast
                        />
                    </View>

                    <Button
                        onPress={() => router.push("/user/settings/password" as Href)}
                        className={twMerge(["h-[60px]", "mt-10"])}
                        textClassName={"text-xl"}
                        variant={"outline"}>
                        비밀번호 수정
                    </Button>

                    <Button
                        className={twMerge(["h-[60px]", "mt-4"])}
                        textClassName={"text-xl"}
                        onPress={handleLogout}>
                        로그아웃
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default UserMyInfoPage;
