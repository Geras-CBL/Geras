import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

interface AddButtonComponentProps {
  onPress?: () => void;
  title?: string;
}

const AddButtonComponent = ({ onPress, title = "Adicionar" }: AddButtonComponentProps) => {
  return (
    <View className="w-full mt-4"> 
      <TouchableOpacity 
        onPress={onPress}
        activeOpacity={0.7}
        className="bg-primary rounded-lg py-4 items-center justify-center shadow-black/10 shadow-md elevation-5 w-full"
      >
        <Text className="text-[#fbfbfb] text-base capitalize font-['Rubik-Regular'] text-center">
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddButtonComponent;
