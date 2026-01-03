import * as React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

const Resume = () => {
  return (
    <View
      className="w-full flex-row items-center rounded-2xl bg-neutralLight px-4 py-2"
      style={{ elevation: 6 }}
    >
      <View className="flex-1 flex-row">
        <View className="justify-center self-stretch px-1 py-2">
          <ThemedText>
            <ThemedText type="bodyBold">Resumo:</ThemedText>

            <ThemedText type="bodyInfo">
              {' '}
              <ThemedText className="text-[#a20707]">1 aviso</ThemedText>
              {' e 0 problemas saúde '}
            </ThemedText>
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default Resume;
