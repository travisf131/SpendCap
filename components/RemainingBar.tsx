// components/RemainingBar.tsx

import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { getExpenseColor } from "../utils/getExpenseColor";

type Props = {
  left: number;
  total: number;
};

export default function RemainingBar({ left, total }: Props) {
  const { percent, color } = getExpenseColor(left, total);

  const animValue = useRef(new Animated.Value(0)).current;

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      animValue.setValue(percent);
      isFirst.current = false;
    } else {
      Animated.timing(animValue, {
        toValue: percent,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  }, [percent]);

  // Interpolate width "0%"→"100%"
  const widthInterpolate = animValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View style={styles.barBackground}>
      <Animated.View
        style={[
          styles.barFill,
          {
            width: widthInterpolate,
            backgroundColor: color,
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  barBackground: {
    height: 12,
    width: "100%",
    backgroundColor: Colors.dark4,
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 3,
    opacity: 0.9,
  },
  barFill: {
    height: "100%",
    borderRadius: 6,
  },
});
