import { StatusBar } from 'expo-status-bar';

import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router"

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <SafeAreaProvider>
        <StatusBar />
      <SafeAreaView>
        <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
