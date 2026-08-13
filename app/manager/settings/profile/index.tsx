import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useRouter } from "expo-router";

import MainHeader from "@/components/layout/MainHeader";
import ProfileForm from "@/components/setting/ProfileForm";

function ManagerUpdateProfilePage() {
    const router = useRouter();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-background-paper">
            <View className="flex-1">
                <MainHeader
                    title="정보수정"
                    isBackPress
                    onBackPress={() => router.push("/manager/my")}
                />

                <ProfileForm onSuccess={() => router.push("/manager/my")} />
            </View>
        </KeyboardAvoidingView>
    );
}

export default ManagerUpdateProfilePage;
