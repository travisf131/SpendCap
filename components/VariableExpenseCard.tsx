// components/VariableExpenseCard.tsx

import { Colors } from "@/constants/Colors";
import { getExpenseColor } from "@/utils/getExpenseColor";
import { hexToRgba } from "@/utils/hexToRgba";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RemainingBar from "./RemainingBar";
import AnimatedNumber from "./generic/AnimatedNumber";

type Props = {
  expense: { name: string; limit: number; spent: number };
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function VariableExpenseCard({
  expense,
  onPress,
  onLongPress,
}: Props) {
  const { name, limit, spent } = expense;
  const remaining = limit - spent;
  const limitReached = remaining <= 0;

  const { color } = getExpenseColor(remaining, limit);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.btnPress,
        { borderColor: hexToRgba(color, 0.7), shadowColor: color },
        limitReached && styles.limitReachedStyles,
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={[styles.title]}>{name}</Text>
        <Text
          style={[
            styles.remainingText,
            limitReached && { color: Colors.colorCritical, fontSize: 18 },
          ]}
        >
          {/* Still money left */}
          {!limitReached && (
            <Text>
              $
              <AnimatedNumber value={remaining} style={styles.remainingText} />
              <Text style={{ fontSize: 13.5 }}> left</Text>
            </Text>
          )}

          {/* No money left; budget exceeded */}
          {limitReached && <Text>{`$${remaining} left`}</Text>}
        </Text>
      </View>

      {!limitReached && <RemainingBar left={remaining} total={limit} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#3A3A3A",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 6,
    backgroundColor: "#2A2A2A",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    borderTopWidth: 0.2,
    borderRightWidth: 0.2,
    borderBottomWidth: 0.2,
    borderLeftWidth: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  btnPress: {
    backgroundColor: "#1A1A1A",
    transform: [{ scale: 0.98 }],
    opacity: 0.6,
  },
  limitReachedStyles: {
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: Colors.textSecondary,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 0,
    color: Colors.textSecondary,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
