import { Colors } from '@/constants/Colors';
import { useCurrency } from '@/hooks/useCurrency';
import { useSettings } from '@/hooks/useSettings';
import { VariableExpenseCategory } from '@/types/settings';
import React, { useState } from 'react';
import { Alert, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import BudgetEnvelopeAnimation from './animations/BudgetEnvelopeAnimation';
import GlowingNumber from './generic/GlowingNumber';
import EnterVEModal from './modal/EnterVEModal';
import ExtraInfoModal from './modal/ExtraInfoModal';
import FinancialInput from './settings/FinancialInput';
import VECategoryItem from './settings/VECategoryItem';
import { ThemedText } from './ThemedText';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [income, setIncome] = useState(0);
  const [fixedExpenses, setFixedExpenses] = useState(0);
  const [veCategories, setVeCategories] = useState<VariableExpenseCategory[]>([]);
  const [showVEModal, setShowVEModal] = useState(false);
  const [showExtraInfoModal, setShowExtraInfoModal] = useState({show: false, text: ""});

  const { updateIncome, updateFixedExpenses, addVECategory, completeOnboarding, updateVECategory, deleteVECategory } = useSettings();
  const { formatAmount } = useCurrency();

  const handleAddCategory = (name: string, limit: number) => {
    const newCategory = addVECategory(name, limit);
    setVeCategories(prev => [...prev, newCategory]);
  };

  const updateVECategoryLocal = (id: string, updates: Partial<VariableExpenseCategory>) => {
    setVeCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
    updateVECategory(id, updates);
  };

  const deleteVECategoryLocal = (id: string) => {
    setVeCategories(prev => prev.filter(cat => cat.id !== id));
    deleteVECategory(id);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (income <= 0) {
        Alert.alert('Income Required', 'Please enter your monthly income to continue.');
        return;
      }
      updateIncome(income);
    } else if (currentStep === 2) {
      if (fixedExpenses < 0) {
        Alert.alert('Invalid Amount', 'Fixed expenses cannot be negative.');
        return;
      }
      updateFixedExpenses(fixedExpenses);
    } else if (currentStep === 3) {
      if (veCategories.length === 0) {
        Alert.alert('Categories Required', 'Please add at least one variable expense category to continue.');
        return;
      }
    }
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    onComplete();
  };

  const totalVEBudget = veCategories.reduce((sum, cat) => sum + cat.defaultLimit, 0);
  const projectedSavings = income - fixedExpenses - totalVEBudget;

  return (
    <View style={container}>
      {currentStep === 0 && (
        <View style={screenContainer}>
          <View style={contentContainer}>
            <View style={titleContainer}>
              <ThemedText style={titleText}>Welcome to SpendCap!</ThemedText>
            </View>
            <BudgetEnvelopeAnimation />
            <View style={philosophyContainer}>
              <ThemedText style={bodyText}>
                SpendCap uses the proven envelope budgeting system to help you take control of your spending.
              </ThemedText>
              <ThemedText style={bodyText}>
                Instead of tracking every single expense, we focus on what matters most: your variable expenses - the spending categories where you have control.
              </ThemedText>
              <ThemedText style={bodyText}>
                By setting limits for these categories and tracking only what you spend, you&apos;ll naturally save more without the complexity of traditional budgeting apps.
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity style={fullWidthButton} onPress={handleNext}>
            <ThemedText style={buttonText}>Get Started</ThemedText>
          </TouchableOpacity>
        </View>
      )}

      {currentStep === 1 && (
        <View style={screenContainer}>
          <View style={contentContainer}>
            <ThemedText style={titleText}>Your Monthly Income</ThemedText>
            <ThemedText style={[bodyText, { marginTop: 15 }]}>
              Enter your take-home monthly income after taxes. This helps us calculate how much you can potentially save each month.
            </ThemedText>
            <FinancialInput
              title="Monthly Take-Home Income"
              value={income}
              onSave={setIncome}
              placeholder="0"
              valueColor={Colors.buttonGreen}
            />
          </View>
          <View style={buttonContainer}>
            <TouchableOpacity style={secondaryButton} onPress={() => setCurrentStep(0)}>
              <ThemedText style={secondaryButtonText}>Back</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={primaryButton} onPress={handleNext}>
              <ThemedText style={buttonText}>Next</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentStep === 2 && (
        <View style={screenContainer}>
          <View style={contentContainer}>
            <ThemedText style={titleText}>Fixed Monthly Expenses</ThemedText>
            <ThemedText style={[bodyText, { marginTop: 15 }]}>
              These are expenses that stay the same each month, like rent, insurance, subscriptions, and debt payments. Add these up and enter the total here.
            </ThemedText>
    
            <FinancialInput
              title="Total Fixed Expenses"
              value={fixedExpenses}
              onSave={setFixedExpenses}
              placeholder="0"
              valueColor={Colors.red}
            />

            <ThemedText style={[bodyText, { marginTop: 15, color: Colors.textTertiary, fontSize: 14 }]}>
             * We won&apos;t be tracking these, but this value will be used to calculate savings.
            </ThemedText>
          </View>
          <View style={buttonContainer}>
            <TouchableOpacity style={secondaryButton} onPress={() => setCurrentStep(1)}>
              <ThemedText style={secondaryButtonText}>Back</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={primaryButton} onPress={handleNext}>
              <ThemedText style={buttonText}>Next</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentStep === 3 && (
        <View style={screenContainer}>
          <View style={contentContainer}>
            <ThemedText style={titleText}>Variable Monthly Expenses</ThemedText>
            <ThemedText style={[bodyText, { marginTop: 15 }]}>
                Track only what matters: your variable expenses. These are things like food, gas, and shopping where you can cut back and save. Set limits, stay on budget, and watch your savings grow!
            </ThemedText>

            <TouchableOpacity 
                style={addCategoryButton}
                onPress={() => setShowVEModal(true)}
              >
                <ThemedText style={addCategoryButtonText}>+ Add Category</ThemedText>
            </TouchableOpacity>
            
            <ScrollView style={veListContainer} showsVerticalScrollIndicator={false}>
              {veCategories.map((category) => (
                <VECategoryItem
                  key={category.id}
                  category={category}
                  onUpdate={(id, updates) => updateVECategoryLocal(id, updates)}
                  onDelete={(id) => deleteVECategoryLocal(id)}
                />
              ))}  
            </ScrollView>
          </View>
          <View style={buttonContainer}>
            <TouchableOpacity style={secondaryButton} onPress={() => setCurrentStep(2)}>
              <ThemedText style={secondaryButtonText}>Back</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={primaryButton} onPress={handleNext}>
              <ThemedText style={buttonText}>Next</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {currentStep === 4 && (
        <View style={screenContainer}>
          <View style={contentContainer}>
           { projectedSavings >= 0 ? 
            <>
            <ThemedText style={titleText}>You&apos;re All Set! 🎉</ThemedText>
                <View style={summaryContainer}>
                <View style={summaryRow}>
                    <ThemedText style={summaryLabel}>Monthly Income:</ThemedText>
                    <ThemedText style={[summaryValue, { color: Colors.buttonGreen }]}>{formatAmount(income)}</ThemedText>
                </View>
                <View style={summaryRow}>
                    <ThemedText style={summaryLabel}>Fixed Expenses:</ThemedText>
                    <ThemedText style={[summaryValue, { color: Colors.colorCritical }]}>-{formatAmount(fixedExpenses)}</ThemedText>
                </View>
                <View style={summaryRow}>
                    <ThemedText style={summaryLabel}>Variable Expenses Budget:</ThemedText>
                    <ThemedText style={[summaryValue, { color: Colors.colorCritical }]}>-{formatAmount(totalVEBudget)}</ThemedText>
                </View>
                <View style={[summaryRow, totalRow]}>
                    <ThemedText style={[summaryLabel, totalLabel]}>Projected Monthly Savings:</ThemedText>
                    <GlowingNumber 
                       value={formatAmount(projectedSavings)}
                     />
                </View>
                </View>
            </> : 
           <>
            <View style={warningContainer}>
                <ThemedText style={warningText}>
                    ⚠️ Your expenses exceed your income. Please adjust your budget limits to ensure your spending stays within your means.
                </ThemedText>
            </View>
            <TouchableOpacity style={[primaryButton, { alignSelf: 'center' , marginTop: "20%"}]} onPress={() => setCurrentStep(3)}>
                <ThemedText style={buttonText}>Adjust Expenses</ThemedText>
            </TouchableOpacity>
            </>
            }
            
           
            
          </View>
          {projectedSavings >= 0 && (
            <View style={buttonContainer}>
                <TouchableOpacity style={secondaryButton} onPress={() => setCurrentStep(3)}>
                    <ThemedText style={secondaryButtonText}>Back</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={primaryButton} onPress={handleComplete}>
                    <ThemedText style={buttonText}>Start Tracking</ThemedText>
                </TouchableOpacity>
            </View>
         )}
        </View>
      )}

      <EnterVEModal
        visible={showVEModal}
        onClose={() => setShowVEModal(false)}
        onSubmit={handleAddCategory}
      />

      <ExtraInfoModal
        visible={showExtraInfoModal.show}
        onClose={() => setShowExtraInfoModal({show: false, text: ""})}
        text={showExtraInfoModal.text}
      />
    </View>
  );
}

const container: ViewStyle = {
  flex: 1,
  backgroundColor: Colors.background,
};

const screenContainer: ViewStyle = {
  flex: 1,
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingBottom: 40,
  marginTop: 20,
};

const contentContainer: ViewStyle = {
    flex: 1,
};

const titleContainer: ViewStyle = {
  justifyContent: 'center',
  alignItems: 'center',
  height: 50,
  marginTop: 0,
};

const titleText: TextStyle = {
  fontSize: 26,
  fontWeight: 'bold',
  color: Colors.text,
  textAlign: 'center',
};

const bodyText: TextStyle = {
  fontSize: 16,
  color: Colors.text,
  marginBottom: 16,
  textAlign: 'center',
};

const philosophyContainer: ViewStyle = {
    marginTop: 10,
  paddingHorizontal: 10,
};

const exampleContainer: ViewStyle = {
  backgroundColor: Colors.dark3,
  padding: 16,
  borderRadius: 8,
  marginBottom: 20,
};

const exampleText: TextStyle = {
  fontSize: 14,
  color: Colors.textSecondary,
  fontStyle: 'italic',
};

const veListContainer: ViewStyle = {
  flex: 1,
  marginTop: 0,
};

const summaryContainer: ViewStyle = {
  backgroundColor: Colors.dark3,
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
  marginTop: 20,
};

const summaryRow: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
};

const totalRow: ViewStyle = {
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  borderTopWidth: 1,
  borderTopColor: Colors.textSecondary,
  paddingTop: 12,
  marginTop: 8,
  marginBottom: 0,
};

const summaryLabel: TextStyle = {
  fontSize: 16,
  color: Colors.text,
};

const summaryValue: TextStyle = {
  fontSize: 16,
  color: Colors.text,
  fontWeight: '500',
};

const totalLabel: TextStyle = {
  fontSize: 18,
  fontWeight: 'bold',
};

const totalValue: TextStyle = {
  fontSize: 32,
  textAlign: 'center',
  alignItems: 'center',
  fontWeight: 'bold',
  marginTop: 10,
};

const positiveValue: TextStyle = {
  color: Colors.buttonGreen,
};

const negativeValue: TextStyle = {
  color: Colors.colorCritical,
};

const warningContainer: ViewStyle = {
  backgroundColor: Colors.colorCritical + '20',
  padding: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: Colors.colorCritical,
  marginBottom: 16,
};

const warningText: TextStyle = {
  color: Colors.colorCritical,
  fontSize: 14,
  textAlign: 'center',
};

const buttonContainer: ViewStyle = {
  flexDirection: 'row',
  gap: 12,
};

const fullWidthButton: ViewStyle = {
    width: "100%",
    backgroundColor: Colors.buttonGreen,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  };

const primaryButton: ViewStyle = {
  backgroundColor: Colors.buttonGreen,
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  width: "60%",
};

const secondaryButton: ViewStyle = {
  flex: 1,
  width: "35%",
  backgroundColor: 'transparent',
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: Colors.textSecondary,
};

const buttonText: TextStyle = {
  color: Colors.background,
  fontSize: 18,
  fontWeight: '600',
};

const secondaryButtonText: TextStyle = {
  color: Colors.textSecondary,
  fontSize: 18,
  fontWeight: '600',
}; 

const addCategoryButton: ViewStyle = {
  backgroundColor: Colors.dark3,
  padding: 16,
  borderRadius: 12,
  alignItems: 'center',
  borderWidth: 1,
  borderColor: Colors.buttonGreen,
  borderStyle: 'dashed',
  marginBottom: 16,
};

const addCategoryButtonText: TextStyle = {
  color: Colors.buttonGreen,
  fontSize: 16,
  fontWeight: '500',
}; 