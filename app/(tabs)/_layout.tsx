import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import Icon from "@/components/ui/Icon";
import { Colors } from "@/constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            borderTopWidth: 0,
            height: 60,
            backgroundColor: Colors.background,
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Budget",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="savings" color={color} />
          ),
          tabBarIconStyle: { marginTop: 5 },
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="insights" color={color} />
          ),
          tabBarIconStyle: { marginTop: 5 },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Icon size={28} name="menu" color={color} />
          ),
          tabBarIconStyle: { marginTop: 5 },
        }}
      />
    </Tabs>
  );
} 