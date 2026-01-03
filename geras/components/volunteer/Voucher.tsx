import React from "react";
import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";

// Props para o componente Voucher
interface VoucherProps {
  name_store: string;
  address: string;
  value: string;
  currentTasks: number;
  totalTasks: number;
  onPress: () => void; // Função para abrir a bottom sheet
}

const Voucher = ({  
name_store,
address, 
value, 
currentTasks, 
totalTasks, 
  onPress 
}: VoucherProps) => {

  // Calcula a percentagem para a barra de progresso
  const progressPercentage = Math.min((currentTasks / totalTasks) * 100, 100);

  return (
    <Pressable 
      onPress={onPress}
      className="bg-white p-4 gap-4 rounded-xl shadow-sm mx-1 my-2 w-10/12"
      // O 'elevation' (Android) e shadow específico muitas vezes precisam de style inline ou config extra no tailwind
      style={{ elevation: 5, shadowColor: "#000", shadowOpacity: 0.25, shadowRadius: 3.84, shadowOffset: { width: 0, height: 2 } }}
    >
      {/* --- Secção Superior: Informação e Valor --- */}
      <View className="flex-row justify-between items-start gap-5">
        
        {/* Texto Esquerda */}
        <View className="flex-1 gap-2">
          <ThemedText type="subtitle" className="text-neutral uppercase text-base">
            {name_store}
          </ThemedText>
          <ThemedText className="text-neutral capitalize text-base">
            {address}
          </ThemedText>
        </View>

        {/* Chip de Valor (Direita) */}
        <View className="bg-primary rounded-full px-4 py-2 justify-center items-center">
          <ThemedText className="text-neutralLight text-base">
            {value}
          </ThemedText>
        </View>
      </View>

      {/* --- Secção Inferior: Progresso --- */}
      <View className="gap-2 w-full">
        <View className="flex-row justify-between ">
          <ThemedText type="bodyBold" className="text-primary text-left">
            {currentTasks}/{totalTasks}
          </ThemedText>
          <ThemedText className="text-neutral text-base text-right">
            Tarefas completadas
          </ThemedText>
        </View>

        {/* Barra de Progresso */}
        {/* Barra Cinzenta (Fundo) */}
        <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          {/* Barra Verde (Preenchimento) */}
          <View 
            className="h-full bg-primary rounded-full" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </View>
      </View>

    </Pressable>
  );
};

export default Voucher;