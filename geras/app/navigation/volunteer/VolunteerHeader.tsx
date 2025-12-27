import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GerasLogo from "../../../assets/logo/GerasLogo.svg";

interface VolunteerHeaderProps {
  leftIconName?: keyof typeof MaterialIcons.glyphMap;
  rightIconName?: keyof typeof MaterialIcons.glyphMap;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const VolunteerHeader: React.FC<VolunteerHeaderProps> = ({
  leftIconName = "person",
  rightIconName = "notifications",
  onLeftPress,
  onRightPress,
}) => {
  return (
    <SafeAreaView edges={["top"]} className="bg-transparent w-full">
      <View className="flex-row items-center justify-between px-5">
        <TouchableOpacity
          onPress={onLeftPress}
          className="p-2 items-center justify-center"
        >
          <MaterialIcons name={leftIconName} size={28} color="black" />
        </TouchableOpacity>

        <View className="flex-1 items-center justify-center">
          <GerasLogo width={100} height={30} />
        </View>

        <TouchableOpacity
          onPress={onRightPress}
          className="p-2 items-center justify-center"
        >
          <MaterialIcons name={rightIconName} size={28} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
