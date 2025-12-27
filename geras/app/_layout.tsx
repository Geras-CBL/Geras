import { Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ImageBackground } from "react-native";
import "../global.css";
import { VolunteerHeader } from "./navigation/volunteer/VolunteerHeader";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
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
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar style="dark" />
      <Stack
        initialRouteName="index"
        screenOptions={{
          animation: "fade",
          contentStyle: { backgroundColor: "" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="senior/HomePage" options={{ headerShown: false }} />
        <Stack.Screen
          name="navigation/volunteer"
          options={{
            headerShown: true,
            headerTransparent: true,
            header: () => (
              <VolunteerHeader
                leftIconName="arrow-back"
                rightIconName="notifications"
                onLeftPress={() => {
                  router.back();
                }}
                onRightPress={() => router.push("../shared/Notifications")}
              />
            ),
          }}
        />
        <Stack.Screen
          name="navigation/caretaker"
          options={{
            headerShown: true,
            headerTransparent: true,
            header: () => (
              <VolunteerHeader
                leftIconName="arrow-back"
                rightIconName="notifications"
                onLeftPress={() => {
                  router.back();
                }}
                onRightPress={() => router.push("../shared/Notifications")}
              />
            ),
          }}
        />
      </Stack>
    </ImageBackground>
  );
}
