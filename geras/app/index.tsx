import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
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
        <Text className="text-white text-lg mb-4 text-center px-8">
          Não foi possível carregar o perfil. Por favor, tente novamente ou use o botão para terminar sessão.
        </Text>
        <TouchableOpacity
          onPress={signOut}
          className="bg-white px-6 py-3 rounded-full"
        >
          <Text className="text-[#325439] font-semibold">Terminar Sessão</Text>
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
