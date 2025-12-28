import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HelpAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  if (!isOpen) {
    return (
      <View className="absolute bottom-8 z-50 w-full items-center">
        <View className="relative">
          <View className="absolute -top-6 left-0 right-0 z-10 items-center shadow-sm">
            <View className="h-12 w-12 items-center justify-center rounded-full border-4 border-[#f2f2f2] bg-primary">
              <MaterialIcons name="question-mark" size={24} color="white" />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={toggleOpen}
            className="h-16 w-48 items-center justify-center rounded-full bg-white shadow-xl"
            style={{ elevation: 5 }}
          >
            <ThemedText className="pt-3 text-lg font-bold text-black">
              Tenho dúvidas
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={toggleOpen}
        className="absolute bottom-0 left-0 right-0 top-0 z-40 bg-black/20"
      />

      <View className="absolute bottom-0 z-50 w-full">
        <View className="w-full rounded-t-[32px] bg-white px-6 pb-10 pt-12 shadow-2xl">
          <View className="absolute -top-8 left-0 right-0 items-center justify-center">
            <View className="absolute top-2 h-20 w-20 rounded-full bg-white" />

            <View className="z-10 h-16 w-16 items-center justify-center rounded-full bg-primary shadow-sm">
              <MaterialIcons name="question-mark" size={32} color="white" />
            </View>
          </View>

          <TouchableOpacity
            onPress={toggleOpen}
            className="absolute right-6 top-6 rounded-full bg-gray-100 p-2"
          >
            <MaterialIcons name="close" size={20} color="black" />
          </TouchableOpacity>

          <View className="w-full gap-6">
            <View className="mt-2 self-start rounded-2xl rounded-tl-none bg-gray-200 px-6 py-4">
              <ThemedText className="text-base font-medium text-gray-700">
                Olá! Como posso ajudar?
              </ThemedText>
            </View>

            <TouchableOpacity
              className="w-full flex-row items-center justify-center gap-3 rounded-2xl bg-primary py-4 shadow-md"
              activeOpacity={0.8}
            >
              <ThemedText className="text-lg font-bold text-white">
                Pressione aqui para falar
              </ThemedText>
              <MaterialIcons name="record-voice-over" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
