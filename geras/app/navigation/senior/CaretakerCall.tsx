import React, { useState, useEffect, useCallback } from 'react';
import { View, Linking, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useRouter } from 'expo-router';

export default function CaretakerCall() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);
  const [isCancelled, setIsCancelled] = useState(false);
  const phoneNumber = '963744454';

  const makeCall = useCallback(() => {
    if (!isCancelled) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, [isCancelled, phoneNumber]);

  useEffect(() => {
    if (isCancelled) return;

    if (seconds === 0) {
      makeCall();
      return;
    }

    const timerId = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [seconds, isCancelled, makeCall]);

  const handleCancel = () => {
    setIsCancelled(true);
    router.back();
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <ThemedText
        type="subtitle"
        className="mb-2 text-center"
        accessibilityRole="header"
      >
        A ligar a Sofia, telemóvel
      </ThemedText>

      <View
        className="my-16 items-center justify-center"
        accessible={true}
        accessibilityLiveRegion="assertive"
        accessibilityLabel={`A ligar a Sofia em ${seconds} segundos.`}
      >
        <ThemedText type="title" style={{ fontSize: 40, lineHeight: 40 }}>
          {seconds}
        </ThemedText>
        <ThemedText type="subtitle" className="mt-2">
          segundos
        </ThemedText>
      </View>

      <View className="w-full gap-8">
        <TouchableOpacity
          className="items-center rounded-xl bg-primary p-8"
          onPress={makeCall}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Ligar agora"
          accessibilityHint="Efetua a chamada telefónica imediatamente"
        >
          <ThemedText type="title" className="text-white">
            Ligar Agora
          </ThemedText>
        </TouchableOpacity>

        {!isCancelled ? (
          <TouchableOpacity
            className="items-center rounded-xl border border-tertiary bg-orange-100 p-8"
            onPress={handleCancel}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Cancelar chamada"
            accessibilityHint="Cancela a contagem decrescente e volta ao ecrã anterior"
          >
            <ThemedText type="title" className="text-tertiary">
              Cancelar
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <View
            className="items-center"
            accessible={true}
            accessibilityLiveRegion="polite"
            accessibilityLabel="Chamada cancelada"
          >
            <ThemedText type="title" className="text-tertiary">
              Cancelado
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}
