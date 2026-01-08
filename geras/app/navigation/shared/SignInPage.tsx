import { View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import MainLogo from '../../../assets/logo/Main_Logo.svg';
import Button from '@/components/shared/Button';

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      {/* Background Gradient */}
      <LinearGradient
        className="absolute h-full w-full"
        locations={[0, 1]}
        colors={['#6b8548', '#205b2d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      />

      <SafeAreaView edges={['top']} className="flex-1 pt-16">
        {/* Painel Gráfico (Imagens) */}
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

        <View className="w-full items-center">
          {/* Formulário (Inputs)*/}
          <View className="mt-10 w-full gap-y-7 px-8">
            <TextInput
              className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
              placeholder="Nome"
              numberOfLines={1}
              maxLength={60}
              placeholderTextColor="#fbfbfb"
            />
            <TextInput
              className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
              placeholder="Email"
              numberOfLines={1}
              maxLength={40}
              placeholderTextColor="#fbfbfb"
            />
            <TextInput
              className="h-12 w-full rounded-2xl bg-neutralLight/40 px-4 text-base text-neutralLight"
              numberOfLines={1}
              maxLength={15}
              placeholder="Palavra-passe"
              placeholderTextColor="#fbfbfb"
            />
          </View>

          {/* Botão Sign Up */}
          <Button
            title=" Sign Up "
            variant="transparent"
            className="mt-6"
            onPress={() => {}}
          ></Button>
        </View>
      </SafeAreaView>
    </View>
  );
}
