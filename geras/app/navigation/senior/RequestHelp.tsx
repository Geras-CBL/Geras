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
        <ThemedText
          type="subtitle"
          style={{ fontSize: 16 }}
          accessibilityRole="header"
        >
          Olá Senhor António, o que precisa...
        </ThemedText>

        <View
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Pedir ajuda com Compras no Mercado"
          accessibilityHint="Toca duas vezes para abrir a tua lista de mercearias"
        >
          <RequestHelpButton
            iconName="shopping-cart"
            label="Compras Mercado"
            route={'../../navigation/senior/Groceries'}
          />
        </View>

        <View
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Pedir ajuda com Compras na Farmácia"
          accessibilityHint="Toca duas vezes para iniciar um novo pedido de medicamentos"
        >
          <RequestHelpButton
            iconName="local-pharmacy"
            label="Compras Farmácia"
            route={'../../navigation/senior/Requests?type=pharmacy'}
          />
        </View>

        <View
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Pedir ajuda com Tarefas Domésticas"
          accessibilityHint="Toca duas vezes para pedir ajuda com as limpezas de casa"
        >
          <RequestHelpButton
            iconName="cleaning-services"
            label="Tarefas Domésticas"
            route={'../../navigation/senior/Requests?type=cleaning'}
          />
        </View>

        <View
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Fazer Outros Pedidos"
          accessibilityHint="Toca duas vezes para fazer um pedido de ajuda personalizado"
        >
          <RequestHelpButton
            iconName="construction"
            label="Outros Pedidos"
            route={'../../navigation/senior/Requests?type=other'}
          />
        </View>
      </View>
      <BottomActions />
    </SafeAreaView>
  );
}
