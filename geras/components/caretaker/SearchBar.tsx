import * as React from 'react';
import { View, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type SearchBarProps = {
  searchValue: string;
  onSearchChange: (text: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchValue,
  onSearchChange,
}) => {
  return (
    <View className="h-16 w-full flex-row items-center rounded-full bg-white px-4 shadow-lg">
      <MaterialIcons
        name="search"
        size={22}
        color="#1d1d1b"
        style={{ marginRight: 8 }}
      />

      <TextInput
        value={searchValue}
        onChangeText={onSearchChange}
        placeholder="Procurar"
        placeholderTextColor="#1d1d1b"
        className="flex-1 text-lg text-neutral"
      />
    </View>
  );
};

export default SearchBar;
