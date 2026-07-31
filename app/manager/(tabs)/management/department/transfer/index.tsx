import React from "react";
import { View, Text, ScrollView } from "react-native";
import MainHeader from "@/components/layout/MainHeader";

export default function DepartmentTransferPage() {
    return (
        <ScrollView className="flex-1 bg-background-deep">
            <MainHeader variant="headerSub" title="부서 이동" isBackPress />
            <View className="px-6 pt-6">
                <Text className="font-pretendard text-text-default">부서 이동 화면</Text>
            </View>
        </ScrollView>
    );
}
