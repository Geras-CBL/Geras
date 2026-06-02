import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';

interface MedicationCardProps {
  title: string;
  status: 'Adequado' | 'Moderado' | 'Excessivo';
  value: number;
  unit: string;
  onPress?: () => void;
}

const MedicationCard = ({
  title,
  status,
  value,
  unit,
  onPress,
}: MedicationCardProps) => {
  let color = 'primary';
  if (status === 'Moderado') {
    color = 'secondary';
  } else if (status === 'Excessivo') {
    color = 'tertiary';
  }
  return (
    <TouchableOpacity
      className="h-full w-full items-start justify-around rounded-3xl bg-white p-4 shadow-2xl"
      activeOpacity={onPress ? 0.7 : 1}
      onPress={onPress}
      accessible={true}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`Métrica ${title}: ${value} ${unit}, Estado: ${status}`}
      accessibilityHint={
        onPress ? 'Toca duas vezes para ver detalhes' : undefined
      }
    >
      <ThemedText
        type="subtitle"
        style={{ fontSize: 18 }}
        className="text-neutral"
      >
        {title}
      </ThemedText>
      <View className="flex-row gap-4">
        <View className={`rounded-full bg-${color} p-4`} />
        <ThemedText type="bodyBold" style={{ fontSize: 20 }} className="">
          {value} {unit}
        </ThemedText>
      </View>
      <ThemedText>{status}</ThemedText>
    </TouchableOpacity>
  );
};

export default MedicationCard;

export const AddMedicationCard = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      className="h-full w-full items-center justify-evenly rounded-3xl bg-white p-5 shadow-xl"
      activeOpacity={0.7}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Adicionar métrica"
      accessibilityHint="Toca duas vezes para registar uma nova métrica de saúde"
    >
      <ThemedText
        type="subtitle"
        style={{ fontSize: 18 }}
        className="text-center"
      >
        Adicionar métrica
      </ThemedText>
      <MaterialIcons name="add" size={64} color="#1d1d1b" />
    </TouchableOpacity>
  );
};
