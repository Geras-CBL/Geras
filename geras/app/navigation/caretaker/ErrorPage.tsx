import { Pressable, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ErrorRoad from '../../../assets/illustrations/ErrorPage_Road.svg';

export default function Home() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#6B8548', '#205B2D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      {/* Botão de Voltar: Ajustado para uma posição de cabeçalho padrão (top-14)
      <Pressable
        onPress={() => router.push("./HomePage")}
        className="p-4 bg-white rounded-full absolute left-6 top-14 items-center justify-center z-20 shadow-sm"
      >
        <MaterialIcons name="arrow-back" size={24} color="#205B2D" />
      </Pressable> */}

      <View className="relative flex-1 items-center justify-center">
        {/* Texto Superior */}
        <View className="z-10 mb-10 items-center">
          <ThemedText
            type="title"
            className="text-center text-white"
            style={{ fontSize: 64, lineHeight: 64 }}
          >
            404
          </ThemedText>
          <ThemedText
            type="title"
            className="mt-2 text-center text-white"
            style={{ fontSize: 25, lineHeight: 40 }}
          >
            Ups!
          </ThemedText>
        </View>

        {/* Ilustração Central */}
        <View className="absolute top-1/2 z-0 h-[225px] w-full -translate-y-1/2">
          <ErrorRoad
            width={'100%'}
            height={'100%'}
            preserveAspectRatio="xMidYMide slice"
          />
        </View>

        {/* Texto Inferior */}
        <ThemedText
          type="title"
          className="z-10 mt-40 px-8 text-center text-white"
          style={{ fontSize: 22, lineHeight: 32 }}
        >
          Estamos a tentar gerar um caminho melhor...
        </ThemedText>
      </View>
    </LinearGradient>
  );
}
