import React from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import SectionTitle from '@/components/shared/SectionTitle';
import { Card } from '@/components/shared/ProfileCard';
import Button from '@/components/shared/Button';
import { ThemedText } from '@/components/ThemedText';

export default function Profile() {
  const router = useRouter();

  const openTerms = () => {
    Linking.openURL('https://www.ua.pt/pt/termos-de-utilizacao');
  };

  const openPrivacy = () => {
    Linking.openURL('https://www.ua.pt/pt/rgpd/politicas-de-privacidade');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 pt-16">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 gap-12 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-8">
          <SectionTitle title="Perfil">
            <View className="mt-8">
              <Card
                name="Joana Silva"
                role="Cuidadora"
                age={27}
                onEditPress={() =>
                  router.push('/navigation/shared/EditProfile')
                }
              />
            </View>
          </SectionTitle>
        </View>

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
