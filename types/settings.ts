export interface VariableExpenseCategory {
  id: string;
  name: string;
  defaultLimit: number;
}

export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export interface GlobalSettings {
  userIncome: number;
  fixedExpenses: number;
  veCategories: VariableExpenseCategory[];
  hasCompletedOnboarding: boolean;
  currency: string; // Currency code (USD, EUR, etc.)
  lastMonthId?: string; // Track the last month to detect transitions
}

export const DEFAULT_SETTINGS: GlobalSettings = {
  userIncome: 0,
  fixedExpenses: 0,
  veCategories: [],
  hasCompletedOnboarding: false,
  currency: 'USD',
  lastMonthId: undefined,
}; 