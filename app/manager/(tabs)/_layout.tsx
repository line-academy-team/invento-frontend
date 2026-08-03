import MainFooter from "@/components/layout/MainFooter";
import { Slot } from "expo-router";
import { View } from "react-native";

export default function ManagerLayout() {
    return (
        <View className="flex-1">
            <View className="flex-1">
                <Slot />
            </View>
            <MainFooter variant="manager" />
        </View>
    );
}
