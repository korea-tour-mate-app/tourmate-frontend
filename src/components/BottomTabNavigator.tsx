// components/BottomTabNavigator.tsx
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThemeScreen from '../screens/theme/ThemeScreen';
import RecommendScreen from '../screens/recommend/RecommendScreen';
import BaggageScreen from '../screens/baggage/BaggageScreen';
import MyPageScreen from '../screens/mypage/MypageScreen';
import { LanguageProvider } from './LanguageProvider';

// 탭 네비게이션에서 사용할 파라미터 타입 정의
export type RootTabParamList = {
  Theme: undefined;
  Recommend: undefined;
  Baggage: undefined;
  MyPage: { language: string };
};

// BottomTabNavigator 컴포넌트 정의
const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
  return (
    <LanguageProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // 상단 헤더 숨김
          tabBarShowLabel: false, // 탭 텍스트 숨김
          tabBarStyle: {
            height: 100, // 탭 바의 높이
            justifyContent: 'center', // 탭 바 내용 중앙 정렬
          },
          tabBarIconStyle: {
            marginTop: 10, // 탭 아이콘의 위쪽 여백
          },
        }}
      >
        <Tab.Screen
          name="Theme"
          component={ThemeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('../assets/images/bottomNavigationBar/theme-active.png')
                    : require('../assets/images/bottomNavigationBar/theme.png')
                }
                style={styles.icon1}
                resizeMode='contain'
              />
            ),
          }}
        />
        <Tab.Screen
          name="Recommend"
          component={RecommendScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('../assets/images/bottomNavigationBar/recommend-active.png')
                    : require('../assets/images/bottomNavigationBar/recommend.png')
                }
                style={styles.icon2}
                resizeMode='contain'
              />
            ),
          }}
        />
        <Tab.Screen
          name="Baggage"
          component={BaggageScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('../assets/images/bottomNavigationBar/baggage-active.png')
                    : require('../assets/images/bottomNavigationBar/baggage.png')
                }
                style={styles.icon3}
                resizeMode='contain'
              />
            ),
          }}
        />
        <Tab.Screen
          name="MyPage"
          component={MyPageScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('../assets/images/bottomNavigationBar/my-page-active.png')
                    : require('../assets/images/bottomNavigationBar/my-page.png')
                }
                style={styles.icon4}
                resizeMode='contain'
              />
            ),
          }}
        />
      </Tab.Navigator>
    </LanguageProvider>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  icon1: {
    width: 70,
    height: 50,
    marginBottom: 6,
  },
  icon2: {
    width: 80,
    height: 50,
  },
  icon3: {
    width: 80,
    height: 50,
    marginLeft: 10,
  },
  icon4: {
    width: 80,
    height: 50,
  },
});

export default BottomTabNavigator;

