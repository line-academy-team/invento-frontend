import { Image, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
function MainHeader() {
    return (
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
            <View className={"flex-row gap-2 items-center"}>
                <Image
                    source={require("@/assets/images/common/box.png")}
                    style={{ width: 36, height: 36 }}
                />
                <Text className={"font-pretendard-bold text-xl text-white"}>Invento</Text>
            </View>
            <Image
                source={require("@/assets/images/common/menu.png")}
                style={{ width: 28, height: 28 }}
            />
        </LinearGradient>
    );
}

export default MainHeader;
