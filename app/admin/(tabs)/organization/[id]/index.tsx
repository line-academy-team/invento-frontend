import { useUserStore } from "@/stores/user/useUserStore";
import { useEffect, useState } from "react";
import { Organization } from "@/types/organization";
import adminApi from "@/api/admin/adminApi";
import { Alert, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

function AdminOrganizationDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const orgId = Number(id);
    const { authUser } = useUserStore();
    const [org, setOrg] = useState<Organization | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const user = authUser?.user;

    useEffect(() => {
        if (!orgId) return;
        const loadOrgList = async () => {
            try {
                setIsLoading(true);
                const organization = await adminApi.getOrganizationById(orgId);
                setOrg(organization);
            } catch (error) {
                console.log(error);
                const msg = "조직 정보를 불러오는 데 실패했습니다.";
                if (Platform.OS === "web") {
                    alert(msg);
                } else {
                    Alert.alert("오류", msg);
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadOrgList().then(() => {});
    }, []);
}

export default AdminOrganizationDetailPage;
