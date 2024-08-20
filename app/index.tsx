import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Font from 'expo-font';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { HelloWave } from '@/components/HelloWave';
import { LanguageProvider } from '@/components/LanguageProvider';
import SplashScreen from './(tabs)/splash';
import { useFonts } from 'expo-font';


export default function Index() {
  const [fontsLoaded] = useFonts({
    'AggroL': require('@/assets/fonts/SB Aggro L.ttf'),
    'AggroB': require('@/assets/fonts/SB Aggro B.ttf'),
    'AggroM': require('@/assets/fonts/SB Aggro M.ttf'),
  });

  if (!fontsLoaded) {
    return <View><Text>Loading...</Text></View>;
  }
  return (
    <LanguageProvider>
      <SplashScreen/>
    </LanguageProvider>
  );
}
