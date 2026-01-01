import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "title" | "subtitle" | "body" | "bodyBold";
};

export function ThemedText({
  style,
  type = "body",
  className,
  ...props
}: ThemedTextProps) {
  return (
    <Text
      className={`${className || ""}`}
      style={[
        type === "title" ? styles.title : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "body" ? styles.body : undefined,
        type === "bodyBold" ? styles.bodyBold : undefined,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: "MonoTrustDisplay",
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "MonoTrustDisplay",
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontFamily: "Rubik",
    lineHeight: 24, // TODO: Check
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: "Rubik",
    fontWeight: "bold",
    lineHeight: 24,
  },
});

export { styles };
