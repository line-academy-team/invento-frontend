import MainFooter from "@/components/layout/MainFooter";
import { Slot } from "expo-router";
import { View } from "react-native";

function AdminLayout() {
    return (
        <>
            <View className="flex-1">
                <Slot />
            </View>
            <MainFooter variant={"admin"} />
        </>
    );
}

export default AdminLayout;
