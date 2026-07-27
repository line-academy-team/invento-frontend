import MainHeader from "@/components/layout/MainHeader";
import MainFooter from "@/components/layout/MainFooter";
import { Slot } from "expo-router";
import { View } from "react-native";

function UserLayout() {
    return (
        <>
            <MainHeader />
            <View className="flex-1">
                <Slot />
            </View>
            <MainFooter variant={"manager"} />
        </>
    );
}

export default UserLayout;
