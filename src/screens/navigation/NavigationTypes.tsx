// navigation/navigationTypes.ts
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  RecommendScreen: undefined;
  BudgetScreen: undefined;
  DayScreen: undefined;
  WithWhoScreen: undefined;

  PasswordChange: undefined;
  MyReviews: undefined;
  MyPlaces: undefined;
  LanguageSettings: undefined;
  LanguageScreen: undefined;
  MyPage: { language: string }; // MyPage 화면에 전달할 파라미터
};

export type RootStackNavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<RootStackParamList, T>;

