import {
  ScrollView,
  View,
  Platform,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

import SectionTitle from '@/components/shared/SectionTitle';
import { FormField } from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import Avatar from '@/components/shared/Avatar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { locations } from '@/data/locations';

export default function EditProfile() {
  const { profile, refreshProfile, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [local, setLocal] = useState('');
  const [district, setDistrict] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [showMunicipalityPicker, setShowMunicipalityPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setEmail(profile.email || '');
      setAddress(profile.address || '');
      setZipCode(profile.zip_code || '');
      setLocal(profile.local || '');
      setImage(profile.profile_picture?.uri || null);

      if (profile.local) {
        const foundDistrict = locations.find((d) =>
          d.municipalities.includes(profile.local!),
        );
        if (foundDistrict) {
          setDistrict(foundDistrict.name);
        }
      }
    }
  }, [profile]);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Erro', 'É necessário permitir o acesso à câmara.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!profile?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name,
          email,
          address,
          zip_code: zipCode,
          local,
          profile_picture: image ? { uri: image } : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.back();
    } catch (error: any) {
      console.error('Erro ao guardar perfil:', error);
      Alert.alert(
        'Erro',
        error.message || 'Ocorreu um erro ao guardar o perfil.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleDistrictSelect = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    setLocal('');
    setShowDistrictPicker(false);
    setShowMunicipalityPicker(true);
  };

  const handleMunicipalitySelect = (municipality: string) => {
    setLocal(municipality);
    setShowMunicipalityPicker(false);
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const selectedDistrictMunicipalities =
    locations.find((d) => d.name === district)?.municipalities || [];

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#205a2d" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 pt-32"
      contentContainerStyle={{ padding: 20, paddingBottom: 130 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="mb-6 items-center">
        <TouchableOpacity
          onPress={takePhoto}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Alterar foto de perfil"
          accessibilityHint="Toca duas vezes para tirar uma nova foto de perfil"
        >
          <Avatar uri={image} initials={getInitials(name)} />
        </TouchableOpacity>
      </View>

      <View className="mt-8 w-full gap-8">
        <SectionTitle title="Nome" />
        <FormField
          className="-mt-6"
          placeholder="Nome"
          value={name}
          onChangeText={setName}
        />

        <SectionTitle title="Email" />
        <FormField
          className="-mt-6"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false}
        />

        <SectionTitle title="Morada" />
        <FormField
          className="-mt-6"
          placeholder="Morada"
          value={address}
          onChangeText={setAddress}
        />

        <SectionTitle title="Código Postal" />
        <FormField
          className="-mt-6"
          placeholder="Código Postal"
          value={zipCode}
          onChangeText={setZipCode}
          keyboardType="numeric"
        />

        <SectionTitle title="Distrito" />
        <FormField
          className="-mt-6"
          variant="dropdown"
          value={district}
          placeholder="Selecionar Distrito"
          onPress={() => setShowDistrictPicker(true)}
        />

        <SectionTitle title="Concelho" />
        <FormField
          className="-mt-6"
          variant="dropdown"
          value={local}
          placeholder="Selecionar Concelho"
          onPress={() => {
            if (!district) {
              Alert.alert('Aviso', 'Selecione primeiro um distrito.');
              return;
            }
            setShowMunicipalityPicker(true);
          }}
        />
      </View>

      <View className="mt-10 w-full gap-4">
        <Button
          title={isSaving ? 'A guardar...' : 'Guardar'}
          onPress={handleSave}
          disabled={isSaving}
        />
        <Button
          title="Cancelar"
          variant="outlined"
          onPress={handleCancel}
          disabled={isSaving}
        />
      </View>

      <Modal
        visible={showDistrictPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDistrictPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="max-h-96 rounded-t-xl bg-white p-4">
            <Text
              className="mb-4 text-center text-lg font-bold"
              accessibilityRole="header"
            >
              Selecionar Distrito
            </Text>
            <FlatList
              data={locations}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="border-b border-neutral/15 py-3"
                  onPress={() => handleDistrictSelect(item.name)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={item.name}
                >
                  <Text className="text-base text-neutral">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => setShowDistrictPicker(false)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showMunicipalityPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMunicipalityPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="max-h-96 rounded-t-xl bg-white p-4">
            <Text
              className="mb-4 text-center text-lg font-bold"
              accessibilityRole="header"
            >
              Selecionar Concelho ({district})
            </Text>
            <FlatList
              data={selectedDistrictMunicipalities}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="border-b border-neutral/15 py-3"
                  onPress={() => handleMunicipalitySelect(item)}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel={item}
                >
                  <Text className="text-base text-neutral">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => setShowMunicipalityPicker(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
