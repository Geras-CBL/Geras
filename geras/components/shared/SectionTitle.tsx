import { View } from 'react-native';
import { ThemedText } from '../ThemedText';

export type SectionTitleProps = {
  title: string;
  children?: React.ReactNode;
};

export default function SectionTitle({
  title,
  children,
}: Readonly<SectionTitleProps>) {
  return (
    <View className="w-full flex-col items-start gap-4">
      <ThemedText type="title" className="text-center">
        {title}
      </ThemedText>
      {children}
    </View>
  );
}
