import "../global.css";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

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
    <>
      <StatusBar style="dark" />
      <Stack
        initialRouteName="screens/index" 
        screenOptions={{
          animation: "fade",
        }}
      >
        <Stack.Screen name="screens/index" options={{ headerShown: false }} />
        <Stack.Screen name="navigation" options={{ headerShown: false }} />
        {/* fazer o ecrã do not found aqui 404 */}
      </Stack>
    </>
  );
}
