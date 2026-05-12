import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { session, profile, isLoading } = useAuth();

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

  // Se houver sessão mas o perfil ainda estiver a carregar, podemos mostrar loading também
  // O AuthContext atualiza o profile logo depois da sessão
  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-[#325439]">
        <ActivityIndicator size="large" color="#ffffff" />
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
