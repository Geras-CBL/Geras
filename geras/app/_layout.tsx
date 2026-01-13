import { Rubik_400Regular, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ImageBackground } from 'react-native';
import '../global.css';
import Header from '@/components/shared/Header';
import { FontProvider } from '@/components/FontContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/background.png')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <FontProvider>
          <StatusBar style="dark" />
          <BottomSheetModalProvider>
            <Stack
              initialRouteName="index"
              screenOptions={{
                animation: 'fade',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="index" options={{ headerShown: false }} />
              {/* senior */}
              <Stack.Screen
                name="navigation/senior/HomePage"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() => {}}
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />

              <Stack.Screen
                name="navigation/senior/RequestLoading"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() => {}}
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                      isWhite={false}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/Health"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/Settings"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() => {}}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/RequestHelp"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/Requests"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/Voice"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/Groceries"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/AddGrocerieList"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/senior/RequestDetails"
                options={{ headerShown: false }}
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
                  contentStyle: { backgroundColor: 'transparent' },
                  header: () => (
                    <Header
                      leftIconName="arrow-back"
                      rightIconName="notifications"
                      onLeftPress={() => {
                        router.back();
                      }}
                      onRightPress={() =>
                        router.push('../shared/Notifications')
                      }
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
                  contentStyle: { backgroundColor: 'transparent' },
                  header: () => (
                    <Header
                      leftIconName="arrow-back"
                      rightIconName="notifications"
                      onLeftPress={() => {
                        router.back();
                      }}
                      onRightPress={() =>
                        router.push('../caretaker/Notifications')
                      }
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="navigation/shared/EditProfile"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: 'transparent' },
                  header: () => (
                    <Header
                      leftIconName="arrow-back"
                      rightIconName="notifications"
                      onLeftPress={() => {
                        router.back();
                      }}
                      onRightPress={() =>
                        router.push('../caretaker/Notifications')
                      }
                    />
                  ),
                }}
              />
              {/* Shared */}
              <Stack.Screen
                name="navigation/shared/AddHealthMetric"
                options={{
                  headerShown: true,
                  headerTransparent: true,
                  contentStyle: { backgroundColor: '#fbfbfb' },
                  header: () => (
                    <Header
                      leftIconName="home"
                      rightIconName="settings"
                      onLeftPress={() =>
                        router.push('/navigation/senior/HomePage')
                      }
                      onRightPress={() =>
                        router.push('/navigation/senior/Settings')
                      }
                    />
                  ),
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </FontProvider>
      </ImageBackground>
    </GestureHandlerRootView>
  );
}
