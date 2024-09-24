import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '../../components/BottomTabNavigator';
import RecommendScreen from '../recommend/RecommendScreen';
import ThemeScreen from '../theme/ThemeScreen';
import DayScreen from '../recommend/DayScreen';
import WithWhoScreen from '../recommend/WithWhoScreen';
import BudgetScreen from '../recommend/BudgetScreen';
import RouteScreen from '../route/RouteScreen';
import MypageScreen from '../mypage/MypageScreen';  
import PasswordChange from '../mypage/PasswordChangeScreen';
import LanguageScreen from '../mypage/LanguageScreen';
import SplashScreen from '../SplashScreen';
import { RootStackParamList } from './navigationTypes'; 
import VehicleScreen from '../recommend/VehicleScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SplashScreen">
    <Stack.Screen 
        name="SplashScreen" 
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Tabs" 
        component={BottomTabNavigator} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="ThemeScreen" 
        component={ThemeScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="RecommendScreen" 
        component={RecommendScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="VehicleScreen" 
        component={VehicleScreen} 
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
        name="RouteScreen" 
        component={RouteScreen} 
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
