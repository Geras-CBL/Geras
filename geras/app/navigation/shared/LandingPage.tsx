import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../../assets/images/logo_geras.svg";

export default function Home() {
  // Criar 3 valores de animação (um para cada bola)
  // Começam com opacidade 0.3 (quase invisível)
  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;
  const opacity3 = useRef(new Animated.Value(0.3)).current;

  // Configurar o ciclo de animação
  useEffect(() => {
    // Função que faz uma bola brilhar e apagar em loop
    const pulse = (animatedValue: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          // Aumenta brilho (opacidade 1)
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400, // Tempo a acender
            useNativeDriver: true,
          }),
          // Diminui brilho (opacidade 0.3)
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 400, // Tempo a apagar
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Iniciar as animações com atrasos para criar o efeito de "onda"
    pulse(opacity1); // Começa logo
    
    setTimeout(() => {
      pulse(opacity2); // Começa 200ms depois
    }, 200);

    setTimeout(() => {
      pulse(opacity3); // Começa 400ms depois
    }, 400);

  }, []);

  return (
    <LinearGradient
      colors={['#6B8548', '#205B2D']}
      start={{ x: 0, y: 0 }} 
      end={{ x: 1, y: 1 }}
      className="flex-1" 
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-center">
          
          <View className="mb-4">
            <Logo />
          </View>

          <View className="flex-row items-center justify-center space-x-2 mt-6">
            <Animated.View 
              className="w-3 h-3 bg-white rounded-full" 
              style={{ opacity: opacity1 }} 
            />
            <Animated.View 
              className="w-3 h-3 bg-white rounded-full mx-2" 
              style={{ opacity: opacity2 }} 
            />
            <Animated.View 
              className="w-3 h-3 bg-white rounded-full" 
              style={{ opacity: opacity3 }} 
            />
          </View>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}