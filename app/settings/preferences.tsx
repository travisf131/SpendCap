import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import Header from "@/components/generic/Header";
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useMockData } from '@/services/mockData';
import { CURRENCY_OPTIONS } from '@/utils/formatCurrency';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PreferencesScreen() {
  const { showSnackbar } = useSnackbar();
  const { getSettings, updateCurrency, resetOnboarding } = useSettings();
  const { generateMockHistoricalData, clearMockData } = useMockData();
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

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset the onboarding flow. The app will restart and show the welcome screens again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
            showSnackbar('Onboarding reset! App will restart.', 'success');
          }
        },
      ]
    );
  };

  const handleGenerateMockData = () => {
    Alert.alert(
      'Generate Mock Data',
      'This will create realistic historical data for January-July 2025 to test the analytics screen. Existing months will be skipped.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: () => {
            try {
              generateMockHistoricalData();
              showSnackbar('Mock historical data generated!', 'success');
            } catch (error) {
              console.error('Error generating mock data:', error);
              showSnackbar('Failed to generate mock data', 'error');
            }
          }
        },
      ]
    );
  };

  const handleClearMockData = () => {
    Alert.alert(
      'Clear Mock Data',
      'This will delete all mock data from January-July 2025. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            try {
              clearMockData();
              showSnackbar('Mock data cleared!', 'success');
            } catch (error) {
              console.error('Error clearing mock data:', error);
              showSnackbar('Failed to clear mock data', 'error');
            }
          }
        },
      ]
    );
  };

  const selectedCurrencyData = CURRENCY_OPTIONS.find(c => c.code === selectedCurrency);

  return (
    <PageView>
      <Header title="Preferences" />
      <ScrollView showsVerticalScrollIndicator={false}>

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
        {/* <View style={styles.section}>
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
        </View> */}

        {/* Development */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Development
          </ThemedText>
          
          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={handleResetOnboarding}
          >
            <View style={styles.preferenceLeft}>
              <Icon name="refresh" size={20} color={Colors.tint} />
              <View style={styles.preferenceTextContainer}>
                <ThemedText style={styles.preferenceTitle}>Reset Onboarding</ThemedText>
                <ThemedText style={styles.preferenceSubtitle}>
                  Re-trigger the onboarding flow for testing
                </ThemedText>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={handleGenerateMockData}
          >
            <View style={styles.preferenceLeft}>
              <Icon name="trending-up" size={20} color={Colors.tint} />
              <View style={styles.preferenceTextContainer}>
                <ThemedText style={styles.preferenceTitle}>Generate Mock Data</ThemedText>
                <ThemedText style={styles.preferenceSubtitle}>
                  Create historical data (Jan-Jul 2025) for analytics testing
                </ThemedText>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.preferenceItem}
            onPress={handleClearMockData}
          >
            <View style={styles.preferenceLeft}>
              <Icon name="delete" size={20} color={Colors.red} />
              <View style={styles.preferenceTextContainer}>
                <ThemedText style={styles.preferenceTitle}>Clear Mock Data</ThemedText>
                <ThemedText style={styles.preferenceSubtitle}>
                  Remove all generated mock historical data
                </ThemedText>
              </View>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
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