import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LanguageProvider } from './src/components/LanguageProvider';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import ThemeScreen from './src/screens/theme/ThemeScreen';
import RecommendScreen from './src/screens/recommend/RecommendScreen';
import DayScreen from './src/screens/recommend/DayScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <LanguageProvider>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // 모든 스크린에서 헤더를 숨김
          }}
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="ThemeScreen" component={ThemeScreen} />
          <Stack.Screen name="RecommendScreen" component={RecommendScreen} />
          <Stack.Screen name="DayScreen" component={DayScreen} />
        </Stack.Navigator>
      </LanguageProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
