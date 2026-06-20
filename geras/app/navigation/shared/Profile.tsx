import React, { useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
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
  const { profile, isLoading, deleteAccount } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const openTerms = () => {
    router.push('/navigation/shared/TermosCondicoes');
  };

  const openPrivacy = () => {
    router.push('/navigation/shared/PoliticaPrivacidade');
  };

  const openEPrivacy = () => {
    router.push('/navigation/shared/DiretivaEPrivacy');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const { error } = await deleteAccount();
    setIsDeleting(false);
    if (error) {
      setShowDeleteModal(false);
      Alert.alert('Erro', error);
    } else {
      setShowDeleteModal(false);
      router.replace('/');
    }
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
            <Card
              name={displayName}
              role={displayRole}
              onEditPress={() => router.push('/navigation/shared/EditProfile')}
            />
          </SectionTitle>
        </View>

        <AccessibilitySection />

        <View className="mt-2 gap-4">
          <Button title="Termos e Condições" onPress={openTerms} />

          <Button title="Política de privacidade" onPress={openPrivacy} />

          <Button title="Diretiva ePrivacy" onPress={openEPrivacy} />

          <TouchableOpacity
            className="mb-20 mt-8 items-center"
            onPress={() => setShowDeleteModal(true)}
          >
            <ThemedText type="bodyBold" className="text-tertiary">
              Eliminar Conta
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de confirmação de eliminação de conta */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => !isDeleting && setShowDeleteModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 28,
              width: '100%',
              maxWidth: 360,
              alignItems: 'center',
              gap: 16,
            }}
          >
            <ThemedText
              type="bodyBold"
              style={{ fontSize: 18, textAlign: 'center' }}
            >
              Eliminar Conta
            </ThemedText>

            <Text
              style={{
                color: '#555',
                textAlign: 'center',
                lineHeight: 22,
                fontSize: 14,
              }}
            >
              Tem a certeza que deseja eliminar a sua conta? Esta ação é
              irreversível e todos os seus dados serão permanentemente apagados.
            </Text>

            {isDeleting ? (
              <View style={{ paddingVertical: 8 }}>
                <ActivityIndicator size="large" color="#b91c1c" />
                <Text style={{ color: '#555', marginTop: 8, fontSize: 14 }}>
                  A eliminar conta...
                </Text>
              </View>
            ) : (
              <View style={{ width: '100%', gap: 12, marginTop: 4 }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: '#b91c1c',
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}
                  onPress={handleDeleteAccount}
                >
                  <Text
                    style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}
                  >
                    Sim, eliminar conta
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: '#f3f4f6',
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: 'center',
                  }}
                  onPress={() => setShowDeleteModal(false)}
                >
                  <Text
                    style={{ color: '#333', fontWeight: '600', fontSize: 15 }}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
