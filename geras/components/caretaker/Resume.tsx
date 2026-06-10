import * as React from 'react';
import { View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface ResumeProps {
  alertsCount: number;
  healthProblemsCount: number;
  sensorAlertsCount: number;
}

const Resume: React.FC<ResumeProps> = ({
  alertsCount,
  healthProblemsCount,
  sensorAlertsCount,
}) => {
  const totalAlertsCount = alertsCount + sensorAlertsCount;
  return (
    <View className="w-full flex-row items-center rounded-2xl bg-neutralLight px-4 py-2 shadow-lg">
      <View className="flex-1 flex-row">
        <View className="justify-center self-stretch px-1 py-2">
          <ThemedText>
            <ThemedText type="bodyBold">Resumo:</ThemedText>

            <ThemedText type="bodyInfo">
              {' '}
              <ThemedText
                className={
                  totalAlertsCount > 0 ? 'text-[#a20707]' : 'text-primary'
                }
              >
                {totalAlertsCount} {totalAlertsCount === 1 ? 'aviso' : 'avisos'}
              </ThemedText>
              {` e ${healthProblemsCount} ${healthProblemsCount === 1 ? 'problema' : 'problemas'} saúde`}
            </ThemedText>
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default Resume;
