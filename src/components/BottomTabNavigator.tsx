import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ThemeScreen from '../screens/theme/ThemeScreen';
import RecommendScreen from '../screens/recommend/RecommendScreen';
import BaggageScreen from '../screens/baggage/BaggageScreen';
import MyPageScreen from '../screens/mypage/MypageScreen';
import { LanguageProvider } from '../components/LanguageProvider';

const App = () => {
  const [selectedTab, setSelectedTab] = useState<'Theme' | 'Recommend' | 'Baggage' | 'MyPage'>('Theme');

  const renderScreen = () => {
    switch (selectedTab) {
      case 'Theme':
        return <ThemeScreen />;
      case 'Recommend':
        return <RecommendScreen />;
      case 'Baggage':
        return <BaggageScreen />;
      case 'MyPage':
        return <MyPageScreen />;
      default:
        return null;
    }
  };

  return (
    <LanguageProvider>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>{renderScreen()}</View>
        <View style={styles.tabBar}>
          <TouchableOpacity onPress={() => setSelectedTab('Theme')}>
            <Image
              source={
                selectedTab === 'Theme'
                  ? require('../assets/images/bottomNavigationBar/theme-active.png')
                  : require('../assets/images/bottomNavigationBar/theme.png')
              }
              style={styles.icon1}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('Recommend')}>
            <Image
              source={
                selectedTab === 'Recommend'
                  ? require('../assets/images/bottomNavigationBar/recommend-active.png')
                  : require('../assets/images/bottomNavigationBar/recommend.png')
              }
              style={styles.icon2}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('Baggage')}>
            <Image
              source={
                selectedTab === 'Baggage'
                  ? require('../assets/images/bottomNavigationBar/baggage-active.png')
                  : require('../assets/images/bottomNavigationBar/baggage.png')
              }
              style={styles.icon3}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedTab('MyPage')}>
            <Image
              source={
                selectedTab === 'MyPage'
                  ? require('../assets/images/bottomNavigationBar/my-page-active.png')
                  : require('../assets/images/bottomNavigationBar/my-page.png')
              }
              style={styles.icon4}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </LanguageProvider>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
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

export default App;
