import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/shared/Button';

export default function CaretakersSection() {
  const { profile } = useAuth();
  const [caretakers, setCaretakers] = useState<any[]>([]);
  const [connectionCode, setConnectionCode] = useState<string | null>(null);

  useEffect(() => {
    if (!profile?.id) return;
    const fetchCaretakers = async () => {
      const { data } = await supabase
        .from('senior_caretaker')
        .select('users!senior_caretaker_id_caretaker_fkey(id, name, email)')
        .eq('id_senior', profile.id);

      if (data) {
        setCaretakers(data.map((d: any) => d.users));
      }
    };

    const fetchExistingCode = async () => {
      const now = new Date().toISOString();
      const { data } = await supabase
        .from('connection_codes')
        .select('code, expires_at')
        .eq('id_user', profile.id)
        .gt('expires_at', now)
        .single();

      if (data) {
        setConnectionCode(data.code);
      }
    };

    fetchCaretakers();
    fetchExistingCode();
  }, [profile?.id]);

  const handleGenerateCode = async () => {
    if (!profile?.id) return;
    await supabase.from('connection_codes').delete().eq('id_user', profile.id);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { error } = await supabase.from('connection_codes').insert({
      code,
      id_user: profile.id,
      expires_at: expiresAt.toISOString(),
    });

    if (!error) {
      setConnectionCode(code);
    } else {
      Alert.alert('Erro', 'Não foi possível gerar o código.');
    }
  };

  const handleRemoveCaretaker = async (caretakerId: number) => {
    Alert.alert(
      'Remover Cuidador',
      'Tem a certeza que deseja remover este cuidador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await supabase
              .from('senior_caretaker')
              .delete()
              .match({ id_senior: profile?.id, id_caretaker: caretakerId });
            setCaretakers(caretakers.filter((c) => c.id !== caretakerId));
          },
        },
      ],
    );
  };

  if (profile?.role !== 'SENIOR') return null;

  return (
    <View className="gap-4">
      <SectionTitle title="Os meus Cuidadores" />

      {caretakers.length > 0 ? (
        <View className="gap-3">
          {caretakers.map((c) => (
            <View
              key={c.id}
              className="flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <View className="flex-1">
                <ThemedText type="bodyBold" className="text-neutral-800">
                  {c.name}
                </ThemedText>
                <ThemedText type="bodyInfo" className="text-gray-500">
                  {c.email}
                </ThemedText>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveCaretaker(c.id)}
                className="p-2"
              >
                <MaterialIcons
                  name="delete-outline"
                  size={24}
                  color="#ef4444"
                ></MaterialIcons>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <ThemedText className="italic text-gray-500">
          Não tem cuidadores associados.
        </ThemedText>
      )}

      <View className="mt-2 items-center rounded-3xl border border-primary/20 bg-primary/5 p-6">
        <ThemedText type="bodyBold" className="mb-2 text-center text-primary">
          Associar novo Cuidador
        </ThemedText>
        <ThemedText type="bodyInfo" className="mb-4 text-center text-gray-600">
          Gere um código para o seu cuidador introduzir na aplicação dele.
        </ThemedText>

        {connectionCode ? (
          <View className="w-full items-center gap-2">
            <View className="w-full items-center rounded-xl border border-gray-200 bg-white py-4 shadow-sm">
              <ThemedText type="title" className="tracking-widest text-primary">
                {connectionCode}
              </ThemedText>
            </View>
            <ThemedText type="bodyInfo" className="text-center text-red-500">
              Este código expira em 24 horas.
            </ThemedText>
          </View>
        ) : (
          <Button
            title="Gerar Código"
            onPress={handleGenerateCode}
            className="w-full"
          />
        )}
      </View>
    </View>
  );
}
