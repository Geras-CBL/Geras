import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Logo from "../../../assets/images/logo_geras.svg";

export default function Home() {
  const opacity1 = useRef(new Animated.Value(0.3)).current;
  const opacity2 = useRef(new Animated.Value(0.3)).current;
  const opacity3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = (animatedValue: Animated.Value) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 400, 
            useNativeDriver: true,
          }),
      
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 400, 
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    pulse(opacity1); 
    
    setTimeout(() => {
      pulse(opacity2); 
    }, 200);

    setTimeout(() => {
      pulse(opacity3); 
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