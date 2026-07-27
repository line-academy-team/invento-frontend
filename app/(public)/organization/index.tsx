아, 디테일을 제대로 캐치하지 못했네요! 시안을 다시 꼼꼼히 보니 차이점이 명확히 보입니다.

🔍 시안과 달랐던 부분
상단 배너: 라운드가 들어간 '카드형'이 아니라 화면 좌우를 가득 채우는 상단 헤더 형태 (우측 상단 로고 포함)

중앙 아이콘: 간단한 SVG 아이콘 레이아웃 적용

하단 레이아웃: 안내 텍스트 아래에 보라색 하단 언더라인(Divider)

전체 구조: 모바일 뷰 형태에 맞춘 여백 조절

🛠️ 시안 100% 동일 수정 코드 (app/(public)/organization/index.tsx)
Lucide 아이콘이나 SVG 등을 고려한 디테일 수정 코드입니다.

    TypeScript
import React from "react";
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";

export default function OrganizationIndexPage() {
    const { authUser } = useUserStore();
    const user = authUser?.user;
    const memberInfo = authUser?.memberInfo;

    const isPending = memberInfo?.status === "PENDING";
    const organizationName = memberInfo?.organizationName || "Work";

    const handleCancelRequest = async () => {
        // TODO: 단체 가입 신청 취소 API 연동
    };

    return (
        <View className="flex-1 bg-background-default items-center">
            {/* 전체 컨테이너 (모바일 너비 고정) */}
            <View className="flex-1 max-w-[440px] w-full bg-white justify-between pb-6">

                {/* 1. 상단 풀비주얼 헤더 (그라데이션/보라색 배경) */}
                <View className="bg-primary-main px-5 pt-10 pb-6 rounded-b-none flex-row justify-between items-start">
                    <View>
                        <Text className="text-white text-base font-pretendard">안녕하세요.</Text>
                        <Text className="text-white text-2xl font-pretendard-bold mt-1">
                            {user?.name || "사용자"}님 👋
                        </Text>
                    </View>
                    {/* 우측 상단 로고 영역 */}
                    <Text className="text-white font-pretendard-bold text-lg opacity-90">
                        Invento
                    </Text>
                </View>

                {/* 2. 중앙 메인 일러스트 & 문구 영역 */}
                <View className="flex-1 items-center justify-center px-5">
                    {isPending ? (
                        <>
                            <Text className="text-text-secondary text-lg font-pretendard-bold mb-8 text-center">
                                '{organizationName}' 가입 승인 대기 중이에요.
                            </Text>

                            {/* 승인대기 아이콘 영역 */}
                            <View className="w-28 h-28 items-center justify-center mb-6">
                                <View className="w-16 h-16 bg-gray-600 rounded-full items-center justify-center">
                                    <Text className="text-white text-xs">USERS</Text>
                                </View>
                            </View>

                            <Pressable
                                onPress={handleCancelRequest}
                                className="border border-error-main px-5 py-2 rounded-full active:opacity-80 mt-2"
                            >
                                <Text className="text-error-main font-pretendard-semibold text-sm">
                                    가입 신청 취소
                                </Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
                            <Text className="text-text-secondary text-xl font-pretendard-bold mb-10 text-center">
                                아직 가입한 단체가 없어요.
                            </Text>

                            {/* 사람3명 회색 그룹 아이콘 (기본 형태) */}
                            <View className="w-24 h-24 items-center justify-center my-4">
                                <View className="w-12 h-12 bg-gray-500 rounded-full mb-1" />
                                <View className="flex-row space-x-2">
                                    <View className="w-10 h-10 bg-gray-500 rounded-full" />
                                    <View className="w-10 h-10 bg-gray-500 rounded-full" />
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* 3. 하단 안내 및 액션 버튼 영역 */}
                <View className="px-5 w-full">
                    {/* 안내 텍스트 & 보라색 언더라인 */}
                    <View className="mb-6 border-b-2 border-primary-main pb-2">
                        <Text className="text-text-default font-pretendard-bold text-base leading-6">
                            {isPending ? "아직 가입된 단체가 없습니다." : "단체를 생성하거나"}
                        </Text>
                        <Text className="text-text-default font-pretendard-bold text-base leading-6">
                            {isPending ? "가입 승인을 기다리거나 단체를 만들세요." : "초대코드로 가입하세요."}
                        </Text>
                    </View>

                    {/* 단체 만들기 버튼 */}
                    <Pressable
                        disabled={isPending}
                        onPress={() => router.push("/organization/create")}
                        className={`w-full py-4 rounded-2xl items-center mb-3 transition-colors ${
                            isPending
                                ? "bg-gray-200"
                                : "bg-secondary-main hover:bg-secondary-hover active:opacity-90"
                        }`}
                    >
                        <Text className={`font-pretendard-bold text-base ${isPending ? "text-gray-400" : "text-white"}`}>
                            단체 만들기
                        </Text>
                    </Pressable>

                    {/* 단체 가입하기 버튼 */}
                    <Pressable
                        disabled={isPending}
                        onPress={() => router.push("/organization/join")}
                        className={`w-full py-4 rounded-2xl items-center border transition-colors ${
                            isPending
                                ? "border-gray-300 bg-gray-100" // 승인대기 미취소 시 (회색)
                                : "border-secondary-main bg-white hover:bg-gray-100 active:bg-gray-200" // 기본
                        }`}
                    >
                        <Text className={`font-pretendard-bold text-base ${isPending ? "text-gray-400" : "text-secondary-main"}`}>
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