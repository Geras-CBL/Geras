import { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { FormField } from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import Header from '@/components/shared/Header';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function AddMedication() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { profile } = useAuth();
  const idSenior = params.id_senior ? String(params.id_senior) : profile?.id;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    dosage: '',
    start_date: '',
    end_date: '',
    time: '',
    description: '',
  });

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Atenção', 'O nome do medicamento é obrigatório.');
      return;
    }
    if (!form.dosage.trim()) {
      Alert.alert('Atenção', 'A dosagem é obrigatória.');
      return;
    }
    if (
      !form.start_date.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(form.start_date)
    ) {
      Alert.alert(
        'Atenção',
        'A data de início deve estar no formato AAAA-MM-DD.',
      );
      return;
    }
    if (form.end_date.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(form.end_date)) {
      Alert.alert('Atenção', 'A data de fim deve estar no formato AAAA-MM-DD.');
      return;
    }
    if (!form.time.trim() || !/^\d{2}:\d{2}$/.test(form.time)) {
      Alert.alert('Atenção', 'A hora deve estar no formato HH:MM.');
      return;
    }

    if (!idSenior) {
      Alert.alert('Erro', 'Não foi possível identificar o sénior.');
      return;
    }

    setLoading(true);
    try {
      const today = new Date();
      const [hours, minutes] = form.time.split(':');
      today.setHours(Number(hours), Number(minutes), 0, 0);

      const { error } = await supabase.from('medicine').insert({
        id_senior: idSenior,
        name: form.name.trim(),
        dosage: Number(form.dosage) || null,
        description: form.description.trim(),
        scheduled_time: today.toISOString(),
        start_date: new Date(form.start_date).toISOString(),
        end_date: form.end_date.trim()
          ? new Date(form.end_date).toISOString()
          : null,
        status: 'TO TAKE',
      });

      if (error) throw error;

      Alert.alert('Sucesso', 'Medicação adicionada com sucesso!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      console.error('Erro ao adicionar medicação:', err);
      Alert.alert('Erro', 'Ocorreu um erro ao guardar a medicação.');
    } finally {
      setLoading(false);
    }
  };

  const isCaretaker = profile?.role === 'CARETAKER';

  return (
    <SafeAreaView
      edges={['top']}
      className={`flex-1 pt-24 ${isCaretaker ? 'bg-transparent' : 'bg-background'}`}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          contentStyle: {
            backgroundColor: isCaretaker ? 'transparent' : '#fbfbfb',
          },
          header: () => (
            <Header
              leftIconName="arrow-back"
              leftIconLabel="Voltar à página anterior"
              onLeftPress={() => router.back()}
              rightIconName={isCaretaker ? 'notifications' : 'settings'}
              rightIconLabel={
                isCaretaker ? 'Ver notificações' : 'Abrir definições'
              }
              onRightPress={() =>
                isCaretaker
                  ? router.push('/navigation/shared/Notifications')
                  : router.push('/navigation/senior/Settings')
              }
            />
          ),
        }}
      />
      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" className="mb-6">
          Adicionar Medicação
        </ThemedText>
        <View className="gap-6">
          <View>
            <ThemedText type="bodyBold" className="mb-2 text-neutral">
              Nome do Medicamento *
            </ThemedText>
            <FormField
              placeholder="Ex: Ben-U-Ron"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
          </View>

          <View>
            <ThemedText type="bodyBold" className="mb-2 text-neutral">
              Dosagem (mg) *
            </ThemedText>
            <FormField
              placeholder="Ex: 1000"
              keyboardType="numeric"
              value={form.dosage}
              onChangeText={(text) => setForm({ ...form, dosage: text })}
            />
          </View>

          <View>
            <ThemedText type="bodyBold" className="mb-2 text-neutral">
              Data de Início (AAAA-MM-DD) *
            </ThemedText>
            <FormField
              placeholder="Ex: 2026-06-15"
              value={form.start_date}
              maxLength={10}
              onChangeText={(text) => {
                let formatted = text.replace(/[^0-9]/g, '');
                if (formatted.length >= 5 && formatted.length <= 6) {
                  formatted = `${formatted.slice(0, 4)}-${formatted.slice(4)}`;
                } else if (formatted.length >= 7) {
                  formatted = `${formatted.slice(0, 4)}-${formatted.slice(4, 6)}-${formatted.slice(6, 8)}`;
                }
                setForm({ ...form, start_date: formatted });
              }}
            />
          </View>

          <View>
            <ThemedText type="bodyBold" className="mb-2 text-neutral">
              Data de Fim (AAAA-MM-DD)
            </ThemedText>
            <FormField
              placeholder="Ex: 2026-06-25 (Opcional)"
              value={form.end_date}
              maxLength={10}
              onChangeText={(text) => {
                let formatted = text.replace(/[^0-9]/g, '');
                if (formatted.length >= 5 && formatted.length <= 6) {
                  formatted = `${formatted.slice(0, 4)}-${formatted.slice(4)}`;
                } else if (formatted.length >= 7) {
                  formatted = `${formatted.slice(0, 4)}-${formatted.slice(4, 6)}-${formatted.slice(6, 8)}`;
                }
                setForm({ ...form, end_date: formatted });
              }}
            />
          </View>

          <View>
            <ThemedText type="bodyBold" className="mb-2 text-neutral">
              Hora da Toma Inicial (HH:MM) *
            </ThemedText>
            <FormField
              placeholder="Ex: 14:30"
              value={form.time}
              maxLength={5}
              onChangeText={(text) => {
                let formatted = text.replace(/[^0-9]/g, '');
                if (formatted.length >= 3) {
                  formatted = `${formatted.slice(0, 2)}:${formatted.slice(2, 4)}`;
                }
                setForm({ ...form, time: formatted });
              }}
            />
          </View>

          <View>
            <ThemedText type="bodyBold" className="mb-2 text-neutral">
              Instruções / Descrição
            </ThemedText>
            <FormField
              placeholder="Ex: Tomar após a refeição"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
          </View>

          <View className="mt-6">
            <Button
              title={loading ? 'A guardar...' : 'Guardar Medicação'}
              variant="default"
              onPress={handleSave}
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
