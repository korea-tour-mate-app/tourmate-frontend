import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/NavigationTypes'; 
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';

type MyPageScreenRouteProp = RouteProp<RootStackParamList, 'MyPageScreen'>;
type MyPageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyPageScreen'>;

const MyPageScreen = () => {
  const route = useRoute<MyPageScreenRouteProp>();
  const navigation = useNavigation<MyPageScreenNavigationProp>();
  const [currentDate, setCurrentDate] = useState<string>('');
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();

  const [changeHi, setChangeHi] = useState<string>('안녕하세요,');
  const [changePasswordText, setChangePasswordText] = useState<string>('비밀번호 변경');
  const [myReviewsText, setMyReviewsText] = useState<string>('내 리뷰');
  const [myPlacesText, setMyPlacesText] = useState<string>('내가 가본 장소');
  const [languageSettingsText, setLanguageSettingsText] = useState<string>('언어 설정');
  const [logoutText, setLogoutText] = useState<string>('로그아웃');

  useEffect(() => {
    if (route.params?.language) {
      setGlobalLanguage(route.params.language);
      setForceUpdate(prev => !prev); 
    }
  }, [route.params?.language]);

  useEffect(() => {
    const translateMenuTexts = async () => {
      try {
        const translatedHi = await translateText('안녕하세요,', globalLanguage);
        setChangeHi(translatedHi);

        const translatedPassword = await translateText('비밀번호 변경', globalLanguage);
        setChangePasswordText(translatedPassword);

        const translatedReviews = await translateText('내 리뷰', globalLanguage);
        setMyReviewsText(translatedReviews);

        const translatedPlaces = await translateText('내가 가본 장소', globalLanguage);
        setMyPlacesText(translatedPlaces);

        const translatedLanguageSettings = await translateText('언어 설정', globalLanguage);
        setLanguageSettingsText(translatedLanguageSettings);

        const translatedLogout = await translateText('로그아웃', globalLanguage);
        setLogoutText(translatedLogout);

      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateMenuTexts();
  }, [globalLanguage]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    setCurrentDate(formattedDate);
  }, []);

  const navigateToPasswordChange = () => {
    navigation.navigate('PasswordChangeScreen');
  };

  const navigateToLanguageScreen = () => {
    navigation.navigate('LanguageScreen');
  };

  const handleLogout = () => {
    navigation.navigate("SplashScreen");
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.userTextContainer}>
          <Text style={styles.userText}>{changeHi}</Text>
          <Text style={styles.userText}>TOM</Text>
        </View>
        <View style={styles.redLine}>
          <Text style={styles.date}>{currentDate}</Text>
        </View>
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle}>
            <View style={styles.circleContainer}>
              <View style={styles.circle} />
            </View>
            <View style={styles.menuContainer}>
              <TouchableOpacity onPress={navigateToPasswordChange}>
                <Text style={styles.menu}>{changePasswordText}</Text>
              </TouchableOpacity>
              <View style={styles.dottedLineContainer}>
                <Svg height="2" width="75%">
                  <Line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="5,2"
                  />
                </Svg>
              </View>

              <TouchableOpacity>
                <Text style={styles.menu}>{myReviewsText}</Text>
              </TouchableOpacity>
              <View style={styles.dottedLineContainer}>
                <Svg height="2" width="75%">
                  <Line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="5,2"
                  />
                </Svg>
              </View>

              <TouchableOpacity>
                <Text style={styles.menu}>{myPlacesText}</Text>
              </TouchableOpacity>
              <View style={styles.dottedLineContainer}>
                <Svg height="2" width="75%">
                  <Line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="5,2"
                  />
                </Svg>
              </View>

              <TouchableOpacity onPress={navigateToLanguageScreen}>
                <Text style={styles.menu}>{languageSettingsText}</Text>
              </TouchableOpacity>
              <View style={styles.dottedLineContainer}>
                <Svg height="2" width="75%">
                  <Line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="5,2"
                  />
                </Svg>
              </View>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.menu}>{logoutText}</Text>
              </TouchableOpacity>
              <View style={styles.dottedLineContainer}>
                <Svg height="2" width="75%">
                  <Line
                    x1="0"
                    y1="1"
                    x2="100%"
                    y2="1"
                    stroke="black"
                    strokeWidth="2"
                    strokeDasharray="5,2"
                  />
                </Svg>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.blueLine}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  userTextContainer: {
    marginTop: 40,
    marginLeft: 40,
  },
  userText: {
    fontSize: 30,
  },
  redLine: {
    marginTop: 30,
    height: 25,
    width: '100%',
    backgroundColor: '#CD2E3A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  date: {
    color: 'white',
    fontSize: 18,
    marginRight: 20,
  },
  rectangleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  rectangle: {
    marginTop: 20,
    backgroundColor: 'white',
    height: 450,
    width: 300,
    borderRadius: 20,
  },
  circleContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F2F2',
  },
  menuContainer: {
    flex: 1,
  },
  menu: {
    fontSize: 20,
    marginLeft: 40,
    marginTop: 35,
  },
  dottedLineContainer: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueLine: {
    marginTop: 20,
    height: 25,
    width: '100%',
    backgroundColor: '#0047A0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default MyPageScreen;
