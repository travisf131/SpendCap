import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/hooks/useSnackbar';
import { CURRENCY_OPTIONS } from '@/utils/formatCurrency';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PreferencesScreen() {
  const { showSnackbar } = useSnackbar();
  const { getSettings, updateCurrency } = useSettings();
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  
  const settings = getSettings();
  const selectedCurrency = settings.currency;

  const handleCurrencyChange = (currency: string) => {
    const oldCurrency = selectedCurrency;
    updateCurrency(currency);
    setShowCurrencyPicker(false);
    
    if (oldCurrency !== currency) {
      showSnackbar(`Currency changed to ${currency}`, 'success');
    }
  };

  const selectedCurrencyData = CURRENCY_OPTIONS.find(c => c.code === selectedCurrency);

  return (
    <PageView>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={Colors.tint} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Preferences</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* Display Settings */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Display
          </ThemedText>
          
          {/* Currency Selection */}
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={() => setShowCurrencyPicker(!showCurrencyPicker)}
          >
            <View style={styles.preferenceLeft}>
              <Icon name="attach-money" size={20} color={Colors.tint} />
              <View style={styles.preferenceTextContainer}>
                <ThemedText style={styles.preferenceTitle}>Currency</ThemedText>
                <ThemedText style={styles.preferenceSubtitle}>
                  {selectedCurrencyData?.symbol} - {selectedCurrencyData?.name}
                </ThemedText>
              </View>
            </View>
            <Icon 
              name={showCurrencyPicker ? "expand-less" : "expand-more"} 
              size={20} 
              color={Colors.textTertiary} 
            />
          </TouchableOpacity>

          {showCurrencyPicker && (
            <View style={styles.pickerContainer}>
              {CURRENCY_OPTIONS.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.pickerItem,
                    selectedCurrency === currency.code && styles.pickerItemSelected
                  ]}
                  onPress={() => handleCurrencyChange(currency.code)}
                >
                  <ThemedText style={styles.pickerItemText}>
                    {currency.symbol} - {currency.name}
                  </ThemedText>
                  {selectedCurrency === currency.code && (
                    <Icon name="check" size={16} color={Colors.tint} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* App Behavior */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            App Behavior
          </ThemedText>
          
          <TouchableOpacity style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Icon name="vibration" size={20} color={Colors.tint} />
              <View style={styles.preferenceTextContainer}>
                <ThemedText style={styles.preferenceTitle}>Haptic Feedback</ThemedText>
                <ThemedText style={styles.preferenceSubtitle}>
                  Vibrate on button press and interactions
                </ThemedText>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <ThemedText style={styles.comingSoon}>Coming Soon</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.preferenceItem}>
            <View style={styles.preferenceLeft}>
              <Icon name="today" size={20} color={Colors.tint} />
              <View style={styles.preferenceTextContainer}>
                <ThemedText style={styles.preferenceTitle}>Monthly Rollover</ThemedText>
                <ThemedText style={styles.preferenceSubtitle}>
                  Automatically create next month&apos;s budget
                </ThemedText>
              </View>
            </View>
            <View style={styles.switchContainer}>
              <ThemedText style={styles.comingSoon}>Coming Soon</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  preferenceItem: {
    backgroundColor: Colors.dark3,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  switchContainer: {
    alignItems: 'center',
  },
  comingSoon: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  pickerContainer: {
    backgroundColor: Colors.dark4,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  pickerItem: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark3,
  },
  pickerItemSelected: {
    backgroundColor: Colors.dark3,
  },
  pickerItemText: {
    fontSize: 14,
  },
  bottomPadding: {
    height: 100,
  },
}); 