import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import { Slider } from '@miblanchard/react-native-slider';
import { Checkbox } from '@futurejj/react-native-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/shared/Button';
import { Stack, useRouter } from 'expo-router';
import { Svg, G, Path, Defs, ClipPath } from 'react-native-svg';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignInPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [actionRadius, setActionRadius] = useState(5);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [role, setRole] = useState<'SENIOR' | 'CARETAKER' | 'VOLUNTEER'>(
    'SENIOR',
  );
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !gender || !city) {
      Alert.alert('Erro', 'Por favor preencha todos os campos obrigatórios.');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Erro', 'Tem de aceitar os termos e condições.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As palavras-passe não coincidem.');
      return;
    }

    if (role === 'SENIOR' && (!address || !postalCode)) {
      Alert.alert('Erro', 'Por favor preencha a morada e código postal.');
      return;
    }

    setLoading(true);

    const userMetadata: any = {
      name,
      role,
      gender,
    };

    if (role === 'SENIOR') {
      userMetadata.address = address;
      userMetadata.postal_code = postalCode;
    } else if (role === 'VOLUNTEER') {
      userMetadata.action_radius = Number(actionRadius);
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
      },
    });

    if (data?.user) {
      // O trigger da base de dados pode não estar a copiar estes campos novos,
      // por isso fazemos um update explícito à tabela 'users'
      let genderEnum = gender.toUpperCase();
      if (genderEnum === 'MASCULINO') genderEnum = 'MALE';
      if (genderEnum === 'FEMININO') genderEnum = 'FEMALE';

      const updateData: any = {
        gender: genderEnum,
        local: city,
      };

      if (role === 'SENIOR') {
        updateData.address = address;
        updateData.zip_code = postalCode;
      } else if (role === 'VOLUNTEER') {
        updateData.action_radius = actionRadius;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update(updateData)
        .eq('auth_user_id', data.user.id);

      if (updateError) {
        console.error('Erro ao atualizar campos extras:', updateError);
      }
    }

    setLoading(false);

    if (error) {
      Alert.alert('Erro de Registo', error.message);
    } else {
      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso! Pode agora fazer login.',
      );
      router.replace('/navigation/shared/LoginPage');
    }
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#6b8548', '#205b2d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
          headerTransparent: true,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingVertical: 24,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View className="mb-6 items-center">
            <Svg width={80} height={111} viewBox="0 0 117 163" fill="none">
              <G clipPath="url(#clip0_447_3217)" fill="#FCFCFB">
                <Path d="M58.08 37.96c10.483 0 18.98-8.498 18.98-18.98C77.06 8.498 68.562 0 58.08 0 47.598 0 39.1 8.498 39.1 18.98c0 10.482 8.498 18.98 18.98 18.98z" />
                <Path d="M66.57 108.96C63.43 92.95 91.14 80.84 88.01 69.4 85.43 59.98 64.9 61.81 63.32 53c-1.33-7.42 12.9-10.49 17.79-25.45 4.26-13.06-2.62-22.8 1.56-25.51 4.46-2.89 17.09 5.06 24.59 15.68 14.03 19.86 9.58 48.3 0 67.01-9.14 17.84-27.38 35.46-35.92 31.72-3.61-1.58-4.59-6.59-4.77-7.48v-.01zM49.62 108.96c3.14-16.01-24.57-28.12-21.44-39.56 2.58-9.42 23.11-7.59 24.69-16.4 1.33-7.42-12.9-10.49-17.79-25.45-4.26-13.06 2.62-22.8-1.56-25.51C29.06-.85 16.43 7.1 8.93 17.72c-14.03 19.86-9.58 48.3 0 67.01 9.14 17.84 27.38 35.46 35.92 31.72 3.61-1.58 4.59-6.59 4.77-7.48v-.01zM19.86 162.1c-2.03 0-3.79-.47-5.27-1.41-1.49-.94-2.63-2.27-3.42-3.98-.79-1.72-1.19-3.76-1.19-6.13s.4-4.42 1.19-6.14c.79-1.73 1.92-3.07 3.38-4.01 1.46-.95 3.16-1.42 5.12-1.42 1.72 0 3.23.35 4.55 1.05 1.32.7 2.35 1.66 3.09 2.89.74 1.22 1.11 2.63 1.11 4.21h-4.98c-.07-1.05-.45-1.9-1.14-2.58-.68-.67-1.56-1.01-2.63-1.01-1.49 0-2.65.63-3.47 1.88-.82 1.25-1.23 2.94-1.23 5.05s.43 3.92 1.3 5.18c.87 1.26 2.07 1.9 3.6 1.9 1.02 0 1.87-.32 2.56-.96.69-.64 1.16-1.64 1.4-3.01h-3.82v-4.24h5.04c1.37 0 2.34.34 2.93 1.01.59.67.89 1.62.89 2.84 0 .91-.16 1.88-.47 2.9-.31 1.03-.82 1.99-1.52 2.9-.7.91-1.63 1.65-2.78 2.22-1.15.57-2.56.86-4.22.86h-.02zM32.18 161.66v-22.21H46.3v4.47H37v4.18h8.72v4.29H37v4.8h9.3v4.47H32.18zM49.7 161.66v-22.21h8.25c2.58 0 4.57.56 5.95 1.67 1.38 1.12 2.08 2.71 2.08 4.78 0 1.22-.3 2.29-.91 3.2-.61.91-1.48 1.61-2.6 2.1 1.27.43 2.13 1.08 2.57 1.94.44.86.66 1.95.66 3.27v5.24h-4.76v-4.71c0-2.27-1-3.41-2.99-3.41h-3.43v8.11H49.7v.02zm4.82-12.47h3.43c.98 0 1.73-.24 2.26-.73.53-.48.79-1.17.79-2.06 0-.81-.26-1.44-.79-1.88-.53-.44-1.28-.67-2.26-.67h-3.43v5.34zM67.97 161.66l5.98-18.12c.31-.97.63-1.79.95-2.46.32-.67.73-1.18 1.22-1.54.49-.36 1.12-.53 1.9-.53.78 0 1.44.18 1.94.53.5.36.92.86 1.26 1.53.34.66.66 1.47.95 2.41l5.81 18.18h-4.93l-1.36-4.71h-7.45l-1.41 4.71h-4.87.01zm10-16.94l-2.38 7.85h4.82l-2.27-7.85c-.02-.08-.05-.12-.08-.12s-.07.04-.08.12h-.01zM98.06 162.1c-1.62 0-3.1-.3-4.42-.89-1.32-.59-2.37-1.46-3.16-2.59-.78-1.14-1.18-2.53-1.18-4.19h4.93c.09 1.11.48 1.93 1.16 2.46.68.53 1.53.8 2.55.8 1.02 0 1.82-.19 2.46-.56.65-.37.97-.9.97-1.57 0-.57-.19-1-.58-1.27-.39-.28-.98-.54-1.77-.8l-4.43-1.39c-.87-.28-1.69-.63-2.46-1.05a4.94 4.94 0 01-1.87-1.76c-.47-.75-.71-1.77-.71-3.05 0-1.48.33-2.76 1-3.84.66-1.08 1.61-1.91 2.82-2.5 1.22-.59 2.65-.89 4.29-.89 2.38 0 4.31.62 5.8 1.87 1.49 1.24 2.34 3.01 2.56 5.3h-4.98c-.39-1.88-1.58-2.81-3.57-2.81-.96 0-1.69.2-2.2.59-.51.4-.76.93-.76 1.6 0 .49.16.91.47 1.24.31.34.81.61 1.49.83l4.62 1.48c1.77.55 3.06 1.31 3.88 2.28.81.97 1.22 2.23 1.22 3.79 0 1.38-.34 2.59-1.01 3.63-.67 1.04-1.62 1.85-2.84 2.43-1.22.58-2.65.87-4.29.87l.01-.01z" />
              </G>
              <Defs>
                <ClipPath id="clip0_447_3217">
                  <Path fill="#fff" d="M0 0H116.18V162.1H0z" />
                </ClipPath>
              </Defs>
            </Svg>
          </View>

          <ThemedText type="title" className="px-8 text-left text-neutralLight">
            Crie a sua conta
          </ThemedText>

          {/* Inputs */}
          <View className="mb-6 mt-6 w-full items-center">
            <View className="w-full gap-y-4 px-8">
              <TextInput
                className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                placeholder="Nome"
                placeholderTextColor="#fbfbfb"
                value={name}
                onChangeText={setName}
              />

              <TextInput
                className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                placeholder="E-mail"
                placeholderTextColor="#fbfbfb"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                placeholder="Palavra-Passe"
                placeholderTextColor="#fbfbfb"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TextInput
                className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                placeholder="Confirmar Palavra-Passe"
                placeholderTextColor="#fbfbfb"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <TextInput
                className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                placeholder="Género"
                placeholderTextColor="#fbfbfb"
                value={gender}
                onChangeText={setGender}
              />

              <TextInput
                className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                placeholder="Cidade"
                placeholderTextColor="#fbfbfb"
                value={city}
                onChangeText={setCity}
              />

              {role === 'SENIOR' && (
                <>
                  <TextInput
                    className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                    placeholder="Morada"
                    placeholderTextColor="#fbfbfb"
                    value={address}
                    onChangeText={setAddress}
                  />
                  <TextInput
                    className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
                    placeholder="Código Postal"
                    placeholderTextColor="#fbfbfb"
                    value={postalCode}
                    onChangeText={setPostalCode}
                  />
                </>
              )}

              {role === 'VOLUNTEER' && (
                <View className="w-full">
                  <Text className="mb-2 px-4 text-base font-bold text-neutralLight">
                    Distância de Ação: {actionRadius} km
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 40,
                      justifyContent: 'center',
                    }}
                  >
                    <Slider
                      minimumValue={0}
                      maximumValue={20}
                      step={1}
                      value={actionRadius}
                      onValueChange={(val) =>
                        setActionRadius(Array.isArray(val) ? val[0] : val)
                      }
                      minimumTrackTintColor="#325439"
                      maximumTrackTintColor="#fbfbfb"
                      thumbTintColor="#325439"
                    />
                  </View>
                </View>
              )}

              <View className="mt-2 w-full flex-row justify-between">
                <TouchableOpacity
                  className={`mx-1 flex-1 items-center rounded-full p-2 ${role === 'SENIOR' ? 'bg-[#325439]' : 'bg-neutralLight/40'}`}
                  onPress={() => setRole('SENIOR')}
                >
                  <Text className="font-bold text-white">Sénior</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`mx-1 flex-1 items-center rounded-full p-2 ${role === 'CARETAKER' ? 'bg-[#325439]' : 'bg-neutralLight/40'}`}
                  onPress={() => setRole('CARETAKER')}
                >
                  <Text className="font-bold text-white">Cuidador</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`mx-1 flex-1 items-center rounded-full p-2 ${role === 'VOLUNTEER' ? 'bg-[#325439]' : 'bg-neutralLight/40'}`}
                  onPress={() => setRole('VOLUNTEER')}
                >
                  <Text className="font-bold text-white">Voluntário</Text>
                </TouchableOpacity>
              </View>

              <View className="mt-4 w-full flex-row">
                <Checkbox
                  status={termsAccepted ? 'checked' : 'unchecked'}
                  onPress={() => setTermsAccepted(!termsAccepted)}
                  color={termsAccepted ? '#fff' : '#fbfbfb'}
                  style={{ transform: [{ scale: 1.5 }] }}
                />
                <Text className="ml-3 flex-shrink text-sm text-white">
                  Concordo com a Política de Privacidade e com os Termos e
                  Condições.
                </Text>
              </View>
            </View>

            <View className="mt-6 w-2/3">
              <Button
                title={loading ? 'A registar...' : 'Registar'}
                variant="transparent"
                onPress={handleRegister}
                disabled={loading}
              />
            </View>

            <TouchableOpacity className="mt-4" onPress={() => router.back()}>
              <Text className="text-base text-white">
                Já tem conta? Inicie sessão
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
