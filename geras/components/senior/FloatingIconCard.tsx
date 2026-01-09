import { View } from 'react-native';
import RequestCardBackground from '@/components/senior/RequestCardBackground';
import { MaterialIcons } from '@expo/vector-icons';

interface FloatingIconCardProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
  onClose?: () => void;
}

export default function FloatingIconCard({
  icon,
  children,
  actions,
  onClose,
}: Readonly<FloatingIconCardProps>) {
  return (
    <View className="relative mt-8 w-full flex-1">
      <RequestCardBackground />

      <View className="absolute -top-12 left-0 right-0 z-20 items-center justify-center">
        <View className="h-24 w-24 items-center justify-center rounded-full border-4 border-gray-50 bg-primary">
          {icon}
        </View>
      </View>

      <View className="flex-1 gap-4 px-6 pb-10 pt-6">
        <View className="mb-4 flex-row items-center justify-end">
          <MaterialIcons
            name="close"
            className="pr-4"
            size={30}
            color="#0000"
            onPress={onClose}
          />
        </View>

        <View className="flex-1">{children}</View>

        {actions && <View className="w-full items-center">{actions}</View>}
      </View>
    </View>
  );
}
