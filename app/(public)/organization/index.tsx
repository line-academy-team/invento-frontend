import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";

export default function OrganizationIndexPage() {
    const { authUser } = useUserStore();
    const user = authUser?.user;
    const memberInfo = authUser?.memberInfo;

    const isPending = memberInfo?.status === "PENDING";
    const organizationName = memberInfo?.organizationName || "Work";

    const handleCancelRequest = async () => {
        // TODO: 가입 신청 취소 API 연동
    };

    return (
        <View className="flex-1 bg-background-default items-center">
            <View className="flex-1 w-full bg-background-default justify-between pb-8">
                {/* 1. 상단 타이틀 헤더 */}
                <View
                    className="bg-white h-[88px] pl-2 z-10 justify-center"
                    style={{
                        // iOS 그림자
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.05,
                        shadowRadius: 6,

                        // Android 그림자 (투명도 5% 수준에 맞춰 입체감 조정)
                        elevation: 2,

                        // Web 그림자 (피그마 Drop Shadow 속성 100% 동일)
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                    }}>
                    <Text className="text-2xl font-pretendard-bold text-text-default">
                        단체가입
                    </Text>
                </View>

                {/* 2. 중앙 내용 영역 */}
                <View className="flex-1 items-center justify-center px-6">
                    {/* 인사말 */}
                    <Text className="text-base font-pretendard-medium text-text-default mb-1">
                        안녕하세요
                    </Text>
                    <Text className="text-2xl font-pretendard-bold text-text-default mb-8">
                        {user?.name || "사용자"}님
                    </Text>

                    {/* 승인 대기 중 vs 가입 안 함 상태 분기 */}
                    {isPending ? (
                        <>
                            <Text className="text-text-secondary text-lg font-pretendard-medium mb-8 text-center">
                                '{organizationName}' 가입 승인 대기 중이에요
                            </Text>

                            <Image
                                source={require("@/assets/images/diversity_3 (1).png")}
                                style={{ width: 100, height: 100 }}
                                className="mb-6"
                                resizeMode="contain"
                            />

                            <Pressable
                                onPress={handleCancelRequest}
                                className="border border-error-main px-5 py-2 rounded-full active:opacity-80">
                                <Text className="text-error-main font-pretendard-semibold text-sm">
                                    가입 신청 취소
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Text className="text-text-secondary text-lg font-pretendard-medium mb-10 text-center">
                                아직 가입한 단체가 없어요
                            </Text>

                            <Image
                                source={require("@/assets/images/diversity_3 (1).png")}
                                style={{ width: 100, height: 100 }}
                                className="mb-10"
                                resizeMode="contain"
                            />

                            {/* 안내 문구 */}
                            <View className="items-center mb-8">
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

                {/* 3. 하단 액션 버튼 영역 */}
                <View className="px-6 w-full space-y-3">
                    {/* 단체 생성 버튼 */}
                    <Pressable
                        disabled={isPending}
                        onPress={() => router.push("/organization/create")}
                        className={`w-full h-14 rounded-2xl items-center justify-center transition-colors duration-200 ${
                            isPending
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-primary-main hover:bg-primary-hover active:bg-primary-hover cursor-pointer"
                        }`}>
                        <Text
                            className={`font-pretendard-bold text-lg ${
                                isPending ? "text-gray-400" : "text-white"
                            }`}>
                            단체 생성
                        </Text>
                    </Pressable>

                    {/* 단체 가입 버튼 */}
                    <Pressable
                        disabled={isPending}
                        onPress={() => router.push("/organization/join")}
                        className={`w-full h-14 rounded-2xl items-center justify-center border-2 transition-colors duration-200 mt-3 ${
                            isPending
                                ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                                : "border-primary-main bg-white hover:bg-primary-light active:bg-primary-light cursor-pointer"
                        }`}>
                        <Text
                            className={`font-pretendard-bold text-lg ${
                                isPending ? "text-gray-400" : "text-primary-main"
                            }`}>
                            단체 가입
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}
