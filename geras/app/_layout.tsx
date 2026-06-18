import { Rubik_400Regular, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { useFonts } from 'expo-font';
import { Stack, router, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ImageBackground, Alert } from 'react-native';
import '../global.css';
import Header from '@/components/shared/Header';
import { FontProvider } from '@/components/FontContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProfileProvider } from '@/context/ProfileContext';
import { AuthProvider } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationsProvider } from '@/context/NotificationsContext';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Rubik: Rubik_400Regular,
    'Rubik-Bold': Rubik_700Bold,
    MonoTrustDisplay: require('../assets/fonts/MomoTrustDisplay-Regular.ttf'),
  });
  const pathname = usePathname();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleLogout = () => {
    Alert.alert(
      'Terminar Sessão',
      'Tem a certeza que pretende terminar a sessão?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/');
          },
        },
      ],
    );
  };

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ProfileProvider>
          <NotificationsProvider>
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
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() => {}}
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() => {}}
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            isWhite={false}
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() => {}}
                            onLogoutPress={handleLogout}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="navigation/senior/EmergencyCall"
                      options={{
                        headerShown: true,
                        headerTransparent: true,
                        contentStyle: { backgroundColor: '#fbfbfb' },
                        header: () => (
                          <Header
                            leftIconName="home"
                            rightIconName="settings"
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="navigation/senior/CaretakerCall"
                      options={{
                        headerShown: true,
                        headerTransparent: true,
                        contentStyle: { backgroundColor: '#fbfbfb' },
                        header: () => (
                          <Header
                            leftIconName="home"
                            rightIconName="settings"
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="navigation/senior/RequestDetails"
                      options={{
                        headerShown: true,
                        headerTransparent: true,
                        contentStyle: { backgroundColor: '#fbfbfb' },
                        header: () => (
                          <Header
                            leftIconName="home"
                            rightIconName="settings"
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
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
                        contentStyle: { backgroundColor: 'transparent' },
                        header: () => (
                          <Header
                            leftIconName="arrow-back"
                            rightIconName="notifications"
                            leftIconLabel="Voltar"
                            rightIconLabel="Notificações"
                            onLeftPress={() => {
                              router.back();
                            }}
                            showNotificationsOnLeft={true}
                            showProfileOnRight={true}
                            onProfilePress={() => {
                              router.push('/navigation/shared/Profile');
                            }}
                            onRightPress={() =>
                              router.push('/navigation/volunteer/Notifications')
                            }
                            onLogoutPress={handleLogout}
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
                            showLeftIcon={false}
                            rightIconName="notifications"
                            rightIconLabel="Notificações"
                            onRightPress={() =>
                              router.push('/navigation/caretaker/Notifications')
                            }
                            onLogoutPress={handleLogout}
                          />
                        ),
                      }}
                    />
                    {/* caretaker Notifications */}
                    <Stack.Screen
                      name="navigation/caretaker/Notifications"
                      options={{
                        headerShown: true,
                        headerTransparent: true,
                        contentStyle: { backgroundColor: 'transparent' },
                        header: () => (
                          <Header
                            leftIconName="arrow-back"
                            leftIconLabel="Voltar"
                            onLeftPress={() => router.back()}
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Voltar"
                            rightIconLabel="Notificações"
                            onLeftPress={() => {
                              router.back();
                            }}
                            onRightPress={() =>
                              router.push('../caretaker/Notifications')
                            }
                            onLogoutPress={handleLogout}
                          />
                        ),
                      }}
                    />
                    <Stack.Screen
                      name="navigation/shared/Profile"
                      options={{
                        headerShown: true,
                        headerTransparent: true,
                        contentStyle: { backgroundColor: 'transparent' },
                        header: () => (
                          <Header
                            leftIconName="arrow-back"
                            rightIconName="notifications"
                            leftIconLabel="Voltar"
                            rightIconLabel="Notificações"
                            onLeftPress={() => {
                              router.back();
                            }}
                            onRightPress={() =>
                              router.push('/navigation/volunteer/Notifications')
                            }
                            onLogoutPress={handleLogout}
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
                            leftIconLabel="Ir para a página inicial"
                            rightIconLabel="Abrir definições"
                            onLeftPress={() =>
                              router.push('/navigation/senior/HomePage')
                            }
                            onRightPress={() =>
                              router.push('/navigation/senior/Settings')
                            }
                            onLogoutPress={handleLogout}
                          />
                        ),
                      }}
                    />

                    <Stack.Screen
                      name="navigation/shared/CompleteProfilePage"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                </BottomSheetModalProvider>
              </FontProvider>
            </ImageBackground>
          </NotificationsProvider>
        </ProfileProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
