import { useUserStore } from "@/stores/user/useUserStore";
import { useEffect, useState } from "react";
import adminApi from "@/api/admin/adminApi";
import { Alert, Platform } from "react-native";
import { User } from "@/types/user";

function AdminUserPage() {
    const { authUser } = useUserStore();
    const [userList, setUserList] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const user = authUser?.user;

    useEffect(() => {
        const loadOrgList = async () => {
            try {
                setIsLoading(true);
                const users = await adminApi.getUsers();
                setUserList(users);
            } catch (error) {
                console.log(error);
                const msg = "사용자 목록을 불러오는 데 실패했습니다.";
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

export default AdminUserPage;
