import { useFontScale } from '@/components/FontContext';
import BottomActions from '@/components/senior/BottomActions';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { MaterialIcons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/shared/Button';

export default function Settings() {
  const { scale, setScale } = useFontScale();
  const { profile } = useAuth();
  const router = useRouter();

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

  const fontOptions = [
    { value: 1.0, label: 'Normal' },
    { value: 1.2, label: 'Grande' },
    { value: 1.5, label: 'Extra' },
  ];

  return (
    <SafeAreaView edges={['top']} className="flex-1 gap-8 bg-white px-6 pt-24">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-8 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* PERFIL */}
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

        {/* CUIDADORES ASSOCIADOS */}
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
                    />
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
            <ThemedText
              type="bodyBold"
              className="mb-2 text-center text-primary"
            >
              Associar novo Cuidador
            </ThemedText>
            <ThemedText
              type="bodyInfo"
              className="mb-4 text-center text-gray-600"
            >
              Gere um código para o seu cuidador introduzir na aplicação dele.
            </ThemedText>

            {connectionCode ? (
              <View className="w-full items-center gap-2">
                <View className="w-full items-center rounded-xl border border-gray-200 bg-white py-4 shadow-sm">
                  <ThemedText
                    type="title"
                    className="tracking-widest text-primary"
                  >
                    {connectionCode}
                  </ThemedText>
                </View>
                <ThemedText
                  type="bodyInfo"
                  className="text-center text-red-500"
                >
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

        {/* ACESSIBILIDADE */}
        <View className="gap-4">
          <SectionTitle title="Acessibilidade" />
          <View className="gap-2">
            <ThemedText
              type="subtitle"
              className="text-neutral-800"
              accessibilityRole="header"
            >
              Tamanho do Texto
            </ThemedText>
            <ThemedText type="body" className="text-gray-500">
              Ajuste o tamanho do texto para facilitar a leitura em toda a
              aplicação.
            </ThemedText>
          </View>

          <View className="flex-row gap-3">
            {fontOptions.map((option) => {
              const isSelected = scale === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setScale(option.value)}
                  activeOpacity={0.7}
                  className={`flex-1 items-center justify-center rounded-2xl border py-4 shadow-sm ${
                    isSelected
                      ? 'border-transparent bg-primary'
                      : 'border-gray-200 bg-white'
                  }`}
                  accessible={true}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={`Tamanho ${option.label}`}
                  accessibilityHint={`Toca duas vezes para alterar a escala do texto para ${option.value} vezes`}
                >
                  {isSelected && (
                    <View className="mb-1" importantForAccessibility="no">
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color="white"
                      />
                    </View>
                  )}

                  <ThemedText
                    type="bodyBold"
                    style={{
                      color: isSelected ? 'white' : '#4b5563',
                    }}
                  >
                    {option.label}
                  </ThemedText>

                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: isSelected ? 'rgba(255,255,255,0.8)' : '#9ca3af',
                    }}
                  >
                    {option.value}x
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="mt-4 gap-3">
            <ThemedText type="subtitle" accessibilityRole="header">
              Pré-visualização
            </ThemedText>

            <View className="rounded-3xl border border-gray-200 bg-gray-100 p-6">
              <View className="mb-4 flex-row items-center gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <MaterialIcons name="text-fields" size={24} color="white" />
                </View>
                <ThemedText type="bodyBold">Exemplo de Título</ThemedText>
              </View>

              <ThemedText type="body" className="leading-relaxed text-gray-600">
                Este é um exemplo de como o texto do corpo ficará. Ao alterar as
                definições acima, este texto mudará de tamanho instantaneamente.
              </ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomActions />
    </SafeAreaView>
  );
}
