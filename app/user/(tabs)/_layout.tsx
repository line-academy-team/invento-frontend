import MainFooter from "@/components/layout/MainFooter";
import { Slot } from "expo-router";
import { View } from "react-native";

function UserLayout() {
    return (
        <>
            <View className="flex-1">
                <Slot />
            </View>
            <MainFooter variant={"user"} />
        </>
    );
}

export default UserLayout;
