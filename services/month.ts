import { useSettings } from "@/hooks/useSettings";
import { Month } from "@/realm/models/Month";
import { VariableExpense } from "@/realm/models/VariableExpense";
import { getMonthIdString } from "@/utils/dates";
import { useRealm } from "@realm/react";
import Realm from "realm";
const { ObjectId } = Realm.BSON;

export function useMonth() {
  const realm = useRealm();
  const { getSettings, updateLastMonthId, getLastMonthId } = useSettings();

  // Check if we need to transition to a new month
  const checkAndHandleMonthTransition = (): boolean => {
    const currentMonthId = getMonthIdString();
    const lastMonthId = getLastMonthId();
    
    // If this is the first time or month has changed
    if (!lastMonthId || lastMonthId !== currentMonthId) {
      console.log(`Month transition detected: ${lastMonthId} -> ${currentMonthId}`);
      
      // Update the last month ID
      updateLastMonthId(currentMonthId);
      
      // If we had a previous month, we've transitioned
      if (lastMonthId) {
        return true;
      }
    }
    
    return false;
  };

  const getOrCreateCurrentMonth = (): Month => {
    const monthId = getMonthIdString(); // e.g., "2024-10"
    let month = realm.objectForPrimaryKey(Month, monthId);

    if (!month) {
      // Create new month with settings data
      const settings = getSettings();
      realm.write(() => {
        month = realm.create(Month, {
          monthId,
          income: settings.userIncome,
          fixedExpenses: settings.fixedExpenses,
          savingsGoal: 0,
          notes: "",
          variableExpenses: [],
        });

        // Populate VEs from settings
        settings.veCategories.forEach((category) => {
          const newVE = realm.create(VariableExpense, {
            _id: new ObjectId(),
            name: category.name,
            limit: category.defaultLimit,
            spent: 0,
          });
          month!.variableExpenses.push(newVE);
        });
      });
    } else {
      // Month exists - always sync income and fixed expenses from settings
      const settings = getSettings();
      realm.write(() => {
        // Always update income and fixed expenses from latest settings
        month!.income = settings.userIncome;
        month!.fixedExpenses = settings.fixedExpenses;
        
        // Sync VEs from settings - add any missing categories
        const existingVENames = new Set(month!.variableExpenses.map(ve => ve.name));
        settings.veCategories.forEach((category) => {
          // Only add if this category doesn't already exist
          if (!existingVENames.has(category.name)) {
            const newVE = realm.create(VariableExpense, {
              _id: new ObjectId(),
              name: category.name,
              limit: category.defaultLimit,
              spent: 0,
            });
            month!.variableExpenses.push(newVE);
          }
        });
      });
    }

    return month!;
  };

  // Get current month with automatic transition detection
  const getCurrentMonthWithTransition = (): { month: Month; transitioned: boolean } => {
    const transitioned = checkAndHandleMonthTransition();
    const month = getOrCreateCurrentMonth();
    return { month, transitioned };
  };

  const getOrCreateNextMonth = (baseMonthId?: string): Month => {
    const currentMonthId = baseMonthId || getMonthIdString();
    const [year, month] = currentMonthId.split('-').map(Number);
    
    // Calculate next month
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const nextMonthId = `${nextYear}-${nextMonth.toString().padStart(2, '0')}`;

    let nextMonthObj = realm.objectForPrimaryKey(Month, nextMonthId);

    if (!nextMonthObj) {
      // Get current month as template for income/expenses, but always use latest settings for VEs
      const currentMonth = realm.objectForPrimaryKey(Month, currentMonthId);
      const settings = getSettings();
      
      realm.write(() => {
        nextMonthObj = realm.create(Month, {
          monthId: nextMonthId,
          income: currentMonth?.income || settings.userIncome,
          fixedExpenses: currentMonth?.fixedExpenses || settings.fixedExpenses,
          savingsGoal: currentMonth?.savingsGoal || 0,
          notes: "",
          variableExpenses: [],
        });

        // ALWAYS use latest settings for VEs to get updated limits
        settings.veCategories.forEach((category) => {
          const newVE = realm.create(VariableExpense, {
            _id: new ObjectId(),
            name: category.name,
            limit: category.defaultLimit, // Use latest limit from settings
            spent: 0, // Reset spent for new month
          });
          nextMonthObj!.variableExpenses.push(newVE);
        });
      });
    }

    return nextMonthObj!;
  };

  const getPreviousMonth = (baseMonthId?: string): Month | null => {
    const currentMonthId = baseMonthId || getMonthIdString();
    const [year, month] = currentMonthId.split('-').map(Number);
    
    // Calculate previous month
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;
    const prevMonthId = `${prevYear}-${prevMonth.toString().padStart(2, '0')}`;

    return realm.objectForPrimaryKey(Month, prevMonthId);
  };

  const getAllMonths = (): Realm.Results<Month> => {
    return realm.objects(Month).sorted('monthId', true); // Most recent first
  };



  return {
    getOrCreateCurrentMonth,
    getCurrentMonthWithTransition,
    getOrCreateNextMonth,
    getPreviousMonth,
    getAllMonths,
  };
}
