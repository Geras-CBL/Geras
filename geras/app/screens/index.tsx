import { Text, View, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-[#325439] gap-8">
      <Link href="/navigation/HomePage" asChild>
        <TouchableOpacity className="w-[70%] bg-[#9FBFA0] p-5 rounded-full items-center shadow-md active:opacity-80">
          <Text className="text-white text-2xl font-bold">Voluntário</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/navigation/HomePage" asChild>
        <TouchableOpacity className="w-[70%] bg-[#9FBFA0] p-5 rounded-full items-center shadow-md active:opacity-80">
          <Text className="text-white text-2xl font-bold">Cuidador</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/navigation/HomePage" asChild>
        <TouchableOpacity className="w-[70%] bg-[#9FBFA0] p-5 rounded-full items-center shadow-md active:opacity-80">
          <Text className="text-white text-2xl font-bold">Sénior</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
