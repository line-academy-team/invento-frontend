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
    variant?: "solid" | "outline";
}

function Button({
    disabled = false,
    isLoading = false,
    onPress,
    children,
    className,
    textClassName,
    variant = "solid",
}: ButtonProps) {
    const isDisabled = disabled || isLoading;

    const buttonStyle =
        variant === "solid"
            ? isDisabled
                ? "bg-background-deep border-2 border-text-secondary cursor-not-allowed"
                : "bg-primary-main border-primary-main border-0 hover:bg-primary-hover active:bg-primary-hover cursor-pointer"
            : isDisabled
              ? "bg-transparent border-2 border-text-secondary cursor-not-allowed"
              : "bg-transparent border-2 border-primary-main hover:border-primary-hover active:border-primary-hover cursor-pointer";

    const textStyle =
        variant === "solid"
            ? isDisabled
                ? "text-text-secondary"
                : "text-white"
            : isDisabled
              ? "text-text-secondary"
              : "text-primary-main hover:text-primary-hover active:text-primary-hover";

    return (
        <Pressable
            disabled={isDisabled}
            onPress={onPress}
            className={twMerge(
                "w-full rounded-2xl items-center justify-center transition-colors duration-200",
                !isDisabled && buttonStyle,
                className,
                isDisabled && buttonStyle,
            )}>
            <Text
                className={twMerge(
                    "font-pretendard-bold",
                    !isDisabled && textStyle,
                    textClassName,
                    isDisabled && textStyle,
                )}>
                {isLoading ? "처리 중..." : children}
            </Text>
        </Pressable>
    );
}

export default Button;
