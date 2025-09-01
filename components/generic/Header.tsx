import { ThemedText } from "@/components/ThemedText";
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export default function Header({ 
  title, 
  showBackButton = true, 
  onBackPress,
  rightComponent 
}: HeaderProps) {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity onPress={handleBackPress}>
          <Icon name="arrow-back" size={24} color={Colors.tint} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
      
      <ThemedText type="title" style={styles.title}>{title}</ThemedText>
      
      {rightComponent || <View style={{ width: 24 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: Colors.background
  },
  title: {
    fontSize: 20,
  },
}); 