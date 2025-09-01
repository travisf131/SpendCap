import { useSettings } from "@/hooks/useSettings";
import { Month } from "@/realm/models/Month";
import { VariableExpense } from "@/realm/models/VariableExpense";
import { useRealm } from "@realm/react";
import Realm from "realm";
const { ObjectId } = Realm.BSON;

export function useMockData() {
  const realm = useRealm();
  const { getSettings } = useSettings();

  const generateMockHistoricalData = () => {
    const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07'];
    const settings = getSettings();
    
    // Common VE categories with realistic limits and spending patterns
    const mockVECategories = [
      { name: 'Groceries', baseLimit: 600, spendingVariation: 0.2 },
      { name: 'Dining Out', baseLimit: 300, spendingVariation: 0.4 },
      { name: 'Entertainment', baseLimit: 200, spendingVariation: 0.6 },
      { name: 'Gas', baseLimit: 250, spendingVariation: 0.3 },
      { name: 'Shopping', baseLimit: 350, spendingVariation: 0.8 },
      { name: 'Health & Fitness', baseLimit: 150, spendingVariation: 0.3 },
      { name: 'Miscellaneous', baseLimit: 200, spendingVariation: 0.5 },
    ];

    // Generate some income variation
    const baseIncome = settings.userIncome || 5000;
    const baseFixedExpenses = settings.fixedExpenses || 2000;

    realm.write(() => {
      months.forEach((monthId, index) => {
        // Check if month already exists
        const existingMonth = realm.objectForPrimaryKey(Month, monthId);
        if (existingMonth) {
          console.log(`Month ${monthId} already exists, skipping...`);
          return;
        }

        // Add some realistic variation to income (bonuses, raises, etc.)
        const incomeMultiplier = 1 + (Math.random() * 0.3 - 0.15); // ±15% variation
        const monthlyIncome = baseIncome * incomeMultiplier;

        // Slight variation in fixed expenses (utilities, etc.)
        const fixedMultiplier = 1 + (Math.random() * 0.1 - 0.05); // ±5% variation
        const monthlyFixed = baseFixedExpenses * fixedMultiplier;

        // Create the month
        const month = realm.create(Month, {
          monthId,
          income: Math.round(monthlyIncome),
          fixedExpenses: Math.round(monthlyFixed),
          savingsGoal: Math.round((monthlyIncome - monthlyFixed) * 0.2), // 20% savings goal
          notes: `Mock data for ${monthId}`,
          variableExpenses: [],
        });

        // Create variable expenses with realistic spending patterns
        mockVECategories.forEach(category => {
          // Add some month-to-month variation in limits
          const limitVariation = 1 + (Math.random() * 0.2 - 0.1); // ±10% variation
          const limit = Math.round(category.baseLimit * limitVariation);
          
          // Generate spent amount based on spending variation
          // Some categories are more predictable (groceries) vs unpredictable (entertainment)
          const spendingFactor = Math.random() * (1 + category.spendingVariation);
          const spent = Math.round(limit * Math.min(spendingFactor, 1.2)); // Cap at 120% of limit

          const ve = realm.create(VariableExpense, {
            _id: new ObjectId(),
            name: category.name,
            limit,
            spent,
          });

          month.variableExpenses.push(ve);
        });

        console.log(`Created mock data for ${monthId}`);
      });
    });

    console.log('Mock historical data generation complete!');
  };

  const clearMockData = () => {
    const months = ['2025-01', '2025-02', '2025-03', '2025-04', '2025-05', '2025-06', '2025-07'];
    
    realm.write(() => {
      months.forEach(monthId => {
        const month = realm.objectForPrimaryKey(Month, monthId);
        if (month) {
          // Delete all variable expenses for this month
          month.variableExpenses.forEach(ve => {
            realm.delete(ve);
          });
          // Delete the month itself
          realm.delete(month);
          console.log(`Deleted mock data for ${monthId}`);
        }
      });
    });

    console.log('Mock data cleared!');
  };

  return {
    generateMockHistoricalData,
    clearMockData,
  };
} 