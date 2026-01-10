import { View, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { InfoPill } from '@/components/shared/InfoPill';
import SectionTitle from '@/components/shared/SectionTitle';
import ContainerVoluntario from '@/components/shared/ContainerVolunteer';
import BottomActions from '@/components/senior/BottomActions';
import { SafeAreaView } from 'react-native-safe-area-context';

const requestImages = {
  food: require('@/assets/images/food.png'),
  domestic: require('@/assets/images/domestic-tasks.png'),
  medicine: require('@/assets/images/medicine.png'),
};

export default function RequestDetails() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const requestType =
    type === 'food' || type === 'medicine' || type === 'domestic'
      ? type
      : 'domestic';

  // Dados do voluntário (pode vir da API)
  const volunteer = {
    name: 'Lucas William',
    age: 20,
    role: 'Estudante',
    avatarUri: undefined, // coloque uma URL se tiver foto
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 px-6 pb-56 pt-20"
    >
    <View className="gap-6">

      
      <View className="items-center">
        <Image
        source={requestImages[requestType]}
        style={{ height: 91 }}
        resizeMode="contain"
      />
      </View>

      <SectionTitle title="Tarefa Doméstica" />

      <ThemedText type="bodytitle">
        Estado da Tarefa
      </ThemedText>

      <InfoPill text="Completa" />

      <SectionTitle title="Descrição do Pedido" />

      <ThemedText className='-mt-4 mb-6' type="body">
        O Sr. António precisa de auxílio para limpar o pó da sala. Ele sofre de
        mobilidade reduzida, não conseguindo realizar esta tarefa sozinho.
      </ThemedText>

      <SectionTitle title="Voluntário" />

      {/* Container do voluntário */}
      <ContainerVoluntario 
        name={volunteer.name}
        age={volunteer.age}
        role={volunteer.role}
        avatarUri={volunteer.avatarUri} 
      />

      <SectionTitle title="Como correu a tarefa" />

      <SectionTitle title="Enviar Observação" />


      <BottomActions />
      
    </View>
    </SafeAreaView>
  );
}
