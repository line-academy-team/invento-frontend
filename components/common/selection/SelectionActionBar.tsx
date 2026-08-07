import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { twMerge } from "tailwind-merge";

// Props 타입 정의
interface SelectionActionBarProps {
    selectedCount: number;
    onComplete: (actionType: string) => void;
}

export default function SelectionActionBar({ selectedCount, onComplete }: SelectionActionBarProps) {
    const [actionType, setActionType] = useState<string>("승인");

    // 애니메이션 설정 (100이면 아래로 숨고, 0이면 원래 위치로 올라옴)
    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: selectedCount > 0 ? 0 : 100,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // 선택이 모두 해제되어 바가 내려가면 상태를 기본값(승인)으로 초기화
        if (selectedCount === 0) {
            setActionType("승인");
        }
    }, [selectedCount, slideAnim]);

    return (
        <Animated.View
            className={twMerge(
                "absolute w-full",
                "shadow-[0_-5px_20px_rgba(0,0,0,0.05)] shadow-black/10 elevation-[99]",
            )}
            style={{
                // 핵심: 푸터(탭바) 높이만큼 띄워서 푸터 바로 위에 얹혀지게 함
                // 기기나 설정에 따라 간격이 다를 경우 이 80이라는 숫자를 70~90 등으로 조절해 보세요.
                bottom: 10,
                transform: [{ translateY: slideAnim }],
            }}>
            {/* h-[140px]로 고정 높이를 주어 아래로 내려갔을 때 윗부분(손잡이)만 보이게 유지합니다 */}
            <View className={"bg-background-paper rounded-t-[32px] pt-4 pb-8 px-6 h-[140px]"}>
                {/* 상단 회색 손잡이 바 (항상 노출) */}
                <View className={"w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6"} />

                {/* 내부 콘텐츠 (체크된 항목이 있을 때만 노출) */}
                {selectedCount > 0 && (
                    <View className={"flex-row items-center justify-between"}>
                        <Text className={"text-lg font-pretendard-semibold text-text-main"}>
                            선택된 요청 ({selectedCount})
                        </Text>

                        <View className={"flex-row items-center"}>
                            {/* 승인/반려 토글 버튼 */}
                            <Pressable
                                onPress={() =>
                                    setActionType(prev => (prev === "승인" ? "반려" : "승인"))
                                }
                                className={twMerge(
                                    "rounded-full px-4 py-2 flex-row items-center mr-4",
                                    actionType === "승인" ? "bg-primary-main" : "bg-red-500",
                                )}>
                                <Text
                                    className={
                                        "text-white font-pretendard-semibold text-base mr-2"
                                    }>
                                    {actionType}
                                </Text>
                                <Text className={"text-white text-xs"}>⇄</Text>
                            </Pressable>

                            {/* 완료 버튼 */}
                            <Pressable onPress={() => onComplete(actionType)}>
                                <Text className={"text-lg font-pretendard-bold text-text-main"}>
                                    완료
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </View>
        </Animated.View>
    );
}
