import { Pressable, View, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import MainLogo from '../../../assets/logo/Main_Logo.svg';

export default function Home() {
  return (
    <View className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        className="absolute left-0 top-0 h-full w-full"
        locations={[0, 1]}
        colors={['#6b8548', '#205b2d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
      />

      {/* Painel Gráfico (Imagens) */}
      <View className="relative mt-[42px] h-[162px] w-[116px] items-center justify-center self-center">
        <MainLogo width={116} height={162} />
      </View>

      {/* Título */}
      <ThemedText
        type="title"
        className="mt-[48px] px-8 text-left text-neutralLight"
      >
        Insira os seus dados
      </ThemedText>

      <View className="w-full flex-1 items-center">
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
        <Pressable
          className="mt-[90px] h-[39px] w-[130px] items-center justify-center rounded-2xl border-[2.5px] border-[#fbfbfb]"
          onPress={() => {}}
        >
          <ThemedText type="bigButton" className="font-momo text-neutralLight">
            Sign Up
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
