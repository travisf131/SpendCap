
import { DEFAULT_SETTINGS, GlobalSettings, VariableExpenseCategory } from '@/types/settings';
import { useCallback, useMemo } from 'react';
import { MMKV } from 'react-native-mmkv';

const SETTINGS_KEY = 'global_settings';

export function useSettings() {
  // Proper MMKV initialization instead of lazy loading
  const storage = useMemo(() => new MMKV(), []);

  // Get settings from MMKV
  const getSettings = useCallback((): GlobalSettings => {
    try {
      const settingsJson = storage.getString(SETTINGS_KEY);
      if (settingsJson) {
        const parsed = JSON.parse(settingsJson);
        
        // Migration: handle old veTemplates property
        if (parsed.veTemplates && !parsed.veCategories) {
          const migratedSettings = {
            ...parsed,
            veCategories: parsed.veTemplates,
          };
          delete migratedSettings.veTemplates;
          
          // Save the migrated settings immediately
          storage.set(SETTINGS_KEY, JSON.stringify(migratedSettings));
          return migratedSettings;
        }
        
        // Ensure veCategories exists
        if (!parsed.veCategories) {
          parsed.veCategories = [];
        }
        
        // Ensure currency exists (for backward compatibility)
        if (!parsed.currency) {
          parsed.currency = 'USD';
        }
        
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to load settings:', error);
    }
    return DEFAULT_SETTINGS;
  }, [storage]);

  // Save settings to MMKV
  const saveSettings = useCallback((settings: GlobalSettings) => {
    try {
      storage.set(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [storage]);

  // Update income
  const updateIncome = useCallback((income: number) => {
    const settings = getSettings();
    const updatedSettings = { ...settings, userIncome: income };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  // Update fixed expenses
  const updateFixedExpenses = useCallback((fixedExpenses: number) => {
    const settings = getSettings();
    const updatedSettings = { ...settings, fixedExpenses };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  // Update currency
  const updateCurrency = useCallback((currency: string) => {
    const settings = getSettings();
    const updatedSettings = { ...settings, currency };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  // VE Category CRUD operations
  const addVECategory = useCallback((name: string, defaultLimit: number) => {
    const settings = getSettings();
    const newCategory: VariableExpenseCategory = {
      id: Date.now().toString(), // Simple ID generation
      name,
      defaultLimit,
    };
    
    const updatedSettings = {
      ...settings,
      veCategories: [...settings.veCategories, newCategory],
    };
    saveSettings(updatedSettings);
    return newCategory;
  }, [getSettings, saveSettings]);

  const updateVECategory = useCallback((id: string, updates: Partial<VariableExpenseCategory>) => {
    const settings = getSettings();
    const updatedCategories = settings.veCategories.map(category =>
      category.id === id ? { ...category, ...updates } : category
    );
    
    const updatedSettings = {
      ...settings,
      veCategories: updatedCategories,
    };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  const deleteVECategory = useCallback((id: string) => {
    const settings = getSettings();
    const updatedCategories = settings.veCategories.filter(category => category.id !== id);
    
    const updatedSettings = {
      ...settings,
      veCategories: updatedCategories,
    };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  // Update last month ID for automatic transitions
  const updateLastMonthId = useCallback((monthId: string) => {
    const settings = getSettings();
    const updatedSettings = { ...settings, lastMonthId: monthId };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  // Get last month ID
  const getLastMonthId = useCallback(() => {
    const settings = getSettings();
    return settings.lastMonthId;
  }, [getSettings]);

  const completeOnboarding = useCallback(() => {
    const settings = getSettings();
    const updatedSettings = { ...settings, hasCompletedOnboarding: true };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  const resetSettings = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
  }, [saveSettings]);

  const resetOnboarding = useCallback(() => {
    const settings = getSettings();
    const updatedSettings = { ...settings, hasCompletedOnboarding: false };
    saveSettings(updatedSettings);
  }, [getSettings, saveSettings]);

  // Get calculated values
  const getProjectedSavings = useCallback(() => {
    const settings = getSettings();
    const totalVEBudget = settings.veCategories
      .reduce((sum, c) => sum + c.defaultLimit, 0);
    
    return settings.userIncome - settings.fixedExpenses - totalVEBudget;
  }, [getSettings]);

  return {
    getSettings,
    updateIncome,
    updateFixedExpenses,
    updateCurrency,
    addVECategory,
    updateVECategory,
    deleteVECategory,
    updateLastMonthId,
    getLastMonthId,
    completeOnboarding,
    resetSettings,
    resetOnboarding,
    getProjectedSavings,
  };
} 