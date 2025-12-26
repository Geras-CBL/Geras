import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function Vouchers() {
  return (
    <View className="flex-1 justify-center items-center">
      <ThemedText type="title" className="text-secondary">
        Vouchers Page
      </ThemedText>
    </View>
  );
}
