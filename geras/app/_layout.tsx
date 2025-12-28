import { Rubik_400Regular, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ImageBackground } from 'react-native';
import '../global.css';
import Header from '@/components/shared/Header';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    Rubik: Rubik_400Regular,
    'Rubik-Bold': Rubik_700Bold,
    MonoTrustDisplay: require('../assets/fonts/MomoTrustDisplay-Regular.ttf'),
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
      source={require('../assets/images/background.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <StatusBar style="dark" />
      <Stack
        initialRouteName="index"
        screenOptions={{
          animation: 'fade',
          contentStyle: { backgroundColor: '#fbfbfb' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        {/* senior */}
        <Stack.Screen
          name="navigation/senior/HomePage"
          options={{
            headerShown: true,
            headerTransparent: true,
            header: () => (
              <Header
                leftIconName="home"
                rightIconName="settings"
                onLeftPress={() => {}}
                onRightPress={() => {}}
              />
            ),
          }}
        />
        <Stack.Screen
          name="navigation/senior/Health"
          options={{
            headerShown: true,
            headerTransparent: true,
            header: () => (
              <Header
                leftIconName="home"
                rightIconName="settings"
                onLeftPress={() => {}}
                onRightPress={() => {}}
              />
            ),
          }}
        />
        <Stack.Screen
          name="navigation/senior/ErrorPage"
          options={{ headerShown: false }}
        />
        {/* volunteer */}
        <Stack.Screen
          name="navigation/volunteer"
          options={{
            headerShown: true,
            headerTransparent: true,
            header: () => (
              <Header
                leftIconName="arrow-back"
                rightIconName="notifications"
                onLeftPress={() => {
                  router.back();
                }}
                onRightPress={() => router.push('../shared/Notifications')}
              />
            ),
          }}
        />
        {/* caretaker */}
        <Stack.Screen
          name="navigation/caretaker"
          options={{
            headerShown: true,
            headerTransparent: true,
            header: () => (
              <Header
                leftIconName="arrow-back"
                rightIconName="notifications"
                onLeftPress={() => {
                  router.back();
                }}
                onRightPress={() => router.push('../shared/Notifications')}
              />
            ),
          }}
        />
      </Stack>
    </ImageBackground>
  );
}
