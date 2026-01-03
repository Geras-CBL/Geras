import { Button, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useFontScale } from '@/components/FontContext';

export default function Settings() {
  const { scale, setScale } = useFontScale();

  return (
    <View style={{ flex: 1, padding: 20, gap: 20, marginTop: 120 }}>
      <ThemedText type="title">Accessibility Settings</ThemedText>

      <ThemedText type="body">Current Scale: {scale.toFixed(1)}x</ThemedText>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button title="Normal (1x)" onPress={() => setScale(1.0)} />
        <Button title="Large (1.2x)" onPress={() => setScale(1.2)} />
        <Button title="Extra Large (1.5x)" onPress={() => setScale(1.5)} />
      </View>

      <ThemedText type="body">
        This is a preview of how the body text will look as you change the
        settings above.
      </ThemedText>
    </View>
  );
}
