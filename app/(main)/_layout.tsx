import React from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { twMerge } from "tailwind-merge";

export default function MainLayout() {
    return (
        <View className={twMerge("flex-1 bg-white")}>
            <Slot />
        </View>
    );
}