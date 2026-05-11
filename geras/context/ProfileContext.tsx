import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { SeniorProfile } from '@/data/profilesData';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface ProfileContextType {
  selectedProfile: SeniorProfile | null;
  profiles: SeniorProfile[];
  isLoading: boolean;
  handleSelectProfile: (profile: { id: string }) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { profile: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<SeniorProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<SeniorProfile | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfiles = useCallback(async () => {
    if (!currentUser?.id) {
      console.log('ProfileContext: No current user ID yet');
      setIsLoading(false);
      return;
    }

    console.log(
      'ProfileContext: Fetching seniors for caretaker ID:',
      currentUser.id,
    );

    try {
      // 1. Tentar com id_senior / id_caretaker (padrão snake_case do projeto)
      let { data: associations, error: assocError } = await supabase
        .from('senior_caretaker')
        .select('id_senior')
        .eq('id_caretaker', currentUser.id);

      // 2. Se falhar ou não encontrar nada, tentar com senior_id / caretaker_id (padrão comum)
      if (assocError || !associations || associations.length === 0) {
        console.log(
          'ProfileContext: Falling back to alternative column names...',
        );
        const { data: assocAlt, error: assocErrorAlt } = await supabase
          .from('senior_caretaker')
          .select('senior_id')
          .eq('caretaker_id', currentUser.id);

        if (!assocErrorAlt && assocAlt && assocAlt.length > 0) {
          associations = assocAlt.map((a) => ({ id_senior: a.senior_id }));
          assocError = null;
        }
      }

      if (assocError) throw assocError;

      if (associations && associations.length > 0) {
        const seniorIds = associations.map((a) => a.id_senior);
        console.log('ProfileContext: Found senior IDs:', seniorIds);

        const { data: seniors, error: seniorsError } = await supabase
          .from('users')
          .select('*')
          .in('id', seniorIds);

        if (seniorsError) throw seniorsError;

        if (seniors) {
          const mappedProfiles: SeniorProfile[] = seniors.map((s, index) => ({
            id: s.id.toString(),
            name: s.name,
            age: 0,
            email: s.email,
            password: '********',
            birthDate: '',
            country: 'Portugal',
            image: null,
            selected: index === 0,
            alt: `Foto do perfil de ${s.name}`,
          }));

          setProfiles(mappedProfiles);
          setSelectedProfile(mappedProfiles[0]);
          console.log(
            'ProfileContext: Successfully loaded profiles:',
            mappedProfiles.length,
          );
        }
      } else {
        console.log(
          'ProfileContext: No associations found in senior_caretaker',
        );
      }
    } catch (err) {
      console.error('ProfileContext: Erro ao carregar perfis associados:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSelectProfile = useCallback(
    (profile: { id: string }) => {
      const newSelected = profiles.find((p) => p.id === profile.id);
      if (newSelected) {
        setSelectedProfile(newSelected);
        setProfiles((prev) =>
          prev.map((p) => ({
            ...p,
            selected: p.id === profile.id,
          })),
        );
      }
    },
    [profiles],
  );

  const contextValue = useMemo(
    () => ({ selectedProfile, profiles, isLoading, handleSelectProfile }),
    [selectedProfile, profiles, isLoading, handleSelectProfile],
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
