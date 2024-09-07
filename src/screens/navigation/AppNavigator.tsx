import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreen';
import RecommendScreen from '../recommend/RecommendScreen';
import DayScreen from '../recommend/DayScreen';
import WithWhoScreen from '../recommend/WithWhoScreen';
import BudgetScreen from '../recommend/BudgetScreen';
import MypageScreen from '../mypage/MypageScreen';  
import PasswordChange from '../mypage/PasswordChangeScreen';
import LanguageScreen from '../mypage/LanguageScreen';
import SplashScreen from '../SplashScreen';
import { RootStackParamList } from './navigationTypes'; 

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
      <Stack.Screen 
        name="SplashScreen" 
        options={{ headerShown: false }}
      >
        {props => <SplashScreen {...props} navigateToHome={() => props.navigation.navigate('HomeScreen')} />}
      </Stack.Screen>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="RecommendScreen" 
        component={RecommendScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="DayScreen" 
        component={DayScreen} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="WithWhoScreen" 
        component={WithWhoScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="BudgetScreen" 
        component={BudgetScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MyPageScreen" 
        component={MypageScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="PasswordChangeScreen" 
        component={PasswordChange} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="LanguageScreen" 
        component={LanguageScreen} 
        options={{ headerShown: false }} 
      />

    </Stack.Navigator>
  );
}

export default AppNavigator;
