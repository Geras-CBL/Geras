import { View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText'; 

import Button from '@/components/shared/Button'; 
import { router } from 'expo-router';

export default function LoginPage() {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        className="absolute h-full w-full"
        locations={[0, 1]}
        colors={['#6b8548', '#205b2d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      />

      <SafeAreaView edges={['top']} className="flex-1 pt-16">
        
        {/* Logo */}
        <View className="mt-4 items-center justify-center self-center">
          <MainLogo width={116} height={162} />
        </View>

        {/* Título */}
        <ThemedText
          type="title"
          className="mt-10 px-8 text-left text-neutralLight"
        >
          Insira os seus dados
        </ThemedText>

        {/* Inputs */}
        <View className="w-full items-center">
          <View className="mt-10 w-full gap-y-7 px-8">
            
            {/* Input E-mail */}
            <TextInput
              className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
              placeholder="E-mail"
              numberOfLines={1}
              maxLength={60}
              placeholderTextColor="#fbfbfb"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Input palavra-Passe */}
            <TextInput
              className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
              placeholder="Palavra-Passe"
              numberOfLines={1}
              maxLength={40}
              placeholderTextColor="#fbfbfb"
              secureTextEntry={true} 
            />
          </View>

          {/* Botão Login */}
          <View className="mt-10 w-full px-16">
             <Button
                title="Login"
                variant="transparent"
                className="mt-6 border border-white rounded-3xl" 
                onPress={() => {
                    console.log("Login pressionado");
                }}
            />
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}
