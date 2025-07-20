import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import EnterVEModal from '@/components/modal/EnterVEModal';
import FinancialInput from '@/components/settings/FinancialInput';
import VECategoryItem from '@/components/settings/VECategoryItem';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/hooks/useCurrency';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/hooks/useSnackbar';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FinancialInfoScreen() {
  const {
    getSettings,
    updateIncome,
    updateFixedExpenses,
    addVECategory,
    updateVECategory,
    deleteVECategory,
  } = useSettings();

  const { showSnackbar } = useSnackbar();
  const { formatAmount } = useCurrency();

  const [showVEModal, setShowVEModal] = useState(false);
  const [settings, setSettings] = useState(() => getSettings());

  // Force refresh after settings changes
  const forceRefresh = () => setSettings(getSettings());
  
  // Sort categories alphabetically
  const sortedCategories = [...(settings.veCategories || [])].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const handleAddCategory = (name: string, limit: number) => {
    addVECategory(name, limit);
    forceRefresh();
    showSnackbar(`Added category "${name}"`, 'success');
  };

  const activeBudgetTotal = (settings.veCategories || [])
    .reduce((sum, c) => sum + c.defaultLimit, 0);

  return (
    <PageView>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-back" size={24} color={Colors.tint} />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.title}>Personal Financial Info</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        {/* Financial Overview */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Financial Overview
          </ThemedText>
          
          <FinancialInput
            title="Monthly Take-Home Income"
            value={settings.userIncome}
            onSave={(value) => {
              updateIncome(value);
              forceRefresh();
            }}
            placeholder={`${formatAmount(5000)} (example)`}
            valueColor={Colors.buttonGreen}
          />
          
          <FinancialInput
            title="Fixed Monthly Expenses"
            value={settings.fixedExpenses}
            onSave={(value) => {
              updateFixedExpenses(value);
              forceRefresh();
            }}
            placeholder={`${formatAmount(2500)} (example)`}
            valueColor={Colors.red}
          />
        </View>

        {/* Budget Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Budget Categories
            </ThemedText>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowVEModal(true)}
            >
              <Icon name="add" size={20} />
            </TouchableOpacity>
          </View>

          {sortedCategories.length > 0 ? (
            <>
              {sortedCategories.map((category) => (
                <VECategoryItem
                  key={category.id}
                  category={category}
                  onUpdate={(id, updates) => {
                    updateVECategory(id, updates);
                    forceRefresh();
                  }}
                  onDelete={(id) => {
                    deleteVECategory(id);
                    forceRefresh();
                  }}
                />
              ))}
              
              {settings.userIncome > 0 && (
                <View style={styles.savingsContainer}>
                  <Text style={styles.savingsLabel}>Projected Monthly Savings:</Text>
                  <Text style={[
                    styles.savingsAmount,
                    (settings.userIncome - settings.fixedExpenses - activeBudgetTotal) < 0 
                      ? styles.negativeSavings 
                      : styles.positiveSavings
                  ]}>
                    {formatAmount(settings.userIncome - settings.fixedExpenses - activeBudgetTotal)}
                  </Text>
                </View>
              )}
              
              {(settings.userIncome - settings.fixedExpenses - activeBudgetTotal) < 0 && (
                <Text style={styles.warningText}>
                  ⚠️ Your budget exceeds your available income. Consider reducing some category limits.
                </Text>
              )}
            </>
          ) : (
            <Text style={styles.emptyState}>    
              No expense categories yet. Add your first category above to get started!
            </Text>
          )}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <EnterVEModal
        visible={showVEModal}
        onClose={() => setShowVEModal(false)}
        onSubmit={handleAddCategory}
      />
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  addButton: {
    padding: 8,
  },
  savingsContainer: {
    backgroundColor: Colors.dark3,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsLabel: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: '600',
  },
  positiveSavings: {
    color: Colors.buttonGreen,
  },
  negativeSavings: {
    color: Colors.colorCritical,
  },
  warningText: {
    color: Colors.colorCritical,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    color: Colors.textTertiary,
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 32,
  },
  bottomPadding: {
    height: 100,
  },
});
 