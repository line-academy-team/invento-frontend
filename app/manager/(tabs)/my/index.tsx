import { ScrollView, Text, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { twMerge } from "tailwind-merge";
import Badge from "@/components/common/Badge/Badge";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/common/Button/Button";



function ManagerUserPage() {
    return (
        <View className={twMerge(["flex-1"])}>
            <MainHeader title={"마이"} />
            <ScrollView className={"flex-1"} contentContainerClassName={"flex-grow"}>
                <View className={"flex-1 px-[30px] py-8 bg-background-default"}>
                    <View className={twMerge(["flex-row", "items-center", "pb-8"])}>
                        <View
                            className={twMerge([
                                "w-20",
                                "h-20",
                                "rounded-full",
                                "bg-background-paper",
                                "justify-center",
                                "items-center",
                                "mr-4",
                            ])}>
                            <Feather name={"user"} size={36} />
                        </View>
                        <View>
                            <Text
                                className={twMerge([
                                    "text-xl",
                                    "text-text-default",
                                    "font-semibold",
                                    "pb-2",
                                ])}>
                                김철수대표님
                            </Text>
                            <Badge status={"오너"} />
                        </View>
                    </View>
                    <View className={twMerge(["bg-background-paper", "rounded-2xl"])}>
                        <View
                            className={twMerge(
                                ["flex-row", "justify-between"],
                                ["p-5", "border-b", "border-divider"],
                            )}>
                            <Text
                                className={twMerge([
                                    "font-semibold",
                                    "text-lg",
                                    "text-text-secondary",
                                ])}>
                                이메일
                            </Text>
                            <Text className={twMerge(["text-lg", "text-text-secondary"])}>
                                kim@compay.com
                            </Text>
                        </View>
                        <View
                            className={twMerge(
                                ["flex-row", "justify-between"],
                                ["p-5", "border-b", "border-divider"],
                            )}>
                            <Text
                                className={twMerge([
                                    "font-semibold",
                                    "text-lg",
                                    "text-text-secondary",
                                ])}>
                                부서
                            </Text>
                            <Text className={twMerge(["text-lg", "text-text-secondary"])}>
                                개발팀
                            </Text>
                        </View>
                        <View
                            className={twMerge(
                                ["flex-row", "justify-between"],
                                ["p-5", "border-b", "border-divider"],
                            )}>
                            <Text
                                className={twMerge([
                                    "font-semibold",
                                    "text-lg",
                                    "text-text-secondary",
                                ])}>
                                직급
                            </Text>
                            <Text className={twMerge(["text-lg", "text-text-secondary"])}>
                                대표님
                            </Text>
                        </View>
                        <View className={twMerge(["flex-row", "justify-between"], ["p-5"])}>
                            <Text
                                className={twMerge([
                                    "font-semibold",
                                    "text-lg",
                                    "text-text-secondary",
                                ])}>
                                가입일
                            </Text>
                            <Text className={twMerge(["text-lg", "text-text-secondary"])}>
                                2024-01-15
                            </Text>
                        </View>
                    </View>
                    <Button
                        className={twMerge(["h-[60px]", "mt-10"])}
                        textClassName={"text-xl"}
                        variant={"outline"}>
                        비밀번호변경
                    </Button>
                    <Button className={twMerge(["h-[60px]", "mt-4"])} textClassName={"text-xl"}>
                        로그아웃
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
}

export default ManagerUserPage;
