import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";

import MainHeader from "@/components/layout/MainHeader";
import PasswordForm from "@/components/setting/PasswordForm";

function ManagerUpdatePasswordPage() {
    const router = useRouter();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className={"flex-1 bg-background-paper"}>
            <View className={"flex-1"}>
                <MainHeader
                    title={"비밀번호 변경"}
                    isBackPress
                    onBackPress={() => {
                        router.back();
                    }}
                />

                <PasswordForm onSuccess={() => router.back()} />
            </View>
        </KeyboardAvoidingView>
    );
}

export default ManagerUpdatePasswordPage;
