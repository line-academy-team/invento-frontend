import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { useUserStore } from "@/stores/user/useUserStore";

export default function OrganizationCreatePage() {
    const { authUser } = useUserStore();
    const user = authUser?.user;
    const memberInfo = authUser?.memberInfo;
    const organizationName = memberInfo?.organizationName || "Work";

    const handleCancelRequest = async () => {
    };

    return (
        <View className="flex-1 bg-background-default items-center">
            <View className="flex-1 w-full bg-white justify-between pb-6">
                {/* 헤더 */}
                <View className="bg-primary-main pr-3 pl-5 flex-row justify-between items-start">
                    <View className="pt-4 pb-4">
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
                </View>

                <View className="flex-1 items-center justify-center px-5">
                    <Text className="text-text-secondary text-lg font-pretendard-bold mb-8 text-center">
                        '{organizationName}' 가입 승인 대기 중이에요.
                    </Text>

                    <Image
                        source={require("@/assets/images/Organization Chart People.png")}
                        style={{ width: 104, height: 107 }}
                        className="mb-4"
                        resizeMode="contain"
                    />

                    <Pressable
                        onPress={handleCancelRequest}
                        className="border border-error-main px-5 py-2 rounded-full active:opacity-80 mt-2">
                        <Text className="text-error-main font-pretendard-semibold text-sm">
                            가입 신청 취소
                        </Text>
                    </Pressable>
                </View>

                <View className="px-5 w-full">
                    <View className="mb-6 border-b-2 border-primary-main pb-2">
                        <Text className="text-text-default font-pretendard-bold text-base leading-6">
                            아직 가입된 단체가 없습니다.
                        </Text>
                        <Text className="text-text-default font-pretendard-bold text-base leading-6">
                            가입 승인을 기다리거나 단체를 만들세요.
                        </Text>
                    </View>

                    <Pressable
                        disabled={true}
                        className="w-full py-4 rounded-2xl items-center mb-3 bg-gray-200">
                        <Text className="font-pretendard-bold text-base text-gray-400">
                            단체 만들기
                        </Text>
                    </Pressable>

                    <Pressable
                        disabled={true}
                        className="w-full py-4 rounded-2xl items-center border border-gray-300 bg-gray-100">
                        <Text className="font-pretendard-bold text-base text-gray-400">
                            단체 가입하기
                        </Text>
                    </Pressable>

                    <Text className="text-secondary-main text-center text-xs mt-6">
                        © 2026 Invento
                    </Text>
                </View>
            </View>
        </View>
    );
}
