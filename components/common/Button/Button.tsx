import React from "react";
import { GestureResponderEvent, Pressable, Text } from "react-native";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
    disabled?: boolean;
    isLoading?: boolean;
    onPress?: (event: GestureResponderEvent) => void;
    children: string;
    className?: string;
    textClassName?: string;
}

function Button({
    disabled = false,
    isLoading = false,
    onPress,
    children,
    className,
    textClassName,
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            className={twMerge(
                "w-full rounded-2xl items-center justify-center transition-colors duration-200",
                "bg-background-deep border-2 border-text-secondary cursor-not-allowed",
                !isDisabled &&
                    "bg-primary-main border-primary-main hover:bg-primary-hover active:bg-primary-hover cursor-pointer border-0",
                className,
            )}>
            <Text
                className={twMerge(
                    "font-pretendard-bold",
                    "text-text-secondary",
                    !isDisabled && "text-white",
                    textClassName,
                )}>
                {children}
            </Text>
        </Pressable>
    );
}

export default Button;
