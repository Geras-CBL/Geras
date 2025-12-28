import React from "react";
import { Pressable, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";

interface SensorProps {
  name: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}

const SensorComponent = ({ name, iconName, isActive, onPress }: SensorProps) => {
  return (
    <View className="w-[48%] mb-4">
      <Pressable
        onPress={onPress}
        className={`w-full h-32 flex-row justify-center items-center gap-2 rounded-3xl
          ${isActive
            ? "bg-[#1E5128]"
            : "bg-white border border-slate-200 shadow-sm shadow-black/5"
          }`}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, elevation: isActive ? 0 : 3 })}
      >
        <MaterialIcons
          name={iconName}
          size={24}
          color={isActive ? "#FFFFFF" : "#000000"}
        />
        
        <ThemedText
          type="bodyBold"
          className={`${isActive ? "text-white" : "text-black"}`}
        >
          {name}
        </ThemedText>
      </Pressable>
    </View>
  );
};

export default SensorComponent;
