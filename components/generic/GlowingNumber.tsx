import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import {
    Platform,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface Props {
  value: string;
}

export default function GlowingNumber({ value }: Props) {
  const textGlow = useSharedValue(0.3);
  const star1 = useSharedValue(0);
  const star2 = useSharedValue(0);
  const star3 = useSharedValue(0);
  const star4 = useSharedValue(0);

  useEffect(() => {
    textGlow.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 3000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    const animateStar = (sv: typeof star1, delay: number) =>
      (sv.value = withRepeat(
        withSequence(
          withDelay(delay, withTiming(0.8, { duration: 1000 })),
          withTiming(0, { duration: 1000 })
        ),
        -1,
        false
      ));

    animateStar(star1, 10);
    animateStar(star2, 500);
    animateStar(star3, 1000);
    animateStar(star4, 1500);
  }, []);

  // only animate radius; color/offset are static and only applied on iOS
  const glowRadius = useAnimatedStyle(() => ({
    textShadowRadius: 15 * textGlow.value,
  }));

  const star1Style = useAnimatedStyle(() => ({ opacity: star1.value }));
  const star2Style = useAnimatedStyle(() => ({ opacity: star2.value }));
  const star3Style = useAnimatedStyle(() => ({ opacity: star3.value }));
  const star4Style = useAnimatedStyle(() => ({ opacity: star4.value }));

  const isIOS = Platform.OS === 'ios';

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.star, star1Style, { top: 15, left: 15 }]}>
        ✨
      </Animated.Text>
      <Animated.Text style={[styles.star, star2Style, { top: 15, right: 15 }]}>
        ✨
      </Animated.Text>
      <Animated.Text style={[styles.star, star4Style, { bottom: 10, right: 60 }]}>
        ✨    
      </Animated.Text>

      <Animated.Text
        style={[
          styles.number,
          // only include textShadowColor & offset on iOS
          isIOS && {
            textShadowColor: Colors.buttonGreen,
            textShadowOffset: { width: 0, height: 0 },
          },
          // animated radius (only effective on iOS)
          isIOS && glowRadius,
        ]}
      >
        {value}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create<{
  container: ViewStyle;
  number: TextStyle;
  star: TextStyle;
}>({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.buttonGreen,
    textAlign: 'center',
  },
  star: {
    position: 'absolute',
    opacity: 0.5,
    fontSize: 12,
    color: Colors.buttonGreen,
  },
});