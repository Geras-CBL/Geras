import * as React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import Header from '../../../components/shared/Header';
import { MaterialIcons } from '@expo/vector-icons';
import Road from '../../../assets/images/error_page_image.svg';
import { LinearGradient } from 'expo-linear-gradient';

const ButtonGoBack = () => {
  return (
    <TouchableOpacity className="h-[70px] w-[200px] flex-row items-center justify-center">
      <View className="z-10 h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
        <MaterialIcons name="arrow-back" size={28} color="black" />
      </View>

      <View className="-ml-6 h-14 min-w-[120px] justify-center rounded-r-3xl bg-white pl-8 pr-6 shadow-sm">
        <ThemedText
          type="body"
          className="text-center font-bold leading-4 text-black"
        >
          Voltar atrás
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default function Home() {
  return (
    <LinearGradient
      colors={['#6B8548', '#205B2D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SafeAreaView className="flex-1">
        <Header />
        <View className="relative mt-5 flex-1 items-center pt-5">
          <ThemedText
            type="title"
            className="mt-10 text-white"
            style={{ fontSize: 63, lineHeight: 63 }}
          >
            404
          </ThemedText>

          <ThemedText
            type="subtitle"
            className="-mt-2 mb-8 text-white"
            style={{ fontSize: 25, lineHeight: 40 }}
          >
            Ups!
          </ThemedText>

          <View className="h-[225px] w-full">
            <Road
              width={'100%'}
              height={'100%'}
              preserveAspectRatio="xMidYMid slice"
            />
          </View>

          <ThemedText
            type="subtitle"
            className="mt-5 p-4 px-10 pb-4 text-center text-white"
            style={{ fontSize: 22, lineHeight: 34 }}
          >
            Estamos a tentar gerar um caminho melhor
          </ThemedText>

          <View className="absolute bottom-10 left-6">
            <ButtonGoBack />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
