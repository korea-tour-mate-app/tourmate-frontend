import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('SplashScreen');

  const navigateToHome = () => {
    setCurrentScreen('HomeScreen');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'SplashScreen' && <SplashScreen navigateToHome={navigateToHome} />}
      {currentScreen === 'HomeScreen' && <HomeScreen />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
