// navigation/navigationTypes.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  Tabs: undefined;
  RecommendScreen: undefined;
  DayScreen: undefined;
  WithWhoScreen: { totalDays: number; startDate: string; endDate: string };
  BudgetScreen: { totalDays: number; startDate: string; endDate: string };
  RouteScreen: { totalDays: number; startDate: string; endDate: string };
  VehicleScreen: { totalDays: number; startDate: string; endDate: string };
  MyPageScreen: { language?: string };
  PasswordChangeScreen: undefined;
  LanguageScreen: undefined;
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;
