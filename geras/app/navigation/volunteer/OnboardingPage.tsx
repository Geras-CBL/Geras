import React, { useState } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import LocalConvenienceStoreIcon from '@/assets/icons/local_convenience_store_24dp_205A2D_FILL0_wght400_GRAD0_opsz24.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { MaterialIcons } from '@expo/vector-icons';
import MainLogo from '@/assets/logo/Main_Logo.svg';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Bem-Vindo',
    description: 'Juntos geramos um lugar melhor...',
    isLogo: true,
  },
  {
    id: 2,
    title: 'Bem-Vindo',
    description: 'AJUDE A POPULAÇÃO SÉNIOR',
    materialIcon: 'elderly',
  },
  {
    id: 3,
    title: 'Bem-Vindo',
    description: 'RECEBA VOUCHERS',
    materialIcon: 'local-activity',
  },
  {
    id: 4,
    title: 'Bem-Vindo',
    description: 'APOIE O COMÉRCIO LOCAL',
    svgIcon: 'local-convenience-store',
  },
];

export default function OnboardingPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { session, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const slide = SLIDES[activeIndex];

  const handleNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const completeOnboarding = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ onboarding_completed: true })
        .eq('auth_user_id', session.user.id);

      if (error) throw error;

      await refreshProfile();
      router.replace('/' as any);
    } catch (err: any) {
      console.error('Erro ao concluir onboarding:', err);
      Alert.alert('Erro', 'Não foi possível concluir. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderCenterImage = () => {
    if (slide.isLogo) {
      return (
        <View style={styles.logoContainer}>
          <MainLogo width={220} height={220} />
        </View>
      );
    }
    if ((slide as any).svgIcon === 'local-convenience-store') {
      return (
        <View style={styles.iconCard}>
          <LocalConvenienceStoreIcon width={110} height={110} />
        </View>
      );
    }
    if (slide.materialIcon) {
      return (
        <View style={styles.iconCard}>
          <MaterialIcons
            name={slide.materialIcon as any}
            size={110}
            color="#205b2d"
          />
        </View>
      );
    }
    return null;
  };

  return (
    <LinearGradient
      style={{ flex: 1 }}
      colors={['#6b8548', '#205b2d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>{slide.title}</Text>
          </View>

          <View style={styles.imageWrapper}>
            {renderCenterImage()}
            {!slide.isLogo && (
              <View style={styles.descriptionWrapper}>
                <Text style={styles.description}>{slide.description}</Text>
              </View>
            )}
          </View>

          {slide.isLogo && (
            <View style={styles.slide1DescriptionWrapper}>
              <Text style={styles.slide1Description}>{slide.description}</Text>
            </View>
          )}

          <View style={styles.dotsRow}>
            {SLIDES.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          <View style={styles.arrowRow}>
            <TouchableOpacity
              onPress={handleBack}
              disabled={activeIndex === 0}
              style={[styles.arrowBtn, activeIndex === 0 && { opacity: 0 }]}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={32} color="#fbfbfb" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              disabled={loading}
              style={styles.arrowBtn}
              activeOpacity={0.7}
            >
              {loading ? (
                <MaterialIcons
                  name="hourglass-empty"
                  size={32}
                  color="#fbfbfb"
                />
              ) : (
                <MaterialIcons
                  name={
                    activeIndex === SLIDES.length - 1
                      ? 'check'
                      : 'arrow-forward'
                  }
                  size={32}
                  color="#fbfbfb"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 8,
  },
  titleWrapper: {
    marginTop: 40,
    marginBottom: 0,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'MonoTrustDisplay',
    fontSize: 36,
    color: '#fbfbfb',
    textAlign: 'center',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCard: {
    width: 200,
    height: 200,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  descriptionWrapper: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  description: {
    fontFamily: 'Rubik_500Medium',
    textAlign: 'center',
    fontSize: 24,
    color: 'rgba(251, 251, 251, 0.95)',
    lineHeight: 34,
  },
  slide1DescriptionWrapper: {
    marginBottom: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  slide1Description: {
    fontFamily: 'Rubik',
    textAlign: 'center',
    fontSize: 18,
    color: 'rgba(251, 251, 251, 0.85)',
    lineHeight: 26,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  dot: {
    borderRadius: 7,
  },
  dotActive: {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
  },
  dotInactive: {
    width: 10,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  arrowRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  arrowBtn: {
    padding: 16,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
