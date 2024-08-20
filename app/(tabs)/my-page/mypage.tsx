import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Svg, { Line } from 'react-native-svg';
import { useLanguage } from '@/components/LanguageProvider';
import { translateText } from '@/utils/translation';
import { RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '@/components/BottomTabNavigator';

type MyPageScreenRouteProp = RouteProp<RootTabParamList, 'MyPage'>;

type Props = {
  route: MyPageScreenRouteProp;
};

const MyPageScreen = ({ route }: Props) => {
  const router = useRouter();
  
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage(); // 언어 설정 훅에서 가져오기
  console.log('마이페이지 현재언어:', globalLanguage);

  const [currentDate, setCurrentDate] = useState<string>('');

  // 언어가 변경될 때마다 글로벌 언어 설정 업데이트
  useEffect(() => {
    if (route.params?.language) {
      setGlobalLanguage(route.params.language);
    }
  }, [route.params?.language]);

  useEffect(() => {
    console.log('Current language:', globalLanguage); // 현재 언어 확인
    const translateMenuTexts = async () => {
      console.log('Translating texts...');
      try {
        const changeHi = await translateText('안녕하세요,', globalLanguage);
        const changePassword = await translateText('비밀번호 변경', globalLanguage);
        const myReviews = await translateText('내 리뷰', globalLanguage);
        const languageSettings = await translateText('언어 설정', globalLanguage);
        const logout = await translateText('로그아웃', globalLanguage);
        
        setChangeHi(changeHi);
        setChangePasswordText(changePassword);
        setMyReviewsText(myReviews);
        setLanguageSettingsText(languageSettings);
        setLogoutText(logout);
      } catch (error) {
      }
    };
  
    translateMenuTexts();
  }, [globalLanguage]); // 글로벌 언어가 변경될 때마다 번역 실행

  // 번역된 텍스트 상태
  const [changeHi,setChangeHi] = useState<string>('안녕하세요,');
  const [changePasswordText, setChangePasswordText] = useState<string>('비밀번호 변경');
  const [myReviewsText, setMyReviewsText] = useState<string>('내 리뷰');
  const [languageSettingsText, setLanguageSettingsText] = useState<string>('언어 설정');
  const [logoutText, setLogoutText] = useState<string>('로그아웃');

  useEffect(() => {    
    const date = new Date();
    const formattedDate = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    setCurrentDate(formattedDate);
  }, [currentDate]);

  const LogoutFunction = () => {
    router.replace('(tabs)/splash');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
                <TouchableOpacity onPress={() => router.push('(tabs)/my-page/password-change')}>
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
                      strokeDasharray="5,2" // 점선 스타일
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
                      strokeDasharray="5,2" // 점선 스타일
                    />
                  </Svg>
                </View>
                <TouchableOpacity onPress={() => router.push('(tabs)/my-page/language')}>
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
                      strokeDasharray="5,2" // 점선 스타일
                    />
                  </Svg>
                </View>
                <TouchableOpacity onPress={LogoutFunction}>
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
                      strokeDasharray="5,2" // 점선 스타일
                    />
                  </Svg>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.blueLine}></View>
        </View>
      </ScrollView>
    </>
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
    fontFamily: 'AggroL',
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
    fontFamily: 'AggroL',
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
    backgroundColor: '#F2F2F2'
  },
  menuContainer: {
    flex: 1,
  },
  menu: {
    fontSize: 20,
    fontFamily: 'AggroL',
    marginLeft: 40,
    marginTop: 50,
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
