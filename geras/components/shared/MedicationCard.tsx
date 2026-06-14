import { TouchableOpacity, View, TextInput, Alert, Modal } from 'react-native';
import Button from './Button';
import { useState } from 'react';
import { ThemedText } from '../ThemedText';
import { MaterialIcons } from '@expo/vector-icons';


interface MedicationCardProps {
  id: number;
  metricType: string;
  title: string;
  status: 'Adequado' | 'Moderado' | 'Excessivo';
  value: number | string;
  unit: string;
  previousRecord?: {
    value_primary: number;
    value_secondary?: number | null;
    measured_at: string | null;
  };
  onEdit?: (id: number, valuePrimary: number, valueSecondary?: number | null) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onPress?: () => void;
}

//onPress deve expandir para mostrar mais informações, como histórico da medição anterior se tiver sido nas ultimas 48h-72h e possibilidade de alterar e eliminar medição.
const MedicationCard = ({
  id,
  metricType,
  title,
  status,
  value,
  unit,
  previousRecord,
  onEdit,
  onDelete,
  onPress,
}: MedicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editValuePrimary, setEditValuePrimary] = useState(() => {
    if (metricType === 'BLOOD PRESSURE' && typeof value === 'string') {
      return value.split('/')[0];
    }
    return String(value);
  });

  const [editValueSecondary, setEditValueSecondary] = useState(() => {
    if (metricType === 'BLOOD PRESSURE' && typeof value === 'string') {
      return value.split('/')[1] || '';
    }
    return '';
  });

  const showHistory = (() => {
    if (!previousRecord || !previousRecord.measured_at) return false;
    const measuredDate = new Date(previousRecord.measured_at);
    const now = new Date();
    const diffMs = now.getTime() - measuredDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Retorna true se a medição ocorreu há 72 horas ou menos
    return diffHours <= 72;
  })();

  const handleCancel = () => {
    setIsEditing(false);

    if (metricType === 'BLOOD PRESSURE' && typeof value === 'string') {
      const parts = value.split('/');
      setEditValuePrimary(parts[0]);
      setEditValueSecondary(parts[1] || '');
    } else {
      setEditValuePrimary(String(value));
    }
  };

  const handleSave = async () => {
    const primaryVal = parseFloat(String(editValuePrimary));
    if (isNaN(primaryVal)) {
      Alert.alert('Valor Inválido', 'Por favor introduza um número válido.');
      return;
    }
    let secondaryVal: number | null = null;
    if (metricType === 'BLOOD PRESSURE') {
      secondaryVal = parseFloat(String(editValueSecondary));
      if (isNaN(secondaryVal)) {
        Alert.alert('Valor Inválido', 'Por favor introduza um valor diastólico (mínimo) válido.');
        return;
      }
    }
    setIsEditing(false);
    setIsExpanded(false);
    setTimeout(async () => {
      try {
        if (onEdit) {
          await onEdit(id, primaryVal, secondaryVal);
        }
      } catch (error: any) {
        console.error('Erro ao guardar a medição:', error);
        Alert.alert('Erro', error?.message || 'Não foi possível guardar as alterações.');
      }
    }, 300);
  };


  const handleDeletePress = () => {
    Alert.alert(
      'Eliminar Medição',
      'Tem a certeza que deseja eliminar esta medição de forma permanente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsExpanded(false);
              if (onDelete) {
                await onDelete(id);
              }
            } catch (error) {
              console.error('Erro ao eliminar a medição:', error);
              Alert.alert('Erro', 'Não foi possível eliminar a medição.');
            }
          },
        },
      ],
    );
  };

  let color = 'primary';
  if (status === 'Moderado') {
    color = 'secondary';
  } else if (status === 'Excessivo') {
    color = 'tertiary';
  }
  return (
    <>
      <TouchableOpacity
        className="h-full w-full items-start justify-around rounded-3xl bg-white p-4 shadow-2xl"
        activeOpacity={0.7}
        onPress={() => setIsExpanded(true)}
      >
        <ThemedText type="subtitle" style={{ fontSize: 18 }} className="text-neutral">
          {title}
        </ThemedText>
        <View className="flex-row gap-4">
          <View className={`rounded-full bg-${color} p-4`} />
          <ThemedText type="bodyBold" style={{ fontSize: 20 }}>
            {value} {unit}
          </ThemedText>
        </View>
        <ThemedText>{status}</ThemedText>
      </TouchableOpacity>

      {/* MODAL EXPANDIDO E CENTRADO */}
      <Modal
        visible={isExpanded}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          if (!isEditing) setIsExpanded(false);
        }}
      >
        {/* Fundo Escuro do Modal (Backdrop) */}
        <TouchableOpacity
          className="flex-1 justify-center items-center p-6"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          activeOpacity={1}
          onPress={() => {
            // Fecha ao clicar fora, mas só se não estiver a editar
            if (!isEditing) setIsExpanded(false);
          }}
        >
          {/* Caixa Centrada do Card Expandido */}
          <TouchableOpacity
            activeOpacity={1} // Impede que cliques dentro do card fechem o modal
            className="w-full max-w-[340px] bg-white rounded-3xl p-6 gap-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 15,
              elevation: 10, // Para Android
            }}
          >
            {/* Título e Valor no Modal */}
            <ThemedText type="subtitle" style={{ fontSize: 20 }} className="text-neutral">
              {title}
            </ThemedText>

            <View className="flex-row gap-4 items-center">
              <View className={`rounded-full bg-${color} p-4`} />
              <ThemedText type="bodyBold" style={{ fontSize: 24 }}>
                {value} {unit}
              </ThemedText>
            </View>

            <ThemedText>{status}</ThemedText>

            {isEditing ? (
              <View key="edit-mode" className="w-full gap-3">
                {metricType === 'BLOOD PRESSURE' ? (
                  <View className="flex-row gap-2 w-full">
                    <View className="flex-1 gap-1">
                      <ThemedText style={{ fontSize: 12 }} className="text-gray-500">Sistólica</ThemedText>
                      <TextInput
                        className="bg-gray-100 p-2 rounded-xl text-neutral text-base border border-gray-200"
                        value={String(editValuePrimary)}
                        onChangeText={setEditValuePrimary}
                        keyboardType="numeric"
                        placeholder="Max"
                      />
                    </View>
                    <View className="flex-1 gap-1">
                      <ThemedText style={{ fontSize: 12 }} className="text-gray-500">Diastólica</ThemedText>
                      <TextInput
                        className="bg-gray-100 p-2 rounded-xl text-neutral text-base border border-gray-200"
                        value={String(editValueSecondary)}
                        onChangeText={setEditValueSecondary}
                        keyboardType="numeric"
                        placeholder="Min"
                      />
                    </View>
                  </View>
                ) : (
                  <View className="gap-1 w-full">
                    <ThemedText style={{ fontSize: 12 }} className="text-gray-500">Novo Valor ({unit})</ThemedText>
                    <TextInput
                      className="bg-gray-100 p-2 rounded-xl text-neutral text-base border border-gray-200 w-full"
                      value={String(editValuePrimary)}
                      onChangeText={setEditValuePrimary}
                      keyboardType="numeric"
                      placeholder="Valor"
                    />
                  </View>
                )}
                {/* Botões do modo Edição */}
                <View className="flex-row gap-4 justify-between mt-2">
                  <Button key="cancel-btn" title="Cancelar" variant="outlined" className="flex-1" onPress={handleCancel} />
                  <Button key="save-btn" title="Guardar" variant="default" className="flex-1" onPress={handleSave} />
                </View>
              </View>
            ) : (
              <View key="view-mode" className="w-full gap-3">
                {showHistory ? (
                  <View key="history-container" className="bg-gray-50 p-3 rounded-xl">
                    <ThemedText type="bodyBold" style={{ fontSize: 14 }}>Medição Anterior:</ThemedText>
                    <ThemedText type="body">
                      {previousRecord?.value_primary}
                      {metricType === 'BLOOD PRESSURE' && previousRecord?.value_secondary ? `/${previousRecord.value_secondary}` : ''} {unit}
                    </ThemedText>
                  </View>
                ) : null}
                {/* Botões do modo Visualização */}
                <View key="view-buttons-container" className="flex-row gap-4 justify-between mt-2">
                  <Button key="delete-btn" title="Eliminar" variant="destructive" className="flex-1" onPress={handleDeletePress} />
                  <Button key="edit-btn" title="Editar" variant="outlined" className="flex-1" onPress={() => setIsEditing(true)} />
                </View>
              </View>
            )}

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default MedicationCard;

export const AddMedicationCard = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      className="h-full w-full items-center justify-evenly rounded-3xl bg-white p-5 shadow-xl"
      activeOpacity={0.7}
      onPress={onPress}
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
