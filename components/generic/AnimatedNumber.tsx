import React, { useEffect, useRef, useState } from "react";
import { Text, TextStyle } from "react-native";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  style?: TextStyle;
};

export default function AnimatedNumber({
  value,
  duration = 500,
  style,
}: AnimatedNumberProps) {
  const [displayedValue, setDisplayedValue] = useState(value);
  const startValueRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    cancelAnimationFrame(frameRef.current!);
    startValueRef.current = displayedValue;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const newValue =
        startValueRef.current +
        (value - startValueRef.current) * easeInOutCubic(progress);

      setDisplayedValue(newValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current!);
  }, [value, duration]);

  return (
    <Text style={[textStyle, style && style]}>{displayedValue.toFixed(2)}</Text>
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const textStyle: TextStyle = {
  fontSize: 16,
  color: "#fff",
};
