// hooks/useAnalytics.ts
import { Month } from "@/realm/models/Month";
import { useMonth } from "@/services/month";

export function useAnalytics() {
  const { getAllMonths, getPreviousMonth, getOrCreateCurrentMonth } = useMonth();

  const getMonthSummary = (month: Month) => {
    const totalBudget = month.variableExpenses.reduce((sum, ve) => sum + ve.limit, 0);
    const totalSpent = month.variableExpenses.reduce((sum, ve) => sum + ve.spent, 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return {
      monthId: month.monthId,
      totalBudget,
      totalSpent,
      remaining,
      percentageUsed,
      income: month.income,
      fixedExpenses: month.fixedExpenses,
      savingsGoal: month.savingsGoal,
      expenseCount: month.variableExpenses.length,
    };
  };

  const getCurrentMonthSummary = () => {
    const currentMonth = getOrCreateCurrentMonth();
    return getMonthSummary(currentMonth);
  };

  const getAllMonthSummaries = () => {
    const months = getAllMonths();
    return months.map(month => getMonthSummary(month));
  };

  const getSpendingTrends = () => {
    const summaries = getAllMonthSummaries();
    return summaries.map(summary => ({
      month: summary.monthId,
      totalSpent: summary.totalSpent,
      percentageUsed: summary.percentageUsed,
    }));
  };

  const getCategoryTrends = () => {
    const months = getAllMonths();
    const categoryMap = new Map<string, {month: string, spent: number, limit: number}[]>();
    
    months.forEach(month => {
      month.variableExpenses.forEach(ve => {
        if (!categoryMap.has(ve.name)) {
          categoryMap.set(ve.name, []);
        }
        categoryMap.get(ve.name)!.push({
          month: month.monthId,
          spent: ve.spent,
          limit: ve.limit,
        });
      });
    });

    return Object.fromEntries(categoryMap);
  };

  return {
    getCurrentMonthSummary,
    getAllMonthSummaries,
    getSpendingTrends,
    getCategoryTrends,
    getMonthSummary,
  };
} 