import * as React from 'react';
import { View, Image } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

type ContainerSeniorProps = {
  name: string;
  age: number;
  avatarUri?: string;
};

const ContainerSenior = ({ name, age, avatarUri }: ContainerSeniorProps) => {
  return (
    <View className="h-32 w-full flex-row items-center rounded-2xl bg-white px-4 shadow-md">
      {avatarUri ? (
        <View className="h-20 w-20 overflow-hidden rounded-full">
          <Image source={{ uri: avatarUri }} className="h-full w-full" />
        </View>
      ) : (
        <View className="h-20 w-20 items-center justify-center rounded-lg bg-neutral/10">
          <MaterialIcons name="person" size={70} color="#205a2d" />
        </View>
      )}

      <View className="ml-4 justify-center">
        <ThemedText type="body" className="text-lg text-neutral">
          {name}
        </ThemedText>
        <ThemedText type="bodyInfo" className="mt-2 text-sm text-neutral/60">
          {age} anos
        </ThemedText>
      </View>
    </View>
  );
};

export default ContainerSenior;
