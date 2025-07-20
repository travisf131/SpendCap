import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import FinancialInput from '@/components/settings/FinancialInput';
import VECategoryItem from '@/components/settings/VECategoryItem';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/hooks/useCurrency';
import { useSettings } from '@/hooks/useSettings';
import { useSnackbar } from '@/hooks/useSnackbar';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');
  const [settings, setSettings] = useState(() => getSettings());

  // Force refresh after settings changes
  const forceRefresh = () => setSettings(getSettings());
  
  // Sort categories alphabetically
  const sortedCategories = [...(settings.veCategories || [])].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const handleAddCategory = () => {
    const limit = parseFloat(newCategoryLimit) || 0;
    if (newCategoryName.trim() && limit > 0) {
      const categoryName = newCategoryName.trim();
      addVECategory(categoryName, limit);
      setNewCategoryName('');
      setNewCategoryLimit('');
      setShowAddForm(false);
      forceRefresh();
      showSnackbar(`Added category "${categoryName}"`, 'success');
    } else {
      showSnackbar('Please enter a valid category name and budget amount', 'error');
    }
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
              onPress={() => setShowAddForm(true)}
            >
              <Icon name="add" size={20} />
            </TouchableOpacity>
          </View>

          {showAddForm && (
            <View style={styles.addForm}>
              <TextInput
                style={styles.addInput}
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                placeholder="Category name (e.g., Groceries)"
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.addInput}
                value={newCategoryLimit}
                onChangeText={(text) => setNewCategoryLimit(text.replace(/[^0-9.]/g, ''))}
                placeholder={`Monthly budget (e.g., ${formatAmount(400)})`}
                placeholderTextColor="#888"
                keyboardType="decimal-pad"
              />
              <View style={styles.addButtonRow}>
                <TouchableOpacity 
                  style={[styles.formButton, styles.cancelFormButton]} 
                  onPress={() => {
                    setShowAddForm(false);
                    setNewCategoryName('');
                    setNewCategoryLimit('');
                  }}
                >
                  <Text style={styles.cancelFormButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.formButton, styles.saveFormButton]} 
                  onPress={handleAddCategory}
                >
                  <Text style={styles.saveFormButtonText}>Add Category</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
  addForm: {
    backgroundColor: Colors.dark3,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  addInput: {
    backgroundColor: Colors.background,
    color: Colors.text,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.tint,
  },
  addButtonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  formButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelFormButton: {
    backgroundColor: Colors.dark4,
  },
  saveFormButton: {
    backgroundColor: Colors.buttonGreen,
  },
  cancelFormButtonText: {
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  saveFormButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  budgetSummary: {
    backgroundColor: Colors.dark4,
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  budgetSummaryText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
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
 