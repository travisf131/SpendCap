import { formatCurrency, getCurrencySymbol } from '@/utils/formatCurrency';
import { useCallback } from 'react';
import { useSettings } from './useSettings';

export function useCurrency() {
  const { getSettings } = useSettings();

  const formatAmount = useCallback((amount: number): string => {
    const settings = getSettings();
    return formatCurrency(amount, settings.currency);
  }, [getSettings]);

  const getSymbol = useCallback((): string => {
    const settings = getSettings();
    return getCurrencySymbol(settings.currency);
  }, [getSettings]);

  const getCurrency = useCallback((): string => {
    const settings = getSettings();
    return settings.currency;
  }, [getSettings]);

  return {
    formatAmount,
    getSymbol,
    getCurrency,
  };
} 