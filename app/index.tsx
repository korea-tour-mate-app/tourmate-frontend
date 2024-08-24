import React from 'react';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from './(tabs)/splash'; // 또는 필요에 따라 다른 경로
import { LanguageProvider } from '@/components/LanguageProvider'; // 적절한 경로로 수정

export default function Index() {
  const [fontsLoaded] = useFonts({
    'AggroL': require('@/assets/fonts/SB Aggro L.ttf'),
    'AggroB': require('@/assets/fonts/SB Aggro B.ttf'),
    'AggroM': require('@/assets/fonts/SB Aggro M.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <SplashScreen />
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}
