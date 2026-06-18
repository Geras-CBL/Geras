import React from 'react';
import { View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/shared/Button';

export default function ProfileSection() {
  const { profile } = useAuth();
  const router = useRouter();

  return (
    <View className="gap-4">
      <SectionTitle title="Perfil" />
      <View className="rounded-3xl border border-gray-200 bg-gray-100 p-6">
        <View className="mb-4 flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <MaterialIcons name="person" size={24} color="#205a2d" />
          </View>
          <ThemedText type="bodyBold">
            {profile?.name || 'Utilizador'}
          </ThemedText>
        </View>
        <Button
          title="Editar Perfil"
          variant="outlined"
          icon={<MaterialIcons name="edit" size={20} color="#205a2d" />}
          onPress={() => router.push('/navigation/shared/EditProfile')}
        />
      </View>
    </View>
  );
}
