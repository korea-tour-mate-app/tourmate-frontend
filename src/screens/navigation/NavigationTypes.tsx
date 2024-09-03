// navigation/navigationTypes.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  RecommendScreen: undefined;
  BudgetScreen: undefined;
  DayScreen: undefined;
  WithWhoScreen: undefined;
  MyPage: { language?: string };
  PasswordChange: undefined;
  MyReviews: undefined;
  MyPlaces: undefined;
  LanguageSettings: undefined;
  LanguageScreen: undefined;
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;
