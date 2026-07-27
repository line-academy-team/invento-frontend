import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { LogBox, Platform } from "react-native"; // 👈 LogBox, Platform 임포트

import "../styles/global.css";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
    anchor: "(main)",
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "Pretendard-Regular": require("../assets/fonts/Pretendard-Regular.otf"),
        "Pretendard-SemiBold": require("../assets/fonts/Pretendard-SemiBold.otf"),
        "Pretendard-Bold": require("../assets/fonts/Pretendard-Bold.otf"),
    });

    useEffect(() => {
        // 👈 웹 환경에서만 안전하게 실행되도록 useEffect 내부 배치
        if (Platform.OS === "web") {
            LogBox.ignoreAllLogs();
        }

        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <StatusBar style="auto" />
            <SafeAreaView style={{ flex: 1 }}>
                <Slot />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}