import * as React from 'react';
import { View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

type ContainerVoluntarioProps = {
  name: string;
  age: number;
  role: string;
  avatarUri?: string;
};

const ContainerVoluntario = ({
  name,
  age,
  role,
  avatarUri,
}: ContainerVoluntarioProps) => {
  return (
    <View className="h-20 w-full flex-row items-center rounded-2xl bg-neutralLight px-4 shadow-md">
      {/* Avatar ou ícone */}
      {avatarUri ? (
        <View className="w-15 h-15 overflow-hidden rounded-full">
          <img src={avatarUri} style={{ width: 60, height: 60 }} />
        </View>
      ) : (
        <View className="flex items-center justify-center">
          <MaterialIcons name="person" size={60} color="#205a2d" />
        </View>
      )}

      {/* Info do voluntário */}
      <View className="ml-4 justify-center">
        <ThemedText type="body" className="text-lg text-neutral">
          {name}
        </ThemedText>
        <ThemedText type="bodyInfo" className="mt-1 text-sm text-neutral">
          {age} anos
        </ThemedText>
        <ThemedText type="bodyInfo" className="mt-0.5 text-sm text-neutral">
          {role}
        </ThemedText>
      </View>
    </View>
  );
};

export default ContainerVoluntario;
