import { Colors } from '@/constants/Colors';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View, ViewStyle } from 'react-native';

const { width } = Dimensions.get('window');

interface EnvelopeProps {
  style: ViewStyle;
  delay: number;
}

const Envelope: React.FC<EnvelopeProps> = ({ style, delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animate = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 1000,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Loop the animation
        setTimeout(animate, 2000);
      });
    };

    animate();
  }, [scaleAnim, opacityAnim, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      {/* Envelope body */}
      <View style={envelopeBody} />
      {/* Envelope flap */}
      <View style={envelopeFlap} />
      {/* Money indicator */}
      <View style={moneyIndicator} />
    </Animated.View>
  );
};

interface CurrencySymbolProps {
  style: any;
  delay: number;
  symbol: string;
}

const CurrencySymbol: React.FC<CurrencySymbolProps> = ({ style, delay, symbol }) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      // Reset values
      translateY.setValue(-20);
      opacity.setValue(0);
      scale.setValue(0.5);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 40,
          duration: 2500,
          delay,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            delay: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: 400,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 400,
            delay: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Loop the animation
        setTimeout(animate, 1000);
      });
    };

    animate();
  }, [translateY, opacity, scale, delay]);

  return (
    <Animated.Text
      style={[
        currencySymbolStyle,
        style,
        {
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      {symbol}
    </Animated.Text>
  );
};

export default function BudgetEnvelopeAnimation() {
  const containerScale = useRef(new Animated.Value(0.9)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(containerScale, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [containerScale, containerOpacity]);

  return (
    <Animated.View
      style={[
        container,
        {
          opacity: containerOpacity,
        },
      ]}
    >
      {/* Currency symbols floating down - positioned above envelopes */}
      <CurrencySymbol
        style={{ position: 'absolute', left: '25%', top: 20 }}
        delay={0}
        symbol="$"
      />
      <CurrencySymbol
        style={{ position: 'absolute', left: '50%', top: 10 }}
        delay={800}
        symbol="$"
      />
      <CurrencySymbol
        style={{ position: 'absolute', left: '75%', top: 5 }}
        delay={1600}
        symbol="$"
      />
      
      {/* Three envelopes representing budget categories - centered */}
      <View style={envelopesContainer}>
        <Envelope
          style={envelopeContainer}
          delay={500}
        />
        <Envelope
          style={envelopeContainer}
          delay={1000}
        />
        <Envelope
          style={envelopeContainer}
          delay={1500}
        />
      </View>
      
      {/* Floating money pieces above envelopes */}
      <CurrencySymbol
        style={{ position: 'absolute', left: '30%', top: 30 }}
        delay={400}
        symbol="💰"
      />
      <CurrencySymbol
        style={{ position: 'absolute', left: '65%', top: 25 }}
        delay={1200}
        symbol="💰"
      />
    </Animated.View>
  );
}

const container: ViewStyle = {
  height: 130,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  marginVertical: 0,
};

const envelopesContainer: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  bottom: 0,
  gap: 20,
  width: '100%',
  height: 80,
};

const envelopeContainer: ViewStyle = {
  width: 60,
  height: 40,
};

const envelopeBody: ViewStyle = {
  width: 60,
  height: 35,
  backgroundColor: Colors.dark3,
  borderRadius: 6,
  borderWidth: 2,
  borderColor: Colors.buttonGreen,
  position: 'absolute',
  bottom: 0,
  shadowColor: Colors.buttonGreen,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  elevation: 3,
};

const envelopeFlap: ViewStyle = {
  width: 60,
  height: 25,
  backgroundColor: Colors.dark4,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  borderWidth: 2,
  borderColor: Colors.buttonGreen,
  borderBottomWidth: 0,
  position: 'absolute',
  top: 0,
  shadowColor: Colors.buttonGreen,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 2,
};

const moneyIndicator: ViewStyle = {
  width: 40,
  height: 4,
  backgroundColor: Colors.buttonGreen,
  borderRadius: 2,
  position: 'absolute',
  bottom: 10,
  left: 10,
  opacity: 0.9,
};

const currencySymbolStyle = {
  fontSize: 18,
  color: Colors.buttonGreen,
  fontWeight: 'bold' as const,
  textShadowColor: Colors.buttonGreen,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 6,
}; 