import { Alert, Platform, ScrollView, View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Equipment } from "@/types/equipment";
import { OrgRental } from "@/types/rental";
import managerRentalApi from "@/api/manager/managerRentalApi";
import { useUserStore } from "@/stores/user/useUserStore";
import memberEquipmentApi from "@/api/member/memberEquipmentApi";

function ManagerMainPage() {
    const router = useRouter();
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [rentalList, setRentalList] = useState<OrgRental[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { authUser } = useUserStore();

    const ozId = Number(authUser?.memberInfo?.id);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setIsLoading(true);
                const orgRentalList = await managerRentalApi.getOrgRentalRequestList(ozId);
                setRentalList(orgRentalList);
                const orgEquipmentList = await memberEquipmentApi.getEquipmentList();
                setEquipmentList(orgEquipmentList);
            } catch (error) {
                console.log(error);
                const msg = "조직 내 대여, 장비 목록을 불러오는데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                } else {
                    Alert.alert("오류", msg);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard().then(() => {});
    }, []);

    return (
        <ScrollView>
            <MainHeader variant={"userMain"} onMenuPress={() => {}} />
            <View className="flex-1 w-full">
                
            </View>

        </ScrollView>
    );
}

export default ManagerMainPage;
