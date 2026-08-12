import { useRouter } from "expo-router";
import { View } from "react-native";
import MainHeader from "@/components/layout/MainHeader";
import ProfileForm from "@/components/setting/ProfileForm";


export default function UpdateProfilePage() {
    const router = useRouter();

    return (
        <View className="flex-1">

            <MainHeader title="정보수정" isBackPress onBackPress={() => router.push("/user/my")} />

            <ProfileForm onSuccess={() => router.push("/user/my")} />
        </View>
    );
}


