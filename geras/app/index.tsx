import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { session, profile, isLoading, signOut } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#325439]">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // Se não houver sessão, redirecionar para a página de Login
  if (!session) {
    return <Redirect href="/navigation/shared/LoginPage" />;
  }

  // Se houver sessão mas o perfil não for encontrado ou falhar o carregamento, mostrar erro com opção de sair
  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-[#325439]">
        <ThemedText className="mb-4 px-8 text-center text-lg text-white">
          Não foi possível carregar o perfil. Por favor, tente novamente ou use
          o botão para terminar sessão.
        </ThemedText>
        <TouchableOpacity
          onPress={signOut}
          className="rounded-full bg-white px-6 py-3"
        >
          <ThemedText className="font-semibold text-[#325439]">
            Terminar Sessão
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  // Redirecionamento consoante a Role do utilizador
  switch (profile.role) {
    case 'SENIOR':
      return <Redirect href="/navigation/senior/HomePage" />;
    case 'CARETAKER':
      return <Redirect href="/navigation/caretaker/HomePage" />;
    case 'VOLUNTEER':
      return <Redirect href="/navigation/volunteer/HomePage" />;
    default:
      // Fallback de segurança
      return <Redirect href="/navigation/shared/LoginPage" />;
  }
}
