import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Image, Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/common/Button/Button";
import { twMerge } from "tailwind-merge";

function LandingPage() {
    const router = useRouter();
    const { role } = useLocalSearchParams<{ role?: string }>();

    const isAdmin = role === "admin";

    const handleLoginPress = () => {
        if (isAdmin) {
            router.push("/auth/login?role=admin");
        } else {
            router.push("/auth/login");
        }
    };

    const handleRole = () => {
        if (isAdmin) {
            router.setParams({ role: undefined });
        } else {
            router.setParams({ role: "admin" });
        }
    };

    return (
        <LinearGradient
            colors={isAdmin ? ["#7C3AED", "#7C3AED"] : ["#7C3AED", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
                flex: 1,
                alignItems: "center",
            }}>
            <Svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}>
                <Path d="M 100 0 L 10 0 Q 80 60, 100 65 Z" fill="rgba(255, 255, 255, 0.10)" />
            </Svg>
            <View className={"flex-row gap-2 items-center mt-[320px]"}>
                <Image
                    source={require("@/assets/images/common/box.png")}
                    style={{ width: 36, height: 44 }}
                />
                <Text className={"font-pretendard-bold text-4xl text-white"}>Invento</Text>
            </View>
            <hr className="h-[1px] w-[200px] mt-[10px]" />
            <Text className={"font-pretendard-semibold text-[14px] text-white mt-2"}>
                단체 비품을 스마트하게 관리하세요
            </Text>
            <View
                className={twMerge(
                    "flex-col items-center mt-[108px]",
                    isAdmin ? "gap-5" : "gap-7",
                )}>
                <Button
                    onPress={handleLoginPress}
                    className={twMerge(
                        "w-[128px] h-[36px] bg-[#FFFFFF50] border border-white",
                        !isAdmin && "hover:bg-secondary-hover",
                    )}
                    textClassName="text-lg">
                    로그인
                </Button>
                {isAdmin ? (
                    <Text className="font-pretendard text-[16px] text-text-light">
                        로그인이 필요한 서비스입니다.
                    </Text>
                ) : (
                    <View className="gap-7 items-center">
                        <Text className={"font-pretendard text-white text-lg"}>OR</Text>
                        <Button
                            onPress={() => router.push("/auth/register")}
                            className={twMerge(
                                "w-[128px] h-[36px] bg-[#FFFFFF50] border border-white",
                                !isAdmin && "hover:bg-secondary-hover",
                            )}
                            textClassName="text-lg">
                            회원가입
                        </Button>
                    </View>
                )}
            </View>
            <Pressable
                onPress={handleRole}
                className="mt-auto"
                style={{ cursor: "default" } as any}>
                <Text className={"text-white/50 text-[18px] font-pretendard-semibold mb-3"}>
                    © 2026 Invento
                </Text>
            </Pressable>
        </LinearGradient>
    );
}

export default LandingPage;
