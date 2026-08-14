import React, { useState, ReactNode } from "react";
import { Image, Pressable, Text, View, Modal, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUserStore } from "@/stores/user/useUserStore";

type HeaderVariant = "userMain" | "adminMain" | "managerMain" | "headerSub";

interface MainHeaderProps {
    variant?: HeaderVariant;
    title?: string;
    customTitle?: ReactNode;
    onMenuPress?: () => void;
    isBackPress?: boolean;
    onBackPress?: () => void;
}

function MainHeader({
    variant = "headerSub",
    title,
    customTitle,
    onMenuPress,
    isBackPress,
    onBackPress,
}: MainHeaderProps) {
    const isMain = variant === "userMain" || variant === "adminMain" || variant === "managerMain";
    const isAdmin = variant === "adminMain";
    const isManager = variant === "managerMain";

    const [isModalVisible, setModalVisible] = useState(false);

    const { logout } = useUserStore();

    const commonClassName =
        "w-full h-[88px] relative flex-row justify-between items-center px-[30px]";

    const handleMenuPress = () => {
        if (isAdmin || isManager) {
            setModalVisible(true);
        } else if (onMenuPress) {
            onMenuPress();
        }
    };

    const handleSwitchToUser = () => {
        setModalVisible(false);
        router.push("/user");
    };

    const handleLogout = () => {
        setModalVisible(false);
        logout();
        router.replace("/");
    };

    const renderModal = () => (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}>
            <TouchableOpacity
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                activeOpacity={1}
                onPress={() => setModalVisible(false)}>
                <View
                    className="bg-white rounded-2xl w-[75%] overflow-hidden"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        elevation: 5,
                    }}>
                    <TouchableOpacity
                        onPress={handleSwitchToUser}
                        className="p-5 border-b border-gray-100 active:bg-gray-50">
                        <Text className="text-center font-pretendard-bold text-lg text-text-default">
                            유저 페이지로 전환
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout} className="p-5 active:bg-gray-50">
                        <Text className="text-center font-pretendard-bold text-lg text-red-500">
                            로그아웃
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    const renderContent = () => {
        if (isMain) {
            return (
                <>
                    <View className="flex-row gap-2.5 items-center z-10">
                        <Image
                            source={require("@/assets/images/common/box.png")}
                            style={{ width: 36, height: 36 }}
                        />
                        <View>
                            <Text className="font-pretendard-bold text-2xl text-text-light">
                                {isAdmin ? "Invento Admin" : "Invento"}
                            </Text>
                            {isAdmin && (
                                <Text className="font-pretendard-bold text-sm text-text-light">
                                    {'"시스템 관리 센터"'}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Pressable onPress={handleMenuPress} className="z-10">
                        <Image
                            source={require("@/assets/images/common/menu.png")}
                            style={{ width: 28, height: 28 }}
                        />
                    </Pressable>
                </>
            );
        }

        return (
            <>
                <View className={"flex-row gap-2.5 items-center"}>
                    {isBackPress && (
                        <Pressable onPress={onBackPress ? onBackPress : () => router.back()}>
                            <Ionicons name={"chevron-back-outline"} size={24} />
                        </Pressable>
                    )}
                    <View className="z-10">
                        {customTitle ? (
                            customTitle
                        ) : (
                            <Text className="font-pretendard-bold text-2xl text-text-main">
                                {title}
                            </Text>
                        )}
                    </View>
                </View>
                {onMenuPress && (
                    <Pressable onPress={handleMenuPress} className="z-10">
                        <Image
                            source={require("@/assets/images/common/menu.png")}
                            style={{ width: 28, height: 28, tintColor: "black" }}
                        />
                    </Pressable>
                )}
            </>
        );
    };

    if (variant === "userMain" || variant === "managerMain") {
        return (
            <>
                <LinearGradient
                    colors={["#7C3AED", "#3B82F6"]}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{
                        height: 88,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 30,
                    }}>
                    <Svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 800 88"
                        preserveAspectRatio="none"
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}>
                        <Path
                            d="
                            M 0 0
                            L 550 0
                            C 580 0, 350 88, 245 88
                            L 0 90
                            Z
                        "
                            fill="rgba(255, 255, 255, 0.1)"
                        />
                    </Svg>
                    {renderContent()}
                </LinearGradient>
                {isManager && renderModal()}
            </>
        );
    }

    if (variant === "adminMain") {
        return (
            <>
                <View className={`${commonClassName} bg-primary-main`}>{renderContent()}</View>
                {renderModal()}
            </>
        );
    }

    return (
        <View
            className={`${commonClassName} bg-text-light`}
            style={
                !isBackPress
                    ? {
                          shadowColor: "#000000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.03,
                          shadowRadius: 10,
                          elevation: 3,
                      }
                    : undefined
            }>
            {renderContent()}
        </View>
    );
}

export default MainHeader;
