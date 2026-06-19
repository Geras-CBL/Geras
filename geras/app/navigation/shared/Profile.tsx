import React from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import SectionTitle from '@/components/shared/SectionTitle';
import { Card } from '@/components/shared/ProfileCard';
import Button from '@/components/shared/Button';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import AccessibilitySection from '@/components/shared/AccessibilitySection';

const ROLE_LABELS: Record<string, string> = {
  CARETAKER: 'Cuidador(a)',
  SENIOR: 'Sénior',
  VOLUNTEER: 'Voluntário(a)',
};

export default function Profile() {
  const router = useRouter();
  const { profile, isLoading } = useAuth();

  const openTerms = () => {
    router.push('/navigation/shared/TermosCondicoes');
  };

  const openPrivacy = () => {
    router.push('/navigation/shared/PoliticaPrivacidade');
  };

  const openEPrivacy = () => {
    router.push('/navigation/shared/DiretivaEPrivacy');
  };

  if (isLoading) {
    return (
      <SafeAreaView
        edges={['top']}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color="#205a2d" />
        <ThemedText className="mt-4">A carregar perfil...</ThemedText>
      </SafeAreaView>
    );
  }

  const displayName = profile?.name ?? 'Utilizador';
  const displayRole = profile?.role
    ? (ROLE_LABELS[profile.role] ?? profile.role)
    : 'Sem papel';

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-16">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 gap-12 pb-40"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-8">
          <SectionTitle title="Perfil">
            <View className="mt-8">
              <Card
                name={displayName}
                role={displayRole}
                onEditPress={() =>
                  router.push('/navigation/shared/EditProfile')
                }
              />
            </View>
          </SectionTitle>
        </View>

        <AccessibilitySection />

        <View className="mt-2 gap-4">
          <Button title="Termos e Condições" onPress={openTerms} />

          <Button title="Política de privacidade" onPress={openPrivacy} />

          <Button title="Diretiva ePrivacy" onPress={openEPrivacy} />

          <View className="mt-12 items-center">
            <ThemedText type="bodyBold" className="text-tertiary">
              Eliminar Conta
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
