import { StyleSheet, Text, type TextProps } from 'react-native';
import { useFontScale } from './FontContext';

export type ThemedTextProps = TextProps & {
  type?:
    | 'title'
    | 'subtitle'
    | 'body'
    | 'bodyInfo'
    | 'bodySmall'
    | 'bodyBold'
    | 'bigButton';
};

export function ThemedText({
  style,
  type = 'body',
  className,
  ...props
}: ThemedTextProps) {
  const { scale } = useFontScale();

  const baseStyle = styles[type] || styles.body;

  const flattenedBase = StyleSheet.flatten(baseStyle);

  const dynamicStyle = {
    fontSize: (flattenedBase.fontSize || 16) * scale,
  };

  return (
    <Text
      className={`${className || ''}`}
      style={[baseStyle, dynamicStyle, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: 'MonoTrustDisplay',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'MonoTrustDisplay',
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontFamily: "Rubik",
    lineHeight: 24,
  },
  bigButton: {
    fontSize: 20,
    fontFamily: 'Rubik',
    fontWeight: 'bold',
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: 'Rubik',
    fontWeight: '700',
  },
  bodySmall: {
    fontSize: 12,
    fontFamily: 'Rubik',
    lineHeight: 18,
  },
  bodyInfo: {
    fontSize: 14,
    fontFamily: 'Rubik',
    lineHeight: 18,
  },
});

export { styles };
