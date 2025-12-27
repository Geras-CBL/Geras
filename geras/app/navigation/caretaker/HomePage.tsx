import { View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export default function HomePage() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        Homepage do Cuidador
      </ThemedText>
    </View>
  );
}