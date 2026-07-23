import React from "react";
import { View, Text, Pressable } from "react-native";

interface Props {
    onCreatePress?: () => void;
    onJoinPress?: () => void;
}

export default function OrganizationEmptyState({ onCreatePress, onJoinPress }: Props) {
    return (
        <View className="w-full items-center">
            <View className="w-full bg-background-paper p-6 rounded-2xl border border-divider items-center">
                <Text className="text-text-default text-lg font-bold text-center mb-6">
                    아직 가입한 단체가 없어요.
                </Text>

                <Text className="text-text-default text-base font-bold text-center mt-4">
                    {"단체를 생성하거나\n초대코드로 가입하세요."}
                </Text>
            </View>

            <View className="w-full gap-3 mt-6">
                <Pressable
                    onPress={onCreatePress}
                    className="bg-secondary-main hover:bg-secondary-hover py-4 rounded-xl items-center active:opacity-80"
                >
                    <Text className="text-white font-bold text-base">
                        단체 만들기
                    </Text>
                </Pressable>
                <Pressable
                    onPress={onJoinPress}
                    className="border border-secondary-main bg-background-paper hover:bg-primary-light py-4 rounded-xl items-center active:bg-gray-50"
                >
                    <Text className="text-secondary-main font-bold text-base">
                        단체 가입하기
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}