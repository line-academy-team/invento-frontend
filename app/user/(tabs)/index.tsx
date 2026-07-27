import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
function UserMainPage() {
    return (
        <>
            <View className="h-24 overflow-hidden">
                {/*<LinearGradient colors={["#8B4DEB", "#327FF0"]} className="absolute inset-0" />*/}

                {/*<View*/}
                {/*    style={{*/}
                {/*        position: "absolute",*/}
                {/*        width: 600,*/}
                {/*        height: 300,*/}
                {/*        top: -200,*/}
                {/*        left: -100,*/}
                {/*        borderRadius: 0,*/}
                {/*        backgroundColor: "rgba(70, 55, 190, 0.25)",*/}
                {/*        transform: [{ rotate: "-30deg" }],*/}
                {/*    }}*/}
                {/*/>*/}

                {/* 로고 */}
            </View>
            <>
                <Svg
                    width="100%"
                    height="100%"
                    style={{
                        position: "absolute",
                    }}>
                    <Path
                        d="
            M 0 0
            L 420 0
            C 360 40, 300 80, 245 100
            L 0 100
            Z
        "
                        fill="rgba(70, 55, 190, 0.25)"
                    />
                </Svg>
            </>
        </>
    );
}

export default UserMainPage;
