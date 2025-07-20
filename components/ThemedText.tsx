import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  // pick base style for this type
  const base = styles[type];

  // flatten base + any user style so we can read fontSize/lineHeight
  const flat = StyleSheet.flatten([base, style]) as TextStyle;

  // determine fontSize (fallback to default if absent)
  const fontSize = flat.fontSize ?? styles.default.fontSize!;

  // compute a lineHeight if none supplied (1.3× gives extra room)
  const lineHeight = flat.lineHeight ?? Math.round(fontSize * 1.3);

  // vertical padding to center the text within that lineHeight
  const paddingVertical = Math.round((lineHeight - fontSize) / 2);

  return (
    <Text
      {...rest}
      style={[base, style, { lineHeight, paddingVertical }]}
    />
  );
}

const styles = StyleSheet.create<Record<ThemedTextProps["type"], TextStyle>>({
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
    color: Colors.text,
    // no static lineHeight here
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textSecondary,
    // no static lineHeight here
  },
  link: {
    fontSize: 16,
    lineHeight: 30,
    color: "#0a7ea4",
  },
});