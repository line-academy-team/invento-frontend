import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { twMerge } from "tailwind-merge";

interface Props {
    onCreatePress?: () => void;
    onJoinPress?: () => void;
}

export default function OrganizationEmptyState({ onCreatePress, onJoinPress }: Props) {
    return (
        <View className={twMerge("w-full items-center")}>
            {/* 상단 안내 문구 */}
            <Text className={twMerge("text-text-default text-lg font-pretendard font-bold text-center mt-4 mb-6")}>
                아직 가입한 단체가 없어요.
            </Text>

            {/* 사람 아이콘 영역 */}
            <View className={twMerge("my-6 items-center justify-center")}>
                <Image
                    source={require("../../assets/images/Organization_Chart_People.png")}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                />
            </View>

            {/* 하단 설명 문구 (왼쪽 정렬) */}
            <View className={twMerge("w-full mt-6 mb-8")}>
                <Text className={twMerge("text-text-default text-base font-pretendard font-bold text-left leading-6")}>
                    {"단체를 생성하거나\n초대코드로 가입하세요."}
                </Text>
            </View>

            {/* 하단 버튼 영역 */}
            <View className={twMerge("w-full gap-3")}>
                {/* 단체 만들기 버튼 (호버 시 bg-secondary-hover) */}
                <Pressable
                    onPress={onCreatePress}
                    className={twMerge(
                        "bg-secondary-main py-4 rounded-xl items-center active:opacity-80"
                    )}
                >
                    <Text className={twMerge("text-white font-pretendard font-bold text-base")}>
                        단체 만들기
                    </Text>
                </Pressable>

                // 단체 가입하기 버튼
                <Pressable
                    onPress={onJoinPress}
                    className={twMerge(
                        "border border-secondary-main bg-background-paper py-4 rounded-xl items-center active:bg-gray-100"
                    )}
                >
                    <Text className={twMerge("text-secondary-main font-pretendard font-bold text-base")}>
                        단체 가입하기
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}