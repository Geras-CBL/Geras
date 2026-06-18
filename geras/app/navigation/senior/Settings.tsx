import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomActions from '@/components/senior/BottomActions';
import ProfileSection from '@/components/shared/ProfileSection';
import CaretakersSection from '@/components/shared/CaretakersSection';
import AccessibilitySection from '@/components/shared/AccessibilitySection';
import HealthConnectSection from '@/components/shared/HealthConnectSection';

export default function Settings() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 bg-white px-6 pt-24">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 pb-32"
        showsVerticalScrollIndicator={false}
      >
        <ProfileSection />
        <CaretakersSection />
        <AccessibilitySection />
        <HealthConnectSection />
      </ScrollView>

      <BottomActions />
    </SafeAreaView>
  );
}
