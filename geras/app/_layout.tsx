import "../global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [loaded] = useFonts({
    Rubik: Rubik_400Regular,
    "Rubik-Bold": Rubik_700Bold,
    MonoTrustDisplay: require("../assets/fonts/MomoTrustDisplay-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="navigation" options={{ headerShown: false }} />
    </Stack>
  );
}
