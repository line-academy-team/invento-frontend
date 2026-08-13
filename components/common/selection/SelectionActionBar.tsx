import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { twMerge } from "tailwind-merge";

interface SelectionActionBarProps {
    selectedCount: number;
    onComplete: (actionType: string) => void;
}

export default function SelectionActionBar({ selectedCount, onComplete }: SelectionActionBarProps) {
    const [actionType, setActionType] = useState<string>("승인");

    const slideAnim = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: selectedCount > 0 ? 0 : 100,
            duration: 300,
            useNativeDriver: true,
        }).start();

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
                bottom: 10,
                transform: [{ translateY: slideAnim }],
            }}>
            <View className={"bg-background-paper rounded-t-[32px] pt-4 pb-8 px-6 h-[140px]"}>
                <View className={"w-12 h-1.5 bg-gray-300 rounded-full self-center mb-6"} />

                {selectedCount > 0 && (
                    <View className={"flex-row items-center justify-between"}>
                        <Text className={"text-lg font-pretendard-semibold text-text-main"}>
                            선택된 요청 ({selectedCount})
                        </Text>

                        <View className={"flex-row items-center"}>
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
