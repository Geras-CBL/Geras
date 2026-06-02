import React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';

type CardProps = {
  name: string;
  role: string;
  age?: number;
  onEditPress?: () => void;
};

export function Card({ name, role, age, onEditPress }: CardProps) {
  return (
    <View className="elevation-8 w-full flex-row items-center gap-6 rounded-xl bg-neutralLight p-6 shadow-lg">
      <View className="h-28 w-28 items-center justify-center rounded-lg bg-primary/10">
        <MaterialIcons name="person" size={100} color="#205a2d" />
      </View>

      <View className="flex-1 justify-between gap-4">
        <View
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Perfil de ${name}, papel: ${role}${age && age > 0 ? `, ${age} anos` : ''}`}
          className="gap-1"
        >
          <ThemedText type="bodyBold" className="uppercase text-neutral">
            {name}
          </ThemedText>

          <ThemedText type="bodyInfo" className="text-neutral">
            {role}
          </ThemedText>

          {age && age > 0 ? (
            <ThemedText type="bodyInfo" className="text-neutral">
              {age} anos
            </ThemedText>
          ) : null}
        </View>

        {onEditPress && (
          <Pressable
            onPress={onEditPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Editar perfil"
            accessibilityHint="Toca duas vezes para editar as informações de perfil"
          >
            <ThemedText type="bodyBold" className="text-primary">
              Editar perfil
            </ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}
