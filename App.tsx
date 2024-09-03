import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import { LanguageProvider } from './src/components/LanguageProvider'; // LanguageProvider를 임포트합니다.
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/screens/navigation/AppNavigator';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');

  const navigateToHome = () => {
    setCurrentScreen('HomeScreen');
  };

  return (
    <NavigationContainer>
    <LanguageProvider>
      <View style={styles.container}>
      <AppNavigator/>
      </View>
    </LanguageProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
