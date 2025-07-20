import { useSettings } from '@/hooks/useSettings';
import { Stack } from "expo-router";
import React, { useEffect, useState } from 'react';
import OnboardingFlow from './OnboardingFlow';

export default function AppWrapper() {
  const { getSettings } = useSettings();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check onboarding status on app load
    const settings = getSettings();
    setShowOnboarding(!settings.hasCompletedOnboarding);
    setIsLoading(false);
  }, [getSettings]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Show loading state while checking onboarding status
  if (isLoading) {
    return null;
  }

  // Show onboarding if not completed
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Show main app
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
} 