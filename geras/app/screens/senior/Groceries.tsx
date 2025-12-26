import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function Groceries() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        Alimentação Disponivel
      </ThemedText>

      <ThemedText type="title" className="text-primary">
        Lista de Produtos: Leite, Pão, Ovos, Frutas, ETC
      </ThemedText>
    </View>
  );
}
