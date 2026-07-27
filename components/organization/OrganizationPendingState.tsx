import React from "react";
import { View, Text, Pressable, Image } from "react-native";
import { twMerge } from "tailwind-merge";
import { useUserStore } from "@/stores/user/useUserStore";

interface Props {
    onCreatePress?: () => void;
    onCancelPress?: () => void;
}

export default function OrganizationPendingState({ onCreatePress, onCancelPress }: Props) {
    const { authUser } = useUserStore();

    return (
        <View className={twMerge("w-full items-center")}>
            {/* 상단 승인 대기 안내 */}
            <Text className={twMerge("text-text-default text-lg font-pretendard font-bold text-center mt-2 mb-4")}>
                {`‘${authUser?.memberInfo?.organizationName || "Work"}’ 가입 승인 대기 중이에요.`}
            </Text>

            {/* 사람 아이콘 영역 */}
            <View className={twMerge("my-4 items-center justify-center")}>
                <Image
                    source={require("../../assets/images/Organization_Chart_People.png")}
                    style={{ width: 100, height: 100 }}
                    resizeMode="contain"
                />
            </View>

            {/* 가입 신청 취소 버튼 */}
            <Pressable
                onPress={onCancelPress}
                className={twMerge("border border-error-main px-5 py-2 rounded-full active:opacity-70 mb-6")}
            >
                <Text className={twMerge("text-error-main text-sm font-pretendard font-medium")}>
                    가입 신청 취소
                </Text>
            </Pressable>

            {/* 하단 안내 문구 (왼쪽 정렬) */}
            <View className={twMerge("w-full mb-6")}>
                <Text className={twMerge("text-text-default text-base font-pretendard font-bold text-left leading-6")}>
                    {"아직 가입된 단체가 없습니다.\n가입 승인을 기다리거나 단체를 만드세요."}
                </Text>
            </View>

            {/* 하단 버튼 영역 */}
            <View className={twMerge("w-full gap-3")}>
                {/* 단체 만들기 버튼 */}
                <Pressable
                    onPress={onCreatePress}
                    className={twMerge(
                        "bg-secondary-main hover:bg-secondary-hover py-4 rounded-xl items-center active:opacity-80 transition-colors"
                    )}
                >
                    <Text className={twMerge("text-white font-pretendard font-bold text-base")}>
                        단체 만들기
                    </Text>
                </Pressable>

                {/* 단체 가입하기 버튼 (신청 취소 안 했을 때: 회색 테두리 + 회색 글자 비활성화) */}
                <Pressable
                    disabled={true}
                    className={twMerge(
                        "border border-gray-300 bg-gray-100 py-4 rounded-xl items-center opacity-70"
                    )}
                >
                    <Text className={twMerge("text-gray-400 font-pretendard font-bold text-base")}>
                        단체 가입하기
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}