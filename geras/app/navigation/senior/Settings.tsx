import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import BottomActions from '@/components/senior/BottomActions';
import ProfileSection from '@/components/shared/ProfileSection';
import CaretakersSection from '@/components/shared/CaretakersSection';
import AccessibilitySection from '@/components/shared/AccessibilitySection';
import HealthConnectSection from '@/components/shared/HealthConnectSection';
import Button from '@/components/shared/Button';
import { ThemedText } from '@/components/ThemedText';

export default function Settings() {
  const router = useRouter();

  const openTerms = () => {
    router.push('/navigation/shared/TermosCondicoes');
  };

  const openPrivacy = () => {
    router.push('/navigation/shared/PoliticaPrivacidade');
  };

  const openEPrivacy = () => {
    router.push('/navigation/shared/DiretivaEPrivacy');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 bg-white px-6 pt-24">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection />
        <CaretakersSection />
        <AccessibilitySection />
        <HealthConnectSection />

        <View className="mt-2 gap-4">
          <Button title="Termos e Condições" onPress={openTerms} />
          <Button title="Política de privacidade" onPress={openPrivacy} />
          <Button title="Diretiva ePrivacy" onPress={openEPrivacy} />

          <View className="mb-20 mt-8 items-center">
            <ThemedText type="bodyBold" className="text-tertiary">
              Eliminar Conta
            </ThemedText>
          </View>
        </View>
      </ScrollView>

      <BottomActions />
    </SafeAreaView>
  );
}
