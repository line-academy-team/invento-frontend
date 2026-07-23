import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Slot, SplashScreen} from "expo-router"
import {useFonts} from "expo-font";
import {useEffect} from "react";

export const unstable_settings = {
  anchor: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const [loaded, error] = useFonts({
        'Pretendard-Regular': require('pretendard/dist/web/static/woff2/Pretendard-Regular.woff2'),
        'Pretendard-SemiBold': require('pretendard/dist/web/static/woff2/Pretendard-SemiBold.woff2'),
        'Pretendard-Bold': require('pretendard/dist/web/static/woff2/Pretendard-Bold.woff2'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error])

    if (!loaded && !error) {
        return null;
    }

  return (
    <SafeAreaProvider>
        <StatusBar />
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
