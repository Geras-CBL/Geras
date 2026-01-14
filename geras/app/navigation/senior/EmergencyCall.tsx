import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Linking,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CIRCLE_SIZE = width * 0.75; // Increased slightly to 75%
const STROKE_WIDTH = 20; // Thicker ring
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL_SECONDS = 10;

export default function EmergencyCall() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);
  const [isCancelled, setIsCancelled] = useState(false);
  const phoneNumber = '112';

  const makeCall = useCallback(() => {
    if (!isCancelled) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  }, [isCancelled, phoneNumber]);

  useEffect(() => {
    if (isCancelled) return;

    if (seconds === 0) {
      makeCall();
      return;
    }

    const timerId = setTimeout(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [seconds, isCancelled, makeCall]);

  const handleCancel = () => {
    setIsCancelled(true);
    router.back();
  };

  const strokeDashoffset =
    CIRCUMFERENCE - (CIRCUMFERENCE * seconds) / TOTAL_SECONDS;

  return (
    <View className="flex-1 bg-white px-6 py-12">
      {/* CENTER CONTENT CONTAINER */}
      <View className="flex-1 items-center justify-center gap-10">
        {/* Header Text - Now Bigger and Centered */}
        <View className="w-full items-center">
          <Text className="text-center text-4xl font-black uppercase tracking-widest text-red-600">
            Emergência
          </Text>
          <Text className="mt-4 text-center text-2xl font-semibold text-gray-600">
            A ligar ao 112 em...
          </Text>
        </View>

        {/* Progress Circle Container */}
        <View
          className="relative items-center justify-center"
          style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}
        >
          {/* Layer 1: SVG Background & Progress */}
          <Svg
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
            className="absolute left-0 top-0"
          >
            {/* Background Grey Circle */}
            <Circle
              stroke="#F3F4F6" // gray-100/200 lighter
              fill="none"
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
            />
            {/* Animated Red Progress Circle */}
            <Circle
              stroke="#DC2626" // red-600
              fill="none"
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${CIRCLE_SIZE / 2} ${CIRCLE_SIZE / 2})`}
            />
          </Svg>

          {/* Layer 2: Text Overlay (Absolute to force center) */}
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-9xl font-black leading-tight text-red-600">
              {seconds}
            </Text>
            {/* Optional: label under number */}
            {/* <Text className="text-xl font-bold uppercase text-red-400">seg</Text> */}
          </View>
        </View>
      </View>

      {/* FOOTER: Cancel Button */}
      <View className="mb-6 w-full">
        {!isCancelled ? (
          <TouchableOpacity
            className="w-full items-center rounded-3xl bg-red-600 py-6 shadow-xl shadow-red-200"
            activeOpacity={0.8}
            onPress={handleCancel}
          >
            <Text className="text-3xl font-bold tracking-wider text-white">
              CANCELAR
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="items-center py-6">
            <Text className="text-3xl font-bold uppercase text-gray-300">
              Cancelado
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
