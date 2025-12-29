import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center gap-8">
      <ThemedText type="title" className="text-primary">
        Homepage do Idoso
      </ThemedText>

      <Pressable
        onPress={() => router.push("./ErrorPage")}
        className="p-4 bg-secondary rounded-xl"
      >
        <ThemedText type="subtitle">Go to ErrorPage</ThemedText>
      </Pressable>
    </View>
  );
}
