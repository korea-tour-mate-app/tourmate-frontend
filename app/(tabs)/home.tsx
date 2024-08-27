import React from 'react';
import { Stack, useRouter } from 'expo-router';
import BottomTabNavigator from '@/components/BottomTabNavigator';
import { LanguageProvider } from '@/components/LanguageProvider';

const HomeScreen = () => {
    const router = useRouter();
  
    return (
        <BottomTabNavigator />
    );
};

export default HomeScreen;
