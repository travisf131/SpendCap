import PageView from "@/components/PageView";
import { ThemedText } from "@/components/ThemedText";
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const settingsMenuItems = [
  {
    id: 'financial',
    title: 'Personal Financial Info',
    subtitle: 'Income, expenses, and budget categories',
    icon: 'account-balance-wallet',
    route: '/settings/financial'
  },
  {
    id: 'preferences',
    title: 'Preferences',
    subtitle: 'Currency, display options, and app preferences',
    icon: 'settings',
    route: '/settings/preferences'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Spending alerts and reminders',
    icon: 'notifications',
    route: '/settings/notifications'
  },
  {
    id: 'export',
    title: 'Export Data',
    subtitle: 'Backup and export your spending data',
    icon: 'file-download',
    route: '/settings/export'
  },
  {
    id: 'about',
    title: 'About',
    subtitle: 'App version and support',
    icon: 'info',
    route: '/settings/about'
  }
];

export default function SettingsScreen() {
  const handleMenuPress = (route: string) => {
    if (route === '/settings/financial') {
      router.push('/settings/financial' as any);
    } else if (route === '/settings/preferences') {
      router.push('/settings/preferences' as any);
    } else {
      // For now, just show that these are coming soon
      console.log(`Navigate to: ${route} - Coming soon!`);
    }
  };


  return (
    <PageView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>

        <View style={styles.menuContainer}>
          {settingsMenuItems.map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Icon name={item.icon as any} size={24} color={Colors.tint} />
                </View>
                <View style={styles.textContainer}>
                  <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.menuSubtitle}>{item.subtitle}</ThemedText>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>



        <View style={styles.bottomPadding} />
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 24,
  },
  menuContainer: {
    gap: 2,
  },
  menuItem: {
    backgroundColor: Colors.dark3,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 30,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomPadding: {
    height: 100,
  },
  testSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.dark3,
    borderRadius: 12,
  },
  testSectionTitle: {
    marginBottom: 12,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark4,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  testButtonText: {
    fontSize: 16,
    color: Colors.tint,
  },
}); 