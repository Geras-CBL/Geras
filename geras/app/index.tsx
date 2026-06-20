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

  // Se houver sessão mas o perfil não for encontrado ou não tiver role, redirecionar para completar o perfil
  if (!profile || !profile.role) {
    return <Redirect href={'/navigation/shared/CompleteProfilePage' as any} />;
  }

  // Se o onboarding não estiver concluído, redirecionar para a respetiva página de onboarding
  if (!profile.onboarding_completed) {
    if (profile.role === 'SENIOR') {
      return <Redirect href="/navigation/senior/OnboardingPage" />;
    } else if (profile.role === 'CARETAKER') {
      return <Redirect href="/navigation/caretaker/OnboardingPage" />;
    } else if (profile.role === 'VOLUNTEER') {
      return <Redirect href={'/navigation/volunteer/OnboardingPage' as any} />;
    }
  }

  // Redirecionamento consoante a Role do utilizador
  switch (profile.role) {
    case 'SENIOR':
      return profile.onboarding_completed ? (
        <Redirect href="/navigation/senior/HomePage" />
      ) : (
        <Redirect href={'/navigation/senior/OnboardingPage' as any} />
      );
    case 'CARETAKER':
      return <Redirect href="/navigation/caretaker/HomePage" />;
    case 'VOLUNTEER':
      return <Redirect href="/navigation/volunteer/HomePage" />;
    default:
      // Fallback de segurança
      return <Redirect href="/navigation/shared/LoginPage" />;
  }
}
