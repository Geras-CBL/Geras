import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import Header from "../../../components/shared/Header";
import { MaterialIcons } from "@expo/vector-icons";
import Road from "../../../assets/images/error_page_image.svg"
import { LinearGradient } from 'expo-linear-gradient'; 

const ButtonGoBack = () => {
  return (
    <TouchableOpacity className="flex-row items-center justify-center w-[200px] h-[70px]">
    
      <View className="z-10 w-14 h-14 bg-white rounded-full items-center justify-center shadow-sm">
        <MaterialIcons name="arrow-back" size={28} color="black" />
      </View>

      <View className="bg-white h-14 justify-center -ml-6 pl-8 pr-6 rounded-r-3xl shadow-sm min-w-[120px]">
        <ThemedText 
          type="body"
          className="text-black text-center font-bold leading-4"
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
      <View className="flex-1 items-center relative mt-5 pt-5">
        <ThemedText 
        type="title" 
        className="text-white mt-10"
        style={{fontSize: 63, lineHeight: 63}}
        >
          404
        </ThemedText>

        <ThemedText 
          type="subtitle" 
          className="text-white -mt-2 mb-8"
          style={{fontSize: 25, lineHeight: 40}}
        >
          Ups!
        </ThemedText>
        
        <View className="w-full h-[225px]">
           <Road width={'100%'} height={'100%'} preserveAspectRatio="xMidYMid slice" />
        </View>

        <ThemedText 
          type="subtitle"
          className="text-white pb-4 p-4 mt-5 px-10 text-center"
          style={{fontSize: 22, lineHeight: 34}}
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