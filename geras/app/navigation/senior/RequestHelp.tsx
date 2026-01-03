import BottomActions from '@/components/senior/BottomActions';
import RequestHelpButton from '@/components/senior/RequestHelpButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { ThemedText } from '@/components/ThemedText';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RequestHelp() {
  return (
    <SafeAreaView
      edges={['top']}
      className="h-full flex-1 justify-around px-6 pb-56 pt-24"
    >
      <SectionTitle title="Pedir Ajuda" />
      <View className="h-full flex-col justify-around">
        <ThemedText type="subtitle" style={{ fontSize: 16 }}>
          Olá Senhor António, o que precisa...
        </ThemedText>
        <RequestHelpButton
          iconName="shopping-cart"
          label="Compras mercado"
          route={'../../navigation/senior/Groceries'}
        />
        <RequestHelpButton
          iconName="local-pharmacy"
          label="Compras farmácia"
          route={'../../navigation/senior/PharmacyShopping'}
        />
        <RequestHelpButton
          iconName="cleaning-services"
          label="Tarefas domésticas"
          route={'../../navigation/senior/HouseHoldTasks'}
        />
        <RequestHelpButton
          iconName="construction"
          label="Outros pedidos"
          route={'../../navigation/senior/OtherRequests'}
        />
      </View>
      <BottomActions />
    </SafeAreaView>
  );
}
