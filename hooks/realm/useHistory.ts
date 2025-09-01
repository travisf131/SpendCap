// hooks/useHistory.ts
import { Month } from "@/realm/models/Month";
import { useMonth } from "@/services/month";
import { useMemo } from 'react';

export interface MonthSummary {
  monthId: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  income: number;
  fixedExpenses: number;
  savingsGoal: number;
  monthlySavings: number;
  expenseCount: number;
  // Enhanced fields
  totalSaved: number;
  projectedSavings: number;
  percentageSaved: number;
  variableExpenses: {
    name: string;
    limit: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  }[];
}

export interface OverallStats {
  totalIncome: number;
  totalFixedExpenses: number;
  totalBudget: number;
  totalSpent: number;
  totalSaved: number;
  averageIncome: number;
  averageFixedExpenses: number;
  averageSpent: number;
  averageSaved: number;
  averagePercentageUsed: number;
  averagePercentageSaved: number;
}

export function useHistory() {
  const { getAllMonths, getOrCreateCurrentMonth } = useMonth();

  const getMonthSummary = (month: Month): MonthSummary => {
    const totalBudget = month.variableExpenses.reduce((sum, ve) => sum + ve.limit, 0);
    const totalSpent = month.variableExpenses.reduce((sum, ve) => sum + ve.spent, 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    // Enhanced calculations
    const totalSaved = month.income - month.fixedExpenses - totalSpent;
    const projectedSavings = month.income - month.fixedExpenses - totalBudget;
    const percentageSaved = month.income > 0 ? (totalSaved / month.income) * 100 : 0;
    
    // Format variable expenses for display
    const variableExpenses = month.variableExpenses.map(ve => ({
      name: ve.name,
      limit: ve.limit,
      spent: ve.spent,
      remaining: ve.limit - ve.spent,
      percentageUsed: ve.limit > 0 ? (ve.spent / ve.limit) * 100 : 0,
    }));
    
    return {
      monthId: month.monthId,
      totalBudget,
      totalSpent,
      remaining,
      percentageUsed,
      income: month.income,
      fixedExpenses: month.fixedExpenses,
      savingsGoal: month.savingsGoal,
      monthlySavings: month.monthlySavings,
      expenseCount: month.variableExpenses.length,
      // Enhanced fields
      totalSaved,
      projectedSavings,
      percentageSaved,
      variableExpenses,
    };
  };

  // Memoized hooks for optimal performance
  const currentMonth = getOrCreateCurrentMonth();
  const allMonths = getAllMonths();
  const allPastMonths = allMonths.filter(month => month.monthId !== currentMonth.monthId);
  
  const currentMonthSummary = useMemo(() => getMonthSummary(currentMonth), [currentMonth]);
  const allMonthSummaries = useMemo(() => {
    return allPastMonths.map(month => getMonthSummary(month));
  }, [allPastMonths]);

  const overallStats = useMemo((): OverallStats => {
    if (allMonthSummaries.length === 0) {
      return {
        totalIncome: 0,
        totalFixedExpenses: 0,
        totalBudget: 0,
        totalSpent: 0,
        totalSaved: 0,
        averageIncome: 0,
        averageFixedExpenses: 0,
        averageSpent: 0,
        averageSaved: 0,
        averagePercentageUsed: 0,
        averagePercentageSaved: 0,
      };
    }
    
    const totalIncome = allMonthSummaries.reduce((sum: number, s: MonthSummary) => sum + s.income, 0);
    const totalFixedExpenses = allMonthSummaries.reduce((sum: number, s: MonthSummary) => sum + s.fixedExpenses, 0);
    const totalBudget = allMonthSummaries.reduce((sum: number, s: MonthSummary) => sum + s.totalBudget, 0);
    const totalSpent = allMonthSummaries.reduce((sum: number, s: MonthSummary) => sum + s.totalSpent, 0);
    const totalSaved = allMonthSummaries.reduce((sum: number, s: MonthSummary) => sum + s.totalSaved, 0);
    
    const count = allMonthSummaries.length;
    
    return {
      totalIncome,
      totalFixedExpenses,
      totalBudget,
      totalSpent,
      totalSaved,
      averageIncome: totalIncome / count,
      averageFixedExpenses: totalFixedExpenses / count,
      averageSpent: totalSpent / count,
      averageSaved: totalSaved / count,
      averagePercentageUsed: allMonthSummaries.reduce((sum: number, s: MonthSummary) => sum + s.percentageUsed, 0) / count,
      averagePercentageSaved: allMonthSummaries.reduce((sum: number, s: MonthSummary) => sum + s.percentageSaved, 0) / count,
    };
  }, [allMonthSummaries]);

  const spendingTrends = useMemo(() => {
    return allMonthSummaries.map(summary => ({
      month: summary.monthId,
      totalSpent: summary.totalSpent,
      percentageUsed: summary.percentageUsed,
    }));
  }, [allMonthSummaries]);

  const categoryTrends = useMemo(() => {
    const categoryMap = new Map<string, {month: string, spent: number, limit: number}[]>();
    
    allMonths.forEach(month => {
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
  }, [allMonths]);

  // Memoized top spending categories calculation
  const topSpendingCategories = useMemo(() => {
    const categoryTotals = new Map<string, { total: number, months: number }>();
    
    allMonths.forEach(month => {
      month.variableExpenses.forEach(ve => {
        if (!categoryTotals.has(ve.name)) {
          categoryTotals.set(ve.name, { total: 0, months: 0 });
        }
        const current = categoryTotals.get(ve.name)!;
        current.total += ve.spent;
        current.months += 1;
      });
    });

    return Array.from(categoryTotals.entries())
      .map(([name, data]) => ({
        name,
        average: data.total / data.months,
        total: data.total
      }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 3);
  }, [allMonths]);

  // Memoized overspending analysis
  const overspendingAnalysis = useMemo(() => {
    const overspentCategories = new Map<string, { overspentCount: number, totalMonths: number }>();
    
    allMonths.forEach(month => {
      month.variableExpenses.forEach(ve => {
        if (ve.spent > ve.limit) {
          if (!overspentCategories.has(ve.name)) {
            overspentCategories.set(ve.name, { overspentCount: 0, totalMonths: 0 });
          }
          const current = overspentCategories.get(ve.name)!;
          current.overspentCount += 1;
          current.totalMonths += 1;
        } else {
          if (!overspentCategories.has(ve.name)) {
            overspentCategories.set(ve.name, { overspentCount: 0, totalMonths: 0 });
          }
          overspentCategories.get(ve.name)!.totalMonths += 1;
        }
      });
    });

    return Array.from(overspentCategories.entries())
      .filter(([_, data]) => data.overspentCount > 0)
      .map(([name, data]) => ({
        name,
        overspendRate: (data.overspentCount / data.totalMonths) * 100
      }))
      .sort((a, b) => b.overspendRate - a.overspendRate)
      .slice(0, 2);
  }, [allMonths]);

  return {
    getCurrentMonthSummary: () => currentMonthSummary,
    getAllMonthSummaries: () => allMonthSummaries,
    getOverallStats: () => overallStats,
    getSpendingTrends: () => spendingTrends,
    getCategoryTrends: () => categoryTrends,
    getTopSpendingCategories: () => topSpendingCategories,
    getOverspendingAnalysis: () => overspendingAnalysis,
    getMonthSummary,
  };
} 