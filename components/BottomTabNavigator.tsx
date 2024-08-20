import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavoritesScreen from '@/app/(tabs)/favorites-page/favorites';
import ThemeScreen from '@/app/(tabs)/theme-page/theme';
import RecommendScreen from '@/app/recommend-page/recommend';
import LuggageScreen from '@/app/(tabs)/luggage-page/luggage';
import MyPageScreen from '@/app/(tabs)/my-page/mypage';
import { LanguageProvider } from '@/components/LanguageProvider';

export type RootTabParamList = {
  Favorites: undefined;
  Theme: undefined;
  Recommend: undefined;
  Luggage: undefined;
  MyPage: { language: string };
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const BottomTabNavigator = () => {
  return (
    <LanguageProvider>
      <Tab.Navigator
        screenOptions={{
          headerShown: false, // 상단 헤더 숨김
          tabBarShowLabel: false, // 텍스트 숨김
          tabBarStyle:{
            height: 100,
            justifyContent: 'center'
          },
          tabBarIconStyle: {
            marginTop: 10,
          },
        }}
      >
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('@/assets/images/favorites-active.png')
                    : require('@/assets/images/favorites.png')
                }
                style={styles.icon1}
                resizeMode='contain'
              />
            ),
          }}
        />
        <Tab.Screen
          name="Theme"
          component={ThemeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('@/assets/images/theme-active.png')
                    : require('@/assets/images/theme.png')
                }
                style={styles.icon2}
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
                    ? require('@/assets/images/recommend-active.png')
                    : require('@/assets/images/recommend.png')
                }
                style={styles.icon3}
                resizeMode='contain'
              />
            ),
          }}
        />
        <Tab.Screen
          name="Luggage"
          component={LuggageScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                source={
                  focused
                    ? require('@/assets/images/luggage-active.png')
                    : require('@/assets/images/luggage.png')
                }
                style={styles.icon4}
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
                    ? require('@/assets/images/my-page-active.png')
                    : require('@/assets/images/my-page.png')
                }
                style={styles.icon5}
                resizeMode='contain'
              />
            ),
          }}
        />
      </Tab.Navigator>
      </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  icon1: {
    width: 70, 
    height: 45, 
  },
  icon2: {
    width: 70,  
    height: 50, 
    marginBottom: 6,
  },
  icon3: {
    width: 80,  
    height: 50, 
  },
  icon4: {
    width: 80,  
    height: 50, 
  },
  icon5: {
    width: 80,  
    height: 50, 
  },
});

export default BottomTabNavigator;
