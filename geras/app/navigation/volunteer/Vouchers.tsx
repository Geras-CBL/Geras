import { View, Pressable, FlatList } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Voucher from '@/components/volunteer/Voucher';
import { useRouter } from 'expo-router';
import { useState } from 'react';

// Dados fictícios para "automatizar" - Usar API/json mais tarde
const mockVouchers = [
  { id: '1', name_store: "Supermercado Lili & Co", address: "Rua da Glória, 123", value: "2%", currentTasks: 3, totalTasks: 5 },
  { id: '2', name_store: "Livraria Central", address: "Rua da Glória, 3", value: "5%", currentTasks: 3, totalTasks: 5 },
  { id: '3', name_store: "Padaria do Bairro", address: "Rua da Glória, 13", value: "2%", currentTasks: 2, totalTasks: 5 },
  { id: '4', name_store: "Supermercados Eduardo", address: "Rua da Glória, 12", value: "10%", currentTasks: 1, totalTasks: 5 },
  { id: '5', name_store: "Ferraria Mateus", address: "Rua da Glória, 1", value: "5%", currentTasks: 0, totalTasks: 5 },
];

export default function Vouchers() {
  const router = useRouter();
  // Estado inicializado em 'disponiveis'
  const [activeTab, setActiveTab] = useState<"disponiveis" | "usados">("disponiveis");

  // Lógica para gerir a troca de tabs
  const handleTabPress = (tab: "disponiveis" | "usados") => {
    setActiveTab(tab);

    if (tab === "usados") {
      // Como a página UsedVouchers é feita à parte, navegamos para lá
      router.push("./UsedVouchers"); 
      console.log("Navegar para página de Usados"); 
    }
  };

  return (
    <View className="flex-1 justify-center mt-16"> 

      {/* Título */}
      <View className="mb-6 mt-10">
        <ThemedText type="title" className="text-neutral text-left ml-10">
          Vouchers
        </ThemedText>
      </View>

      {/* Tabs / Botões */}
      <View className="flex-row w-full h-[35px] mb-6 px-6 rounded-2xl">
        
        {/* Tab Disponíveis */}
        <Pressable 
          onPress={() => handleTabPress("disponiveis")}
          className={`flex-1 justify-center items-center rounded-l-2xl ${
            activeTab === "disponiveis" ? "bg-primary" : "bg-white"
          }`}
        >
          <ThemedText 
            type="body"
            className={` uppercase ${
              activeTab === "disponiveis" ? "text-white" : "text-[#1d1d1b]"
            }`}
          >
            disponíveis
          </ThemedText>
        </Pressable>

        {/* Tab Usados */}
        <Pressable 
          onPress={() => handleTabPress("usados")}
          className={`flex-1 justify-center items-center rounded-r-2xl ${
            activeTab === "usados" ? "bg-primary" : "bg-white"
          }`}
        >
          <ThemedText 
            type="body"
            className={` uppercase ${
              activeTab === "usados" ? "text-white" : "text-[#1d1d1b]"
            }`}
          >
            usados
          </ThemedText>
        </Pressable>
      </View>

      {/* Lista de Vouchers Automatizada */}
      <View className="flex-1 w-full ml-8 mb-35">
        <FlatList
          data={mockVouchers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Voucher 
              name_store={item.name_store} 
              address={item.address}
              value={item.value}
              currentTasks={item.currentTasks}
              totalTasks={item.totalTasks}
              onPress={() => console.log(`Voucher ${item.name_store} pressionado`)}
            />
          )}
          // Caso a lista esteja vazia
          ListEmptyComponent={() => (
             <View className="flex-1 items-center justify-center mt-10">
                <ThemedText type="bodyInfo" className="text-neutral">
                   Não há vouchers disponíveis.
                </ThemedText>
             </View>
          )}
        />
      </View>
      
    </View>
  );
}