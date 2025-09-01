import Header from "@/components/generic/Header";
import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ExplainedScreen() {
  return (
    <PageView>
     <Header title="How SpendCap Works" />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* Philosophy Section */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Our Philosophy
          </ThemedText>
          <ThemedText style={styles.bodyText}>
            SpendCap is built on a simple but powerful principle: focus on what you can control. 
            Traditional budgeting apps try to track everything, which often leads to complexity 
            and abandonment. SpendCap takes a different approach.
          </ThemedText>
        </View>

        {/* Variable vs Fixed Expenses */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Variable vs Fixed Expenses
          </ThemedText>
          
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="trending-up" size={20} color={Colors.buttonGreen} />
              <ThemedText style={styles.cardTitle}>Variable Expenses</ThemedText>
            </View>
            <ThemedText style={styles.cardText}>
              These are the expenses you have control over: dining out, entertainment, 
              shopping, hobbies, etc. These are what we track actively because they&apos;re 
              where you can make real changes to your spending habits.
            </ThemedText>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="schedule" size={20} color={Colors.buttonGreen} />
              <ThemedText style={styles.cardTitle}>Fixed Expenses</ThemedText>
            </View>
            <ThemedText style={styles.cardText}>
              Rent, utilities, insurance, subscriptions - these are set in stone 
              and don&apos;t change much month to month. We keep these in the background 
              to calculate your available spending money, but don&apos;t actively track them.
            </ThemedText>
          </View>
        </View>

        {/* The Spending Cap Approach */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            The Spending Cap Approach
          </ThemedText>
          
          <View style={styles.highlightBox}>
            <ThemedText style={styles.highlightTitle}>
              Your Primary Goal: Stick to Your Overall Spending Limit
            </ThemedText>
            <ThemedText style={styles.highlightText}>
              Instead of micromanaging every category, we focus on your total 
              variable spending. If you&apos;re under your overall limit, you can 
              reallocate money between categories as needed.
            </ThemedText>
          </View>

          <ThemedText style={styles.bodyText}>
            This approach gives you flexibility while maintaining accountability. 
            Want to spend more on dining this month? That&apos;s fine, as long as 
            you reduce spending in another category to stay within your total limit.
          </ThemedText>
        </View>

        {/* Key Benefits */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Why This Works Better
          </ThemedText>

          <View style={styles.benefitItem}>
            <View style={styles.iconContainer}>
              <Icon name="psychology" size={20} color={Colors.buttonGreen} />
            </View>
            <View style={styles.benefitText}>
              <ThemedText style={styles.benefitTitle}>Reduces Decision Fatigue</ThemedText>
              <ThemedText style={styles.benefitDescription}>
                You don&apos;t need to agonize over every small purchase. Focus on the big picture.
              </ThemedText>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.iconContainer}>
              <Icon name="trending-up" size={20} color={Colors.buttonGreen} />
            </View>
            <View style={styles.benefitText}>
              <ThemedText style={styles.benefitTitle}>Provides Flexibility</ThemedText>
              <ThemedText style={styles.benefitDescription}>
                Life happens. Move money between categories as your needs change.
              </ThemedText>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.iconContainer}>
              <Icon name="check" size={20} color={Colors.buttonGreen} />
            </View>
            <View style={styles.benefitText}>
              <ThemedText style={styles.benefitTitle}>Maintains Accountability</ThemedText>
              <ThemedText style={styles.benefitDescription}>
                You still have a hard limit, preventing overspending while allowing adaptation.
              </ThemedText>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.iconContainer}>
              <Icon name="schedule" size={20} color={Colors.buttonGreen} />
            </View>
            <View style={styles.benefitText}>
              <ThemedText style={styles.benefitTitle}>Keeps It Simple</ThemedText>
              <ThemedText style={styles.benefitDescription}>
                Less complexity means you&apos;re more likely to stick with it long-term.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* How to Use */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            How to Use SpendCap
          </ThemedText>

          <View style={styles.stepItem}>
            <ThemedText style={styles.stepNumberText}>1.</ThemedText>
            <View style={styles.stepText}>
              <ThemedText style={styles.stepTitle}>Set Your Income & Fixed Expenses</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Enter your monthly take-home income and fixed expenses. This calculates 
                your available spending money.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <ThemedText style={styles.stepNumberText}>2.</ThemedText>
            <View style={styles.stepText}>
              <ThemedText style={styles.stepTitle}>Create Variable Expense Categories</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Add categories for your variable expenses. Set reasonable limits 
                that add up to your available spending money.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <ThemedText style={styles.stepNumberText}>3.</ThemedText>
            <View style={styles.stepText}>
              <ThemedText style={styles.stepTitle}>Track Your Spending</ThemedText>
              <ThemedText style={styles.stepDescription}>
                Log your variable expenses as they happen. The app shows you 
                remaining amounts and overall progress.
              </ThemedText>
            </View>
          </View>

          <View style={styles.stepItem}>
            <ThemedText style={styles.stepNumberText}>4.</ThemedText>
            <View style={styles.stepText}>
              <ThemedText style={styles.stepTitle}>Adjust as Needed</ThemedText>
              <ThemedText style={styles.stepDescription}>
                If you need to spend more in one category, reduce another to 
                stay within your total spending limit.
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Success Tips */}
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Tips for Success
          </ThemedText>

          <View style={styles.tipItem}>
            <View style={styles.iconContainer}>
              <Icon name="lightbulb" size={16} color={Colors.buttonGreen} />
            </View>
            <ThemedText style={styles.tipText}>
              Start with broad categories rather than overly specific ones
            </ThemedText>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.iconContainer}>
              <Icon name="lightbulb" size={16} color={Colors.buttonGreen} />
            </View>
            <ThemedText style={styles.tipText}>
              Review your spending patterns monthly and adjust categories accordingly
            </ThemedText>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.iconContainer}>
              <Icon name="lightbulb" size={16} color={Colors.buttonGreen} />
            </View>
            <ThemedText style={styles.tipText}>
              Don&apos;t stress about small overages - focus on the overall trend
            </ThemedText>
          </View>

          <View style={styles.tipItem}>
            <View style={styles.iconContainer}>
              <Icon name="lightbulb" size={16} color={Colors.buttonGreen} />
            </View>
            <ThemedText style={styles.tipText}>
              Use the analytics to understand your spending habits over time
            </ThemedText>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({

  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  bodyText: {
    color: Colors.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.dark3,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cardText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  highlightBox: {
    backgroundColor: Colors.dark3,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.buttonGreen,
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  highlightText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 0,
  },
  benefitDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },

  stepNumberText: {
    color: Colors.buttonGreen,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 7,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  stepDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
  iconContainer: {
    width: 20,
    height: 20,
    marginTop: 6
  },
});
