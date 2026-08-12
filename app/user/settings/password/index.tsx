import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";

import MainHeader from "@/components/layout/MainHeader";
import PasswordForm from "@/components/setting/PasswordForm";

function UpdatePasswordPage() {
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
                        router.push("/user/my");
                    }}
                />

                <PasswordForm onSuccess={() => router.push("/user/my")} />
            </View>
        </KeyboardAvoidingView>
    );
}

export default UpdatePasswordPage;
