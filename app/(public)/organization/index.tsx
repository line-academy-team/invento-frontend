import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";
import Button from "@/components/common/Button/Button";

export default function OrganizationIndexPage() {
    const { authUser } = useUserStore();
    const user = authUser?.user;
    const memberInfo = authUser?.memberInfo;

    const isPending = memberInfo?.status === "PENDING";
    const organizationName = memberInfo?.organizationName || "Work";
    console.log(authUser?.user);
    const handleCancelRequest = async () => {};

    return (
        <View className="flex-1 bg-background-default items-center">
            <View className=" w-full bg-background-default justify-between pb-8">
                <View
                    className="bg-white h-[88px] pl-2 z-10 justify-center"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 2,
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                    }}>
                    <Text className=" pl-8 text-2xl font-pretendard-bold text-text-default">
                        단체가입
                    </Text>
                </View>

                <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-base font-pretendard-medium text-text-default mt-12 mb-3.5">
                        안녕하세요
                    </Text>
                    <Text className="text-2xl font-pretendard-semibold text-text-default mb-14">
                        {user?.name || "사용자"}님
                    </Text>

                    {isPending ? (
                        <>
                            <Text className="text-text-secondary text-lg font-pretendard-medium mb-8 text-center">
                                '{organizationName}' 가입 승인 대기 중이에요
                            </Text>

                            <Image
                                source={require("@/assets/images/organization/diversity_3 (1).png")}
                                style={{ width: 100, height: 100 }}
                                className="mb-6"
                                resizeMode="contain"
                            />
                            <Button
                                isLoading={isPending}
                                onPress={handleCancelRequest}
                                className="border border-error-main px-5 py-2 rounded-full active:opacity-80"
                                textClassName="text-sm">
                                가입 신청 취소
                            </Button>
                        </>
                    ) : (
                        <>
                            <Text className="text-text-secondary text-lg font-pretendard-medium mb-14 text-center">
                                아직 가입한 단체가 없어요
                            </Text>

                            <Image
                                source={require("@/assets/images/organization/diversity_3 (1).png")}
                                style={{ width: 100, height: 100 }}
                                className="mb-16"
                                resizeMode="contain"
                            />

                            <View className="items-center mb-10">
                                <Text className="text-primary-main font-pretendard-semibold text-base">
                                    단체를 생성하거나
                                </Text>
                                <Text className="text-primary-main font-pretendard-semibold text-base mt-0.5">
                                    초대코드로 가입하세요
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                <View className="px-6 w-full gap-y-6">
                    <Button
                        isLoading={isPending}
                        onPress={() => router.push("/organization/create")}
                        className="h-14"
                        textClassName="text-lg">
                        단체 생성
                    </Button>

                    <Button
                        isLoading={isPending}
                        onPress={() => router.push("/organization/join")}
                        className="h-14"
                        textClassName="text-lg">
                        단체 가입
                    </Button>
                </View>
            </View>
        </View>
    );
}
