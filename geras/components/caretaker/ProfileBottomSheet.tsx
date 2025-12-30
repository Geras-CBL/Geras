import * as React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { profilesData, SeniorProfile } from '@/data/profilesData';

type ProfileBottomSheetRef = BottomSheetModal;
type ProfileBottomSheetProps = {
  onSelectProfile: (profile: { name: string; age: number }) => void;
};

const ProfileBottomSheet = React.forwardRef<
  ProfileBottomSheetRef,
  ProfileBottomSheetProps
>(({ onSelectProfile }, ref) => {
  const snapPoints = React.useMemo(() => ['55%'], []);

  const [profilesState, setProfilesState] =
    React.useState<SeniorProfile[]>(profilesData);

  const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const handleProfileSelect = (selectedProfile: SeniorProfile) => {
    setProfilesState((prev) =>
      prev.map((p) => ({
        ...p,
        selected: p.id === selectedProfile.id,
      })),
    );

    onSelectProfile({ name: selectedProfile.name, age: selectedProfile.age });

    const modalRef = ref as React.RefObject<BottomSheetModal>;
    modalRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: '#FFFFFF', borderRadius: 32 }}
      handleIndicatorStyle={{
        backgroundColor: '#205a2d',
        width: 35,
        height: 6,
        borderRadius: 7,
      }}
    >
      <BottomSheetView className="flex-1 px-8 pb-16 pt-3">
        <ThemedText type="title" className="mb-6 text-center">
          Selecionar Perfil do Sénior
        </ThemedText>

        <View className="gap-5">
          {profilesState.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              onPress={() => handleProfileSelect(profile)}
              activeOpacity={0.8}
              className={`h-[148px] flex-row items-center justify-between rounded-2xl p-6 shadow-sm ${
                profile.selected
                  ? 'bg-[#2A793B]/40 shadow-green-900/20'
                  : 'bg-[#FBFBFB] shadow-black/10'
              }`}
            >
              <View className="flex-row items-center gap-5">
                {profile.image ? (
                  <Image
                    source={profile.image}
                    className="h-[100px] w-[100px] rounded-lg bg-gray-300"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-[100px] w-[100px] items-center justify-center rounded-lg bg-gray-200">
                    <Ionicons name="person" size={80} color="#205a2d" />
                  </View>
                )}

                <View className="h-[94px] justify-center gap-2">
                  <Text className="font-[Rubik-Bold] text-base font-semibold uppercase text-[#1d1d1b]">
                    {profile.name}
                  </Text>
                  <Text className="font-[Rubik] text-sm text-[#1d1d1b]">
                    {profile.age} anos
                  </Text>
                </View>
              </View>

              <View>
                {profile.selected ? (
                  <Ionicons name="radio-button-on" size={24} color="#1d1d1b" />
                ) : (
                  <Ionicons name="radio-button-off" size={24} color="#1d1d1b" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ProfileBottomSheet.displayName = 'ProfileBottomSheet';
export default ProfileBottomSheet;
