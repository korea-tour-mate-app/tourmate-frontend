import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreen';
import RecommendScreen from '../recommend/RecommendScreen';
import DayScreen from '../recommend/DayScreen';
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
        name="PasswordChange" 
        component={PasswordChange} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="LanguageScreen" 
        component={LanguageScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="MyPage" 
        component={MypageScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
