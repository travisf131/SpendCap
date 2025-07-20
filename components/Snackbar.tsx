import { Colors } from '@/constants/Colors';
import { useSnackbar } from '@/hooks/useSnackbar';
import React, { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text } from 'react-native';

const { width } = Dimensions.get('window');

export default function Snackbar() {
  const { snackbar } = useSnackbar();
  const slideAnim = React.useRef(new Animated.Value(-100)).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);

  useEffect(() => {
    if (snackbar.isVisible) {
      setIsAnimationComplete(false);
      // Slide down from top
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      // Slide up to hide
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimationComplete(true);
      });
    }
  }, [snackbar.isVisible, slideAnim]);

  if (!snackbar.isVisible && isAnimationComplete) {
    return null;
  }

  const isSuccess = snackbar.type === 'success';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          borderColor: isSuccess ? Colors.buttonGreen : Colors.colorCritical,
        },
      ]}
    >
      <Text style={[
        styles.message,
        { color: isSuccess ? Colors.buttonGreen : Colors.colorCritical }
      ]}>
        {snackbar.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: Colors.dark3,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 