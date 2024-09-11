import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ThemeScreen from '../screens/theme/ThemeScreen';
import RecommendScreen from '../screens/recommend/ThemeScreen';
import MyPageScreen from '../screens/mypage/MypageScreen';

export type RootTabParamList = {
  Theme: undefined;
  Recommend: undefined;
  MyPage: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 상단 헤더 숨김
        tabBarShowLabel: false, // 텍스트 숨김
        tabBarStyle: {
          height: 100,
          justifyContent: 'center',
        },
        tabBarIconStyle: {
          marginTop: 10,
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
  );
};

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
  icon4: {
    width: 80,
    height: 50,
  },
});

export default BottomTabNavigator;
