import { Pressable, View, TextInput } from "react-native";
import {LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/ThemedText';
import MainLogo from '../../../assets/logo/Main_Logo.svg';

export default function Home() {
  return (

     <View className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        className="absolute left-0 top-0 w-full h-full"
        locations={[0, 1]}
        colors={['#6b8548', '#205b2d']}
        start={{ x: 0, y: 0 }} 
        end={{ x: 0.3, y: 1 }}
      />

      {/* Painel Gráfico (Imagens) */}
        <View className="mt-[42px] w-[116px] h-[162px] relative items-center justify-center self-center">

          <MainLogo width={116} height={162} />
          
        </View>

        {/* Título */}
        <ThemedText type="title" className="mt-[48px] text-neutralLight text-left px-8">
          Insira os seus dados
        </ThemedText>

      <View className="flex-1 items-center w-full">
        

        {/* Formulário (Inputs)*/}
        <View className="w-full px-8 mt-10 gap-y-7">
          
          <TextInput
            className="w-full h-12 bg-neutralLight/40 rounded-2xl px-4 text-neutralLight text-base"
            placeholder="Nome" 
            numberOfLines={1}
            maxLength={60}
            placeholderTextColor="#fbfbfb"
          />
          <TextInput
            className="w-full h-12 bg-neutralLight/40 rounded-2xl px-4 text-neutralLight text-base"
            placeholder="Email" 
            numberOfLines={1}
            maxLength={40}
            placeholderTextColor="#fbfbfb"
          />
          <TextInput
            className="w-full h-12 bg-neutralLight/40 rounded-2xl px-4 text-neutralLight text-base"
            numberOfLines={1}
            maxLength={15}
            placeholder="Palavra-passe" 
            placeholderTextColor="#fbfbfb"
          />


        </View> 

        {/* Botão Sign Up */}
        <Pressable 
          className="mt-[90px] w-[130px] h-[39px] border-[2.5px] border-[#fbfbfb] rounded-2xl items-center justify-center"
          onPress={() => {}}
        >
          <ThemedText type="bigButton" className="text-neutralLight font-momo">
            Sign Up
          </ThemedText>
        </Pressable>

      </View>
    </View>

  );
}
