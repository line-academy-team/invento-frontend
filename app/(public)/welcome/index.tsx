import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/common/Button/Button";

function LandingPage() {
    const router = useRouter();
    return (
        <LinearGradient
            colors={["#7C3AED", "#3B82F6"]}
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
            <View className={"flex-col items-center mt-[108px] gap-7"}>
                <Button
                    onPress={() => router.push("/auth/login")}
                    className="w-[128px] h-[36px]"
                    textClassName="text-lg">
                    로그인
                </Button>
                <Text className={"font-pretendard text-white text-lg"}>OR</Text>
                <Button
                    onPress={() => router.push("/auth/register")}
                    className="w-[128px] h-[36px]"
                    textClassName="text-lg">
                    회원가입
                </Button>
            </View>
            <Text className={"mt-auto text-white/50 text-[18px] font-pretendard-semibold mb-3"}>
                © 2026 Invento
            </Text>
        </LinearGradient>
    );
}

export default LandingPage;
