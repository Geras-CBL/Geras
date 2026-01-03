import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import SectionTitle from '@/components/shared/SectionTitle';
import { Card } from '@/components/shared/ProfileCard';
import Button from '@/components/shared/Button';

export default function Profile() {
  const router = useRouter();
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
          <Button title="Termos e condições" onPress={() => {}} />

          <Button title="Política de privacidade" onPress={() => {}} />

          <View className="mt-12">
            <Button
              title="Eliminar conta"
              variant="destructive"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
