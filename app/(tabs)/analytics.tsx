import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import { useAnalytics } from "@/hooks/realm/useAnalytics";
import { ScrollView, Text, View } from "react-native";

export default function AnalyticsScreen() {
  const { getCurrentMonthSummary, getAllMonthSummaries } = useAnalytics();
  const currentSummary = getCurrentMonthSummary();
  const allSummaries = getAllMonthSummaries();

  return (
    <PageView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={{ marginBottom: 20 }}>Analytics</ThemedText>
        
        {/* Current Month Summary */}
        <View style={{ marginBottom: 30 }}>
          <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
            Current Month ({currentSummary.monthId})
          </ThemedText>
          <View style={{ backgroundColor: '#1a1a1a', padding: 15, borderRadius: 10 }}>
            <Text style={{ color: '#fff', marginBottom: 5 }}>
              Budget: ${currentSummary.totalBudget.toFixed(2)}
            </Text>
            <Text style={{ color: '#fff', marginBottom: 5 }}>
              Spent: ${currentSummary.totalSpent.toFixed(2)}
            </Text>
            <Text style={{ color: '#fff', marginBottom: 5 }}>
              Remaining: ${currentSummary.remaining.toFixed(2)}
            </Text>
            <Text style={{ color: '#fff' }}>
              Usage: {currentSummary.percentageUsed.toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Historical Summary */}
        <View>
          <ThemedText type="subtitle" style={{ marginBottom: 10 }}>
            Historical Summary
          </ThemedText>
          {allSummaries.length > 0 ? (
            allSummaries.map((summary, index) => (
              <View 
                key={summary.monthId} 
                style={{ 
                  backgroundColor: '#1a1a1a', 
                  padding: 15, 
                  borderRadius: 10,
                  marginBottom: 10 
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', marginBottom: 5 }}>
                  {summary.monthId}
                </Text>
                <Text style={{ color: '#fff', fontSize: 12 }}>
                  Spent: ${summary.totalSpent.toFixed(2)} / ${summary.totalBudget.toFixed(2)} 
                  ({summary.percentageUsed.toFixed(1)}%)
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#fff', textAlign: 'center', marginTop: 20 }}>
              No historical data yet. Start tracking expenses to see analytics!
            </Text>
          )}
        </View>
      </ScrollView>
    </PageView>
  );
} 