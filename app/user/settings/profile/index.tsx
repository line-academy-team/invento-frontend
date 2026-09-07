import { useRouter } from "expo-router";
import { View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import ProfileForm from "@/components/setting/ProfileForm";
import { useUserStore } from "@/stores/user/useUserStore";

export default function UpdateProfilePage() {
    const router = useRouter();
    const authUser = useUserStore(state => state.authUser);
    const user = authUser?.user;
    const userRoleLinkText = user?.role === "ADMIN" ? "/admin/my" : "/user/my";

    return (
        <View className="flex-1">
            <MainHeader title="정보수정" isBackPress onBackPress={() => router.push(`${userRoleLinkText}`)} />

            <ProfileForm onSuccess={() => router.push("/user/my")} />
        </View>
    );
}


