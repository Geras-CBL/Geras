import { useEffect } from 'react';
import { View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import BottomActions from '@/components/senior/BottomActions';
import FloatingIconCard from '@/components/senior/FloatingIconCard';
import Button from '@/components/shared/Button';

const NUM_BARS = 40;

const WaveBar = ({ index }: { index: number }) => {
  const height = useSharedValue(15);

  useEffect(() => {
    const randomHeight = Math.random() * 35 + 15;
    const duration = Math.random() * 300 + 400;

    height.value = withDelay(
      index * 50,
      withRepeat(
        withTiming(randomHeight, {
          duration: duration,
          easing: Easing.inOut(Easing.quad),
        }),
        -1,
        true,
      ),
    );
  }, [height, index]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      className="mx-[1.5px] mt-12 w-1 rounded-full bg-primary"
      style={animatedStyle}
    />
  );
};

const AudioWaveform = () => (
  <View className="mb-8 h-8 w-full flex-row items-center justify-center">
    {Array.from({ length: NUM_BARS }).map((_, i) => (
      <WaveBar key={i} index={i} />
    ))}
  </View>
);

export default function VoicePage() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const renderCardContent = () => (
    <View className="w-full flex-1 justify-center gap-4">
      <AudioWaveform />

      <View className="px-2">
        <ThemedText
          type="bodyBold"
          className="mb-2 text-left text-lg text-neutral"
        >
          O seu pedido...
        </ThemedText>

        <View className="mb-6 h-32 w-full rounded-2xl border-2 border-primary bg-neutralLight px-3">
          <TextInput
            value="Uvas sem grainha."
            multiline
            className="flex-1 font-rubik text-lg text-neutral"
            textAlignVertical="top"
            editable={false}
          />
        </View>
      </View>

      <View className="items-center mb-4" >
        <Button
          title="Fazer Pedido"
          className="w-2/3 border-primary text-primary"
          onPress={() => {
            router.push('./RequestLoading');
          }}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 pb-56 pt-24">
      <View className="mt-8 items-center">
        <ThemedText type="subtitle" className="text-xl text-[#1A1A1A]">
          Estamos a ouvir....
        </ThemedText>
      </View>

      <View className="flex-1 px-6 pt-12">
        <FloatingIconCard
          onClose={handleBack}
          icon={<MaterialIcons name="hearing" size={48} color="#ffff" />}
        >
          {renderCardContent()}
        </FloatingIconCard>
      </View>

      <BottomActions />
    </SafeAreaView>
  );
}
