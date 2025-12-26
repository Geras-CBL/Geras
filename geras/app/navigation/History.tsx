import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function History() {
  return (
    <View className="flex-1 items-center justify-center">
      <ThemedText type="title" className="text-primary">
        History Page
      </ThemedText>
    </View>
  );
}
