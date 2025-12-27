import { ThemedText } from "@/components/ThemedText";
import { View } from "react-native";

export default function NotFound() {
    return (
        <View className="flex-1 items-center justify-center">
            <ThemedText type="title" className="text-primary">
                Página Não Encontrada 404
            </ThemedText>
        </View>
    );
}