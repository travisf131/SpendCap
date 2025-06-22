import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textSecondary,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
