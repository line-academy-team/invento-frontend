import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";
import { LinearGradient } from "expo-linear-gradient";

export default function OrganizationIndexPage() {
    const { authUser } = useUserStore();
    const user = authUser?.user;

    return (
        <View className="flex-1 bg-background-default items-center">
            <View className="flex-1 w-full bg-white justify-between pb-6">
                {/* 📌 1. 피그마 스펙 적용 선형 그라데이션 헤더 */}
                <LinearGradient
                    colors={["#3B82F6", "#7C3AED"]}
                    locations={[0, 0.54]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    className="pr-3 pl-5 pt-4 pb-4 flex-row justify-between items-start w-full">
                    <View>
                        <Text className="text-white text-2xl font-pretendard-extrabold">
                            안녕하세요.
                        </Text>
                        <View className="flex-row items-center space-x-1.5 mt-1">
                            <Text className="text-white text-3xl font-pretendard-extrabold">
                                {user?.name || "사용자"}님
                            </Text>
                            <Image
                                source={require("@/assets/images/vector.png")}
                                style={{ width: 27, height: 19.48 }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    <View className="flex-row items-center space-x-1">
                        <Image
                            source={require("@/assets/images/common/box.png")}
                            style={{ width: 26, height: 26, tintColor: "#5B21B6" }}
                            resizeMode="contain"
                        />
                        <Text className="text-primary-active font-pretendard-extrabold text-2xl opacity-90">
                            Invento
                        </Text>
                    </View>
                </LinearGradient>

                {/* 📌 2. 중앙 내용 (가입 안 함 상태) */}
                <View className="flex-1 items-center justify-center px-5">
                    <Text className="text-text-secondary text-xl font-pretendard-bold mb-10 text-center">
                        아직 가입한 단체가 없어요.
                    </Text>
                    <Image
                        source={require("@/assets/images/Organization Chart People.png")}
                        style={{ width: 104, height: 107 }}
                        resizeMode="contain"
                    />
                </View>

                {/* 📌 3. 하단 안내문 및 액션 버튼 (Hover/Active 피드백 적용) */}
                <View className="px-5 w-full">
                    <View className="mb-6 border-b-2 border-primary-main pb-2">
                        <Text className="text-text-default font-pretendard-bold text-base leading-6">
                            단체를 생성하거나
                        </Text>
                        <Text className="text-text-default font-pretendard-bold text-base leading-6">
                            초대코드로 가입하세요.
                        </Text>
                    </View>

                    {/* 단체 만들기 버튼 */}
                    <Pressable
                        onPress={() => router.push("/organization/create")}
                        className="w-full py-4 rounded-2xl items-center mb-3 bg-secondary-main hover:bg-secondary-hover active:bg-secondary-hover cursor-pointer transition-colors duration-200">
                        <Text className="font-pretendard-bold text-base text-white">
                            단체 만들기
                        </Text>
                    </Pressable>

                    {/* 단체 가입하기 버튼 */}
                    <Pressable
                        onPress={() => router.push("/organization/join")}
                        className="w-full py-4 rounded-2xl items-center border border-secondary-main bg-white hover:bg-gray-100 active:bg-gray-200 cursor-pointer transition-colors duration-200">
                        <Text className="font-pretendard-bold text-base text-secondary-main">
                            단체 가입하기
                        </Text>
                    </Pressable>

                    {/* 푸터 */}
                    <Text className="text-secondary-main text-center text-xs mt-6">
                        © 2026 Invento
                    </Text>
                </View>
            </View>
        </View>
    );
}
