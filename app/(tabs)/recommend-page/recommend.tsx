import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useLanguage } from '@/components/LanguageProvider';
import { translateText } from '@/utils/translation';

const RecommendScreen = () => {
  const router = useRouter();

  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  console.log('현재언어:', globalLanguage);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 80,
  },
});

export default RecommendScreen;
