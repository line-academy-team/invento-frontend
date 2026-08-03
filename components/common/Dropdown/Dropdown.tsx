import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { twMerge } from "tailwind-merge";
import { Ionicons } from "@expo/vector-icons";

interface DropdownProps {
    label?: string;
    options: string[];
    selectedValue: string;
    onSelect: (value: string) => void;
    placeholder?: string;
    className?: string;
}

function Dropdown({
    label,
    options,
    selectedValue,
    onSelect,
    placeholder = "선택해주세요",
    className,
}: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View className={twMerge("relative z-50", className)} style={{ zIndex: 50, elevation: 5 }}>
            {label && (
                <Text className="font-pretendard-bold text-base text-text-default mb-2">
                    {label}
                </Text>
            )}

            <Pressable
                onPress={() => setIsOpen(!isOpen)}
                className={twMerge(
                    "flex-row justify-between items-center w-full h-[54px] px-5",
                    "bg-white border-2 border-divider rounded-[16px]",
                )}>
                <Text
                    className={twMerge(
                        "font-pretendard-medium text-lg",
                        selectedValue ? "text-text-main" : "text-text-secondary",
                    )}>
                    {selectedValue || placeholder}
                </Text>

                <Ionicons
                    name={isOpen ? "chevron-up-outline" : "chevron-down-outline"}
                    size={20}
                    color="#111827"
                />
            </Pressable>

            {isOpen && (
                <View
                    className="absolute w-full bg-white border border-divider rounded-[16px] overflow-hidden shadow-sm"
                    style={{ top: label ? 85 : 60, zIndex: 100, elevation: 10, maxHeight: 220 }}>
                    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                        {options.map((option, index) => (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                                className={twMerge(
                                    "w-full px-5 py-4 border-b border-divider last:border-b-0 active:bg-background-default",
                                    selectedValue === option && "bg-primary-light",
                                )}>
                                <Text
                                    className={twMerge(
                                        "font-pretendard-medium text-lg",
                                        selectedValue === option
                                            ? "text-primary-main"
                                            : "text-text-default",
                                    )}>
                                    {option}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

export default Dropdown;
