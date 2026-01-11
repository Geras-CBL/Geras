import { Link } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center gap-8 bg-[#325439]">
      <Link href="/navigation/volunteer/HomePage" asChild>
        <TouchableOpacity className="w-[70%] items-center rounded-full bg-[#9FBFA0] p-5 shadow-md active:opacity-80">
          <Text className="text-2xl font-bold text-white">Voluntário</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/navigation/caretaker/HomePage" asChild>
        <TouchableOpacity className="w-[70%] items-center rounded-full bg-[#9FBFA0] p-5 shadow-md active:opacity-80">
          <Text className="text-2xl font-bold text-white">Cuidador</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/navigation/senior/HomePage" asChild>
        <TouchableOpacity className="w-[70%] items-center rounded-full bg-[#9FBFA0] p-5 shadow-md active:opacity-80">
          <Text className="text-2xl font-bold text-white">Sénior</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
