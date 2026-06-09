import { Pressable, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';

interface SensorProps {
  name: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  isActive: boolean;
  onPress: () => void;
}

const SensorComponent = ({
  name,
  iconName,
  isActive,
  onPress,
}: SensorProps) => {
  return (
    <View style={styles.wrapper}>
      <Pressable
        onPress={onPress}
        style={[
          styles.card,
          isActive ? styles.cardActive : styles.cardInactive,
        ]}
      >
        <MaterialIcons
          name={iconName}
          size={24}
          color={isActive ? '#FFFFFF' : '#000000'}
        />

        <ThemedText
          type="bodyBold"
          style={{ color: isActive ? '#FFFFFF' : '#000000' }}
        >
          {name}
        </ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
    marginBottom: 16,
  },
  card: {
    height: 128,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 24,
  },
  cardActive: {
    backgroundColor: '#205a2d',
  },
  cardInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default SensorComponent;
