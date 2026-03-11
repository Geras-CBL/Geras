import { View, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface AvatarProps {
  uri?: string | null;
  alt?: string;
}

const Avatar = ({ uri, alt }: AvatarProps) => {
  return (
    <View className="relative h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-secondary bg-secondary/50">
      {uri ? (
        <Image
          source={{ uri }}
          className="h-full w-full rounded-full"
          resizeMode="cover"
          alt={alt || "Foto de perfil do utilizador"}
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={alt || "Foto de perfil do utilizador"}
        />
      ) : (
        <ThemedText type="title" className="momo font-bold text-neutral">
          AS
        </ThemedText>
      )}

      <View className="absolute bottom-2 right-2 z-10 h-8 w-8 items-center justify-center rounded-full border border-white bg-neutral">
        <MaterialIcons name="photo-camera" size={16} color="white" />
      </View>
    </View>
  );
};

export default Avatar;
