import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function HomePage() {
  return (
    <View className="flex-1 justify-center items-center bg-background gap-8">
      <ThemedText type="title" className="text-primary">
        Themed title
      </ThemedText>

      <ThemedText type="subtitle" className="text-secondary">Themed subtitle</ThemedText>

      <ThemedText type="bodyBold" className="text-neutral">Themed bold</ThemedText>

      <ThemedText type="body" className="text-tertiary">Themed body</ThemedText>
    </View>
  );
}
