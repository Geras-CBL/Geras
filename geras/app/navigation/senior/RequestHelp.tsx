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
          label="Compras Mercado"
          route={'../../navigation/senior/Groceries'}
        />

        <RequestHelpButton
          iconName="local-pharmacy"
          label="Compras Farmácia"
          route={'../../navigation/senior/Requests?type=pharmacy'}
        />

        <RequestHelpButton
          iconName="cleaning-services"
          label="Tarefas Domésticas"
          route={'../../navigation/senior/Requests?type=cleaning'}
        />

        <RequestHelpButton
          iconName="construction"
          label="Outros Pedidos"
          route={'../../navigation/senior/Requests?type=other'}
        />
      </View>
      <BottomActions />
    </SafeAreaView>
  );
}
