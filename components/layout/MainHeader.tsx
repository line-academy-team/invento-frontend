import React, { ReactNode, useState } from "react";
import { Image, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
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

    const isUserMain = variant === "userMain";
    const isAdminMain = variant === "adminMain";
    const isManagerMain = variant === "managerMain";

    const [isModalVisible, setModalVisible] = useState(false);

    const { logout, authUser } = useUserStore();

    // 권한
    const memberRole = authUser?.memberInfo?.role;
    const isOwner = memberRole === "OWNER";
    const isManager = memberRole === "MANAGER";

    const canUserOpenMenu = isOwner || isManager;

    const commonClassName =
        "w-full h-[88px] relative flex-row justify-between items-center px-[30px]";

    // 메뉴
    const handleMenuPress = () => {
        if (isAdminMain || isManagerMain) {
            setModalVisible(true);
            return;
        }

        if (isUserMain && canUserOpenMenu) {
            setModalVisible(true);
            return;
        }

        if (onMenuPress) {
            onMenuPress();
        }
    };

    // 사용자 전환
    const handleSwitchToUser = () => {
        setModalVisible(false);

        if (authUser?.memberInfo) {
            router.push("/user");
        }
    };

    // 오너 전환
    const handleSwitchToOwner = () => {
        setModalVisible(false);
        router.push("/admin");
    };

    // 관리자 전환
    const handleSwitchToManager = () => {
        setModalVisible(false);
        router.push("/manager");
    };

    // 로그아웃
    const handleLogout = () => {
        setModalVisible(false);
        logout();
        router.replace("/");
    };

    // 모달
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
                    {/* 사용자 전환 */}
                    {(isAdminMain || isManagerMain) && (
                        <TouchableOpacity
                            onPress={handleSwitchToUser}
                            className="p-5 border-b border-gray-100 active:bg-gray-50">
                            <Text className="text-center font-pretendard-bold text-lg text-text-default">
                                유저 페이지로 전환
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* 오너 전환 */}
                    {isUserMain && isOwner && (
                        <TouchableOpacity
                            onPress={handleSwitchToOwner}
                            className="p-5 border-b border-gray-100 active:bg-gray-50">
                            <Text className="text-center font-pretendard-bold text-lg text-text-default">
                                오너 페이지로 전환
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* 관리자 전환 */}
                    {isUserMain && (isOwner || isManager) && (
                        <TouchableOpacity
                            onPress={handleSwitchToManager}
                            className="p-5 border-b border-gray-100 active:bg-gray-50">
                            <Text className="text-center font-pretendard-bold text-lg text-text-default">
                                관리자 페이지로 전환
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* 로그아웃 */}
                    <TouchableOpacity onPress={handleLogout} className="p-5 active:bg-gray-50">
                        <Text className="text-center font-pretendard-bold text-lg text-red-500">
                            로그아웃
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );

    // 헤더 내용
    const renderContent = () => {
        if (isMain) {
            return (
                <>
                    {/* 로고 */}
                    <View className="flex-row gap-2.5 items-center z-10">
                        <Image
                            source={require("@/assets/images/common/box.png")}
                            style={{ width: 36, height: 36 }}
                        />

                        <View>
                            <Text className="font-pretendard-bold text-2xl text-text-light">
                                {isAdminMain ? "Invento Admin" : "Invento"}
                            </Text>

                            {isAdminMain && (
                                <Text className="font-pretendard-bold text-sm text-text-light">
                                    {'"시스템 관리 센터"'}
                                </Text>
                            )}
                        </View>
                    </View>

                    {/* 메뉴 */}
                    {(isAdminMain || isManagerMain || (isUserMain && canUserOpenMenu)) && (
                        <Pressable onPress={handleMenuPress} className="z-10">
                            <Image
                                source={require("@/assets/images/common/menu.png")}
                                style={{ width: 28, height: 28 }}
                            />
                        </Pressable>
                    )}
                </>
            );
        }

        return (
            <>
                <View className="flex-row gap-2.5 items-center">
                    {/* 뒤로가기 */}
                    {isBackPress && (
                        <Pressable onPress={onBackPress ? onBackPress : () => router.back()}>
                            <Ionicons name="chevron-back-outline" size={24} />
                        </Pressable>
                    )}

                    {/* 제목 */}
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

                {/* 메뉴 */}
                {onMenuPress && (
                    <Pressable onPress={handleMenuPress} className="z-10">
                        <Image
                            source={require("@/assets/images/common/menu.png")}
                            style={{
                                width: 28,
                                height: 28,
                                tintColor: "black",
                            }}
                        />
                    </Pressable>
                )}
            </>
        );
    };

    // 사용자 / 관리자 메인
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

                {(isManagerMain || (isUserMain && canUserOpenMenu)) && renderModal()}
            </>
        );
    }

    // 앱 관리자 메인
    if (variant === "adminMain") {
        return (
            <>
                <View className={`${commonClassName} bg-primary-main`}>{renderContent()}</View>

                {renderModal()}
            </>
        );
    }

    // 서브 헤더
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
