import {
  ScrollView,
  View,
  Platform,
  Modal,
  TouchableOpacity,
  Text,
  FlatList,
} from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

import SectionTitle from '@/components/shared/SectionTitle';
import { FormField } from '@/components/shared/FormField';
import Button from '@/components/shared/Button';
import { profilesData, SeniorProfile } from '@/data/profilesData';
import Avatar from '@/components/shared/Avatar';

const countryOptions = [
  'Portugal',
  'Espanha',
  'França',
  'Alemanha',
  'Brasil',
  'Itália',
  'Reino Unido',
];

export default function EditProfile() {
  const activeProfile: SeniorProfile = profilesData.find(
    (p) => p.selected,
  ) as SeniorProfile;

  const [name, setName] = useState(activeProfile.name);
  const [email, setEmail] = useState(activeProfile.email);
  const [password, setPassword] = useState(activeProfile.password);
  const [birthDate, setBirthDate] = useState(activeProfile.birthDate);
  const [country, setCountry] = useState(activeProfile.country);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleSave = () => {
    const updatedProfile = {
      ...activeProfile,
      name,
      email,
      password,
      birthDate,
      country,
    };
    console.log('Guardar perfil:', updatedProfile);
  };

  const handleCancel = () => {
    setName(activeProfile.name);
    setEmail(activeProfile.email);
    setPassword(activeProfile.password);
    setBirthDate(activeProfile.birthDate);
    setCountry(activeProfile.country);
    console.log('Edição cancelada');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString();
      setBirthDate(formattedDate);
    }
  };

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setShowCountryPicker(false);
  };

  return (
    <ScrollView
      className="flex-1 pt-24"
      contentContainerStyle={{ padding: 20, paddingBottom: 130 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Avatar */}
      <View className="mb-6 items-center">
        <Avatar />
      </View>

      {/* FORM */}
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
        />

        <SectionTitle title="Password" />
        <FormField
          className="-mt-6"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <SectionTitle title="Data de nascimento" />
        <FormField
          className="-mt-6"
          variant="dropdown"
          value={birthDate}
          onPress={() => setShowDatePicker(true)}
        />

        <SectionTitle title="País/Região" />
        <FormField
          className="-mt-6"
          variant="dropdown"
          value={country}
          onPress={() => setShowCountryPicker(true)}
        />
      </View>

      {/* ACTIONS */}
      <View className="mt-10 w-full gap-4">
        <Button title="Guardar" onPress={handleSave} />
        <Button title="Cancelar" variant="outlined" onPress={handleCancel} />
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={birthDate ? new Date(birthDate) : new Date()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCountryPicker(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="max-h-96 rounded-t-xl bg-white p-4">
            <Text className="mb-4 text-center text-lg font-bold">
              Selecionar País
            </Text>
            <FlatList
              data={countryOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="border-b border-neutral/15 py-3"
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text className="text-base text-neutral">{item}</Text>
                </TouchableOpacity>
              )}
            />
            <Button
              title="Cancelar"
              variant="outlined"
              onPress={() => setShowCountryPicker(false)}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
