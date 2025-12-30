import * as React from 'react';
import { View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { SeniorProfile } from '@/data/profilesData';

interface ProfilePickerProps {
  onPress?: () => void;
  profile: SeniorProfile;
}

const ProfilePicker: React.FC<ProfilePickerProps> = ({ onPress, profile }) => {
  const initials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Pressable
      onPress={onPress}
      className="w-full flex-1 flex-row items-center gap-2"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View className="h-[50px] w-[50px] items-center justify-center rounded-full border border-secondary bg-secondary/50">
        <ThemedText type="subtitle">{initials}</ThemedText>
      </View>

      <ThemedText type="subtitle">{profile.name}</ThemedText>

      <MaterialIcons name="keyboard-arrow-down" size={18} color="#1d1d1b" />
    </Pressable>
  );
};

export default ProfilePicker;
