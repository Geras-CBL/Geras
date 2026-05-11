import * as React from 'react';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { SeniorProfile } from '@/data/profilesData';
import { useProfile } from '@/context/ProfileContext';

type ProfileBottomSheetRef = BottomSheetModal;
type ProfileBottomSheetProps = {
  onSelectProfile: (profile: { id: string }) => void;
};

const ProfileBottomSheet = React.forwardRef<
  ProfileBottomSheetRef,
  ProfileBottomSheetProps
>(({ onSelectProfile }, ref) => {
  const snapPoints = React.useMemo(() => ['55%'], []);
  const { profiles, isLoading } = useProfile();

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
    onSelectProfile({ id: selectedProfile.id });

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

        {isLoading ? (
          <ActivityIndicator size="large" color="#205a2d" className="mt-10" />
        ) : (
          <View className="gap-5">
            {profiles.map((profile) => (
              <TouchableOpacity
                key={profile.id}
                onPress={() => handleProfileSelect(profile)}
                activeOpacity={0.8}
                className={`h-42 flex-row items-center justify-between rounded-2xl p-6 shadow-sm ${
                  profile.selected
                    ? 'bg-primary/40 shadow-green-200/20'
                    : 'bg-neutralLight shadow-black/10'
                }`}
              >
                <View className="flex-row items-center gap-5">
                  {profile.image ? (
                    <Image
                      source={profile.image}
                      className="h-42 w-42 rounded-lg bg-gray-300"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-42 w-42 items-center justify-center rounded-lg bg-gray-200">
                      <Ionicons name="person" size={80} color="#205a2d" />
                    </View>
                  )}

                  <View className="h-42 justify-center gap-2">
                    <ThemedText
                      type="bodyBold"
                      className="uppercase text-neutral"
                    >
                      {profile.name}
                    </ThemedText>

                    {profile.age > 0 && (
                      <ThemedText type="bodyInfo" className="text-neutral">
                        {profile.age} anos
                      </ThemedText>
                    )}
                  </View>
                </View>

                <View>
                  {profile.selected ? (
                    <Ionicons
                      name="radio-button-on"
                      size={24}
                      color="#1d1d1b"
                    />
                  ) : (
                    <Ionicons
                      name="radio-button-off"
                      size={24}
                      color="#1d1d1b"
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
            {profiles.length === 0 && (
              <ThemedText type="body" className="mt-10 text-center">
                Nenhum idoso associado.
              </ThemedText>
            )}
          </View>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ProfileBottomSheet.displayName = 'ProfileBottomSheet';
export default ProfileBottomSheet;
