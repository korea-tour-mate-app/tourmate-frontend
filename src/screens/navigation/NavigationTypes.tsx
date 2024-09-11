// navigation/navigationTypes.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  Tabs: undefined;
  ThemeScreen: undefined;
  DayScreen: undefined;
  WithWhoScreen: undefined;
  BudgetScreen: undefined;
  VehicleScreen: undefined;
  RouteScreen: undefined;
  MyPageScreen: { language?: string };
  PasswordChangeScreen: undefined;
  LanguageScreen: undefined;
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;
