import { Image, ScrollView, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter } from "expo-router";

function ManagerEquipmentDetailPage() {
    const router = useRouter();

    const mockData = {
        imageURL: "",
    };
    return (
        <ScrollView>
            <MainHeader
                title={"장비 상세"}
                isBackPress
                onBackPress={() => {
                    router.navigate("/manager/equipment");
                }}
            />
            <View className={"px-[30px] py-8"}>
                <View className={"h-[200px] w-full rounded-[16px] bg-background-default"}></View>
            </View>
        </ScrollView>
    );
}
export default ManagerEquipmentDetailPage;
