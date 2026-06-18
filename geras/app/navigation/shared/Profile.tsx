import React from 'react';
import { View, ScrollView, Linking, ActivityIndicator } from 'react-native';
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
    Linking.openURL('https://www.ua.pt/pt/termos-de-utilizacao');
  };

  const openPrivacy = () => {
    Linking.openURL('https://www.ua.pt/pt/rgpd/politicas-de-privacidade');
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
          <Button title="Termos e condições" onPress={openTerms} />

          <Button title="Política de privacidade" onPress={openPrivacy} />

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
