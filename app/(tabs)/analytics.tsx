import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import Icon from '@/components/ui/Icon';
import { Colors } from "@/constants/Colors";
import { useHistory } from "@/hooks/realm/useHistory";
import { useCurrency } from "@/hooks/useCurrency";
import { getMonthYearFromId } from "@/utils/getCurrentMonthYear";
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AnalyticsScreen() {
  const { 
    getAllMonthSummaries, 
    getOverallStats,
    getTopSpendingCategories,
    getOverspendingAnalysis
  } = useHistory();
  const overallStats = getOverallStats();
  const allMonths = getAllMonthSummaries();
  const topSpendingCategories = getTopSpendingCategories();
  const overspendingAnalysis = getOverspendingAnalysis();
  const { getSymbol} = useCurrency();
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = useCallback((monthId: string) => {
    setExpandedCards(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(monthId)) {
        newExpanded.delete(monthId);
      } else {
        newExpanded.add(monthId);
      }
      return newExpanded;
    });
  }, []);

  return (
    <PageView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <ThemedText type="title" style={{ marginBottom: 0 }}>History</ThemedText>
        
        {/* Overall Stats */}
        <View style={{ marginBottom: 30 }}>
          <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
            Overall Insights
          </ThemedText>
          {allMonths.length > 0 ? (
            <View style={styles.overallStatsCard}>
              {/* Key Metrics Row */}
              <View style={styles.keyMetricsRow}>
                <View style={styles.keyMetricItem}>
                  <Text style={[styles.keyMetricValue, {color: overallStats.totalSaved > 0 ? Colors.buttonGreen : Colors.red}]}>{getSymbol()}{overallStats.totalSaved.toFixed(0)}</Text>
                  <Text style={styles.keyMetricLabel}>Total Money Saved</Text>
                </View>
                <View style={styles.keyMetricItem}>
                  <Text style={[styles.keyMetricValue, {color: overallStats.averagePercentageUsed > 100 ? Colors.red : Colors.buttonGreen}]}>{overallStats.averagePercentageUsed.toFixed(0)}%</Text>
                  <Text style={styles.keyMetricLabel}>Avg Budget Usage</Text>
                </View>
                <View style={styles.keyMetricItem}>
                  <Text style={[styles.keyMetricValue, {color: overallStats.averageSaved > 0 ? Colors.buttonGreen : Colors.red}]}>{getSymbol()}{overallStats.averageSaved.toFixed(0)}</Text>
                  <Text style={styles.keyMetricLabel}>Avg Saved Monthly</Text>
                </View>
              </View>

              {/* Budget Adherence */}
              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Budget Adherence</Text>
                <View style={styles.adherenceBar}>
                  <View 
                    style={[
                      styles.adherenceFill, 
                      { 
                        width: `${Math.min(overallStats.averagePercentageUsed, 100)}%`,
                        backgroundColor: overallStats.averagePercentageUsed > 100 ? Colors.red : Colors.softGreen
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.adherenceText}>
                  {overallStats.averagePercentageUsed > 100 
                    ? `You're overspending by ${(overallStats.averagePercentageUsed - 100).toFixed(0)}% on average`
                    : `You're staying ${(100 - overallStats.averagePercentageUsed).toFixed(0)}% under budget on average`
                  }
                </Text>
              </View>

              {/* Savings Rate */}
              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Savings Rate</Text>
                <Text style={styles.savingsRateText}>
                  You&apos;re saving {overallStats.averagePercentageSaved.toFixed(1)}% of your income on average
                </Text>
                <Text style={styles.savingsRateSubtext}>
                  {overallStats.averagePercentageSaved > 20 
                    ? "Excellent! You're building wealth consistently."
                    : overallStats.averagePercentageSaved > 10
                    ? "Good progress! Consider increasing your savings rate."
                    : "Consider reviewing your spending to increase savings."
                  }
                </Text>
              </View>

              {/* Top Spending Categories */}
              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Top Spending Categories</Text>
                <View>
                  {topSpendingCategories.map((category, index) => (
                    <View key={index} style={styles.topCategoryItem}>
                      <Text style={styles.topCategoryName}>{category.name}</Text>
                      <Text style={styles.topCategoryAmount}>
                        {getSymbol()}{category.average.toFixed(0)}/month
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Overspending Analysis
              {/*
              <View style={styles.insightSection}>
                <Text style={styles.insightTitle}>Overspending Analysis</Text>
                {overspendingAnalysis.length > 0 ? (
                  <View>
                    {overspendingAnalysis.map((category, index) => (
                      <Text key={index} style={styles.overspendText}>
                        {category.name}: {category.overspendRate.toFixed(0)}% of months over budget
                      </Text>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noOverspendText}>Great job! No consistent overspending patterns.</Text>
                )}
              </View> */}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No historical data yet. Track expenses for at least 1 month to see insights!
              </Text>
            </View>
          )}
        </View>


        {/* Past Months */}
        <View>
          <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
            Past Months
          </ThemedText>
          {allMonths.length > 0 ? (
            allMonths.map((month, index) => {
              const isExpanded = expandedCards.has(month.monthId);
              return (
                <View key={index} style={styles.monthCard}>
                  {/* Compact Header */}
                  <TouchableOpacity 
                    style={styles.cardHeader}
                    onPress={() => toggleCard(month.monthId)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.headerLeft}>
                      <Text style={styles.monthTitle}>
                        {getMonthYearFromId(month.monthId)}
                      </Text>
                      <View style={[
                        styles.savingsBadge,
                        { backgroundColor: month.totalSaved > 0 ? Colors.buttonGreen + '20' : Colors.red + '20' }
                      ]}>
                        <Text style={[
                          styles.savingsText,
                          { color: month.totalSaved > 0 ? Colors.buttonGreen : Colors.red }
                        ]}>
                          {getSymbol()}{Math.abs(month.totalSaved).toFixed(0)}
                        </Text>
                        <Text style={[
                          styles.savingsLabel,
                          { color: month.totalSaved > 0 ? Colors.buttonGreen : Colors.red }
                        ]}>
                          {month.totalSaved > 0 ? '  Saved' : '  Over'}
                        </Text>
                      </View>
                    </View>
                    <Icon 
                      name={isExpanded ? "expand-less" : "expand-more"} 
                      size={24} 
                      color={Colors.textSecondary} 
                    />
                  </TouchableOpacity>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <View style={styles.expandedContent}>
                      {/* Key Metrics Grid */}
                      <View style={styles.metricsGrid}>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Budget</Text>
                          <Text style={styles.metricValue}>{getSymbol()}{month.totalBudget.toFixed(0)}</Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Spent</Text>
                          <Text style={[styles.metricValue, {color: month.totalSpent > month.totalBudget ? Colors.red : Colors.buttonGreen }]}>{getSymbol()}{month.totalSpent.toFixed(0)}</Text>
                        </View>
                        <View style={styles.metricItem}>
                          <Text style={styles.metricLabel}>Usage</Text>
                          <Text style={[
                            styles.metricValue,
                            { color: month.percentageUsed > 100 ? Colors.red : Colors.buttonGreen }
                          ]}>
                            {month.percentageUsed.toFixed(0)}%
                          </Text>
                        </View>
                      </View>

                
                      {/* Top Categories */}
                      {/* <View style={styles.topCategories}>
                        <Text style={styles.topCategoriesLabel}>Top Spending</Text>
                        <Text style={styles.topCategoriesText}>
                          {month.variableExpenses
                            .sort((a, b) => b.spent - a.spent)
                            .slice(0, 2)
                            .map(ve => `${ve.name} (${getSymbol()}${ve.spent.toFixed(0)})`)
                            .join(' • ')}
                        </Text>
                      </View> */}

                      {/* Category Breakdown */}
                      <View style={styles.categoryBreakdown}>
                        <Text style={styles.categoryBreakdownLabel}>Spend For All Categories</Text>
                        {month.variableExpenses
                          .sort((a, b) => b.percentageUsed - a.percentageUsed)
                          .map((ve, index) => (
                            <View key={index} style={styles.categoryItem}>
                              <View style={styles.categoryHeader}>
                                <Text style={styles.categoryName}>{ve.name}</Text>
                                <Text style={styles.categoryAmount}>
                                  {getSymbol()}{ve.spent.toFixed(0)} / {getSymbol()}{ve.limit.toFixed(0)}
                                </Text>
                              </View>
                              <View style={styles.categoryProgress}>
                                <View style={styles.progressBar}>
                                  <View 
                                    style={[
                                      styles.progressFill,
                                      { 
                                        width: `${Math.min((ve.spent / ve.limit) * 100, 100)}%`,
                                        backgroundColor: ve.spent > ve.limit ? Colors.softRed : Colors.softGreen  
                                      }
                                    ]} 
                                  />
                                </View>
                                <Text style={[
                                  styles.categoryPercentage,
                                  { color: ve.spent > ve.limit ? Colors.red : Colors.softGreen }
                                ]}>
                                  {((ve.spent / ve.limit) * 100).toFixed(0)}%
                                </Text>
                              </View>
                            </View>
                          ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No historical data yet. Track expenses for at least 1 month to see insights!
              </Text>
            </View>
          )}
        </View>

    
      </ScrollView>
    </PageView>
  );
} 

const styles = StyleSheet.create({
  monthCard: {
    backgroundColor: Colors.dark3,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 12,
  },
  savingsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  savingsText: {
    fontSize: 16,
    fontWeight: '700',
  },
  savingsLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
    marginTop: 0,
  },
  metricItem: {
    alignItems: 'center',
    backgroundColor: Colors.dark4,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryBreakdown: {
    marginTop: 5,
    paddingTop:10,
  },
  categoryBreakdownLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '500',
  },
  categoryItem: {
    marginBottom: 12,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryAmount: {
    fontSize: 12,
    color: Colors.text,
  },
  categoryProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.dark4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  categoryPercentage: {
    fontSize: 10,
    marginLeft: 8,
  },
  emptyState: {
    backgroundColor: Colors.dark3,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  overallStatsCard: {
    backgroundColor: Colors.dark3,
    borderRadius: 16,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  keyMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  keyMetricItem: {
    alignItems: 'center',
    backgroundColor: Colors.dark4,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    width: '30%',
  },
  keyMetricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 5,
  },
  keyMetricLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  insightSection: {
    marginBottom: 20,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  adherenceBar: {
    height: 10,
    backgroundColor: Colors.dark4,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 5,
  },
  adherenceFill: {
    height: '100%',
    borderRadius: 5,
  },
  adherenceText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 5,
  },
  savingsRateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  savingsRateSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  spendingAnalysis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  analysisItem: {
    alignItems: 'center',
  },
  analysisLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  analysisValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  topCategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topCategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  topCategoryAmount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  overspendText: {
    fontSize: 14,
    color: Colors.red,
    marginBottom: 5,
  },
  noOverspendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});