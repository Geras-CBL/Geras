import React, { createContext, useContext, useState } from 'react';
import { profilesData, SeniorProfile } from '@/data/profilesData';

interface ProfileContextType {
  selectedProfile: SeniorProfile;
  handleSelectProfile: (profile: { name: string }) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [selectedProfile, setSelectedProfile] = useState<SeniorProfile>(
    profilesData.find((p) => p.selected) || profilesData[0],
  );

  const handleSelectProfile = React.useCallback(
    (profile: { name: string }) => {
      const newSelected = profilesData.find((p) => p.name === profile.name);
      if (newSelected) setSelectedProfile(newSelected);
    },
    [setSelectedProfile],
  );

  const contextValue = React.useMemo(
    () => ({ selectedProfile, handleSelectProfile }),
    [selectedProfile, handleSelectProfile],
  );

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
