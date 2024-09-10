import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LanguageProvider } from './src/components/LanguageProvider';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/screens/navigation/AppNavigator';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');

  const navigateToHome = () => {
    setCurrentScreen('HomeScreen');
  };

  return (
    <LanguageProvider>
    <NavigationContainer>
      <View style={styles.container}>
      <AppNavigator/>
      </View>
    </NavigationContainer>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
