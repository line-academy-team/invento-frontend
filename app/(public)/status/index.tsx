import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";

export default function OrganizationStatusPage() {
    const { authUser, restoreLogin } = useUserStore();
    const [loading, setLoading] = useState(true);

    const user = authUser?.user;
    const memberInfo = authUser?.memberInfo;

    const organizationName = memberInfo?.organizationName || "Work";
    const isApproved = memberInfo?.status === "APPROVED";

    useEffect(() => {
        const checkStatus = async () => {
            try {
                await restoreLogin();
            } catch (error) {
                console.error("상태 확인 실패:", error);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, []);

    const handleGoHome = () => {
        router.replace("/user");
    };

    if (loading) {
        return (
            <View className="flex-1 bg-background-default justify-center items-center">
                <ActivityIndicator size="large" color="#7C3AED" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background-default items-center">
            <View className="flex-1 w-full bg-background-default justify-between pb-8">
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
                    <Text className="pl-8 text-2xl font-pretendard-bold text-text-default">
                        단체가입
                    </Text>
                </View>

                <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-base font-pretendard-medium text-text-default mb-2">
                        안녕하세요
                    </Text>
                    <Text className="text-2xl font-pretendard-bold text-text-default mb-10">
                        {user?.name || "사용자"}님
                    </Text>

                    {isApproved ? (
                        <>
                            <Text className="text-text-default text-lg font-pretendard-bold mb-8 text-center">
                                단체 가입이 완료 되었습니다.
                            </Text>

                            <View className="w-[120px] h-[120px] rounded-full bg-primary-main items-center justify-center mb-8">
                                <Image
                                    source={require("@/assets/images/diversity_3 (1).png")}
                                    style={{ width: 64, height: 64, tintColor: "#FFFFFF" }}
                                    resizeMode="contain"
                                />
                            </View>

                            <Text className="text-primary-main font-pretendard-semibold text-base mb-6">
                                필요한 비품을 신청하세요
                            </Text>
                        </>
                    ) : (
                        <>
                            <Text className="text-text-secondary text-lg font-pretendard-medium mb-8 text-center">
                                {organizationName} 가입 승인 대기중 입니다.
                            </Text>

                            <View className="w-[120px] h-[120px] rounded-full bg-white border border-gray-200 items-center justify-center mb-8">
                                <Image
                                    source={require("@/assets/images/diversity_3 (1).png")}
                                    style={{ width: 64, height: 64, tintColor: "#D9D9D9" }}
                                    resizeMode="contain"
                                />
                            </View>

                            <View className="items-center mb-6">
                                <Text className="text-primary-main font-pretendard-semibold text-base">
                                    아직 가입된 단체가 없습니다.
                                </Text>
                                <Text className="text-primary-main font-pretendard-semibold text-base mt-0.5">
                                    가입승인을 기다리거나 단체를 생성하세요
                                </Text>
                            </View>
                        </>
                    )}
                </View>

                <View className="px-6 w-full space-y-3">
                    {isApproved ? (
                        <Pressable
                            onPress={handleGoHome}
                            className="w-full h-14 rounded-2xl items-center justify-center bg-primary-main hover:bg-primary-hover active:bg-primary-hover cursor-pointer">
                            <Text className="font-pretendard-bold text-lg text-white">
                                홈으로 이동
                            </Text>
                        </Pressable>
                    ) : (
                        <>
                            <Pressable
                                onPress={() => router.push("/organization/create")}
                                className="w-full h-14 rounded-2xl items-center justify-center bg-primary-main hover:bg-primary-hover active:bg-primary-hover cursor-pointer">
                                <Text className="font-pretendard-bold text-lg text-white">
                                    단체 생성
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => router.push("/organization/join")}
                                className="w-full h-14 rounded-2xl items-center justify-center border-2 border-primary-main bg-white hover:bg-primary-light active:bg-primary-light cursor-pointer mt-3">
                                <Text className="font-pretendard-bold text-lg text-primary-main">
                                    단체 가입
                                </Text>
                            </Pressable>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}
