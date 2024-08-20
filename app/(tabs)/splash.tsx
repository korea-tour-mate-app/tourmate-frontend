import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/(tabs)/navigation/navigationTypes';
import { ImageSourcePropType } from 'react-native';
import Svg, { Line } from 'react-native-svg';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'splash'>;

const splashScreens: ImageSourcePropType[] = [
  require('@/assets/images/splash1.png'),
  require('@/assets/images/splash2.png'),
  require('@/assets/images/splash3.png'),
  require('@/assets/images/splash4.png'),
  require('@/assets/images/splash5.png'),
];

const SplashScreen: React.FC = () => {
  const [selectedSplash, setSelectedSplash] = useState<ImageSourcePropType | null>(null);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigation = useNavigation<SplashScreenNavigationProp>();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * splashScreens.length);
    setSelectedSplash(splashScreens[randomIndex]);

    const timer = setTimeout(() => {
      setShowLoginBox(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const LoginFunction = () => {
    navigation.navigate('(tabs)/home'); // 올바른 경로로 변경 필요
  };

  const windowWidth = Dimensions.get('window').width;

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      {selectedSplash && (
        <Image source={selectedSplash} style={styles.splashImage} />
      )}

      {showLoginBox && !showSignUp && (
        <Animated.View style={[
          styles.loginBox,
          { opacity: fadeAnim }
        ]}>
          {/* 로그인 박스 콘텐츠 */}
          <Text style={styles.title}>당신의 서울여행 동반자,</Text>
          <Text style={styles.titleBlue}>TOURMATE<Text style={styles.title}>입니다.</Text></Text>
          <Text style={styles.content}>회원 서비스 이용을 위해 로그인 해주세요.</Text>

          <TextInput style={styles.input} placeholder="Email" />
          <Svg height="2" width="75%">
            <Line
              x1="0"
              y1="1"
              x2={windowWidth * 0.75}
              y2="1"
              stroke="#0047A0"
              strokeWidth="1.5"
            />
          </Svg>

          <TextInput style={styles.input} placeholder="Password" secureTextEntry />
          <Svg height="2" width="75%">
            <Line
              x1="0"
              y1="1"
              x2={windowWidth * 0.75}
              y2="1"
              stroke="#0047A0"
              strokeWidth="1.5"
            />
          </Svg>

          <TouchableOpacity style={styles.signIn} onPress={LoginFunction}>
            <Text style={styles.signInText}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUp} onPress={() => {
            setShowSignUp(true);
            setShowLoginBox(false); // 로그인 화면을 숨김
          }}>
            <Text style={styles.signUpText}>회원이 아니신가요?</Text>
          </TouchableOpacity>
          <Svg height="2" width="50%">
            <Line
              x1="0"
              y1="1"
              x2={windowWidth * 0.5}
              y2="1"
              stroke="#0047A0"
              strokeWidth="1.5"
            />
          </Svg>
        </Animated.View>
      )}

      {showSignUp && (
        <View style={[styles.signUpBox]}>
          {/* 회원가입 박스 콘텐츠 */}
          <Text style={styles.title}>처음이신가요?</Text>
          <Text style={styles.content}>TOURMATE는 회원 가입 후에</Text>
          <Text style={styles.content}>이용해보실 수 있습니다.</Text>

          <View style={styles.signUpContainer}>
            <TextInput style={styles.signUpInput} placeholder="이름" />
            <Svg height="2" width="100%">
              <Line
                x1="0"
                y1="1"
                x2={windowWidth * 0.8}
                y2="1"
                stroke="#0047A0"
                strokeWidth="1.5"
              />
            </Svg>
          </View>

          <View style={styles.emailContainer}>
            <TextInput style={styles.emailInput} placeholder="이메일" />
            <TouchableOpacity style={styles.authButton}>
              <Text style={styles.auth}>인증번호 받기</Text>
            </TouchableOpacity>
          </View>

          <Svg height="2" width="80%">
            <Line
              x1="0"
              y1="1"
              x2={windowWidth * 0.8}
              y2="1"
              stroke="#0047A0"
              strokeWidth="1.5"
            />
          </Svg>

          <View style={styles.emailContainer}>
            <TextInput style={styles.emailInput} placeholder="이메일 인증번호" />
            <TouchableOpacity style={styles.authenticationButton}>
              <Text style={styles.auth}>확인</Text>
            </TouchableOpacity>
          </View>

          <Svg height="2" width="80%">
            <Line
              x1="0"
              y1="1"
              x2={windowWidth * 0.8}
              y2="1"
              stroke="#0047A0"
              strokeWidth="1.5"
            />
          </Svg>

          <View style={styles.passwordContainer}>
            <TextInput style={styles.passwordInput} placeholder="비밀번호(8자리 이상)" secureTextEntry />
            <Svg height="2" width="100%">
              <Line
                x1="0"
                y1="1"
                x2={windowWidth * 0.8}
                y2="1"
                stroke="#0047A0"
                strokeWidth="1.5"
              />
            </Svg>
            
            <TextInput style={styles.passwordInput} placeholder="비밀번호 확인" secureTextEntry />
            <Svg height="2" width="100%">
              <Line
                x1="0"
                y1="1"
                x2={windowWidth * 0.8}
                y2="1"
                stroke="#0047A0"
                strokeWidth="1.5"
              />
            </Svg>
          </View>

          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.signInText}>회원가입</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUp} onPress={() => {
            setShowSignUp(false);
            setShowLoginBox(true); // 로그인 화면을 다시 표시
          }}>
            <Text style={styles.signUpText}>로그인하러 가기</Text>
          </TouchableOpacity>

          <Svg height="2" width="40%">
            <Line
              x1="0"
              y1="1"
              x2={windowWidth * 0.4}
              y2="1"
              stroke="#0047A0"
              strokeWidth="1.5"
            />
          </Svg>
        </View>
      )}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loginBox: {
    position: 'absolute',
    width: '80%',
    height: '50%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 약간의 투명도를 준 배경
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'AggroM',
    fontSize: 25,
    color: 'black',
    marginTop: 20,
    marginBottom: 10,
  },
  titleBlue: {
    fontFamily: 'AggroM',
    fontSize: 25,
    color: '#0047A0',
    marginBottom: 10,
  },
  content: {
    fontFamily: 'AggroL',
    fontSize: 16,
  },
  input: {
    width: 220,
    height: 50,
    fontFamily: 'AggroL',
    fontSize: 20,
    marginTop: 20,
  },
  signIn: {
    width: 210,
    height: 50,
    backgroundColor: '#0047A0',
    borderRadius: 50,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontFamily: 'AggroL',
    fontSize: 20,
    color: 'white',
  },
  signUpBox: {
    position: 'absolute',
    width: '80%',
    height: '70%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 약간의 투명도를 준 배경
    borderRadius: 10,
    alignItems: 'center',
    bottom: 50,
  },
  signUp: {
    marginTop: 20,
  },
  signUpText: {
    fontFamily: 'AggroM',
    fontSize: 15,
    color: 'black',
  },
  signUpContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 50,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },
  passwordContainer: {
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 30,
  },
  signUpInput: {
    width: '100%',
    height: 30,
    fontFamily: 'AggroL',
    fontSize: 17,
  },
  emailInput: {
    width: 150,
    height: 30,
    fontFamily: 'AggroL',
    fontSize: 17,
    marginTop: 10,
    left: 30,
  },
  passwordInput: {
    width: '100%',
    height: 30,
    fontFamily: 'AggroL',
    fontSize: 17,
    marginTop: 10,
  },
  signUpButton: {
    width: 210,
    height: 50,
    marginTop: 50,
    backgroundColor: '#0047A0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButton: {
    position: 'absolute',
    right: 25, // 버튼을 컨테이너의 오른쪽 끝에 배치
    width: 85, // 버튼의 고정 너비 설정
    height: 30,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authenticationButton: {
    position: 'absolute',
    right: 25, // 버튼을 컨테이너의 오른쪽 끝에 배치
    width: 60, // 버튼의 고정 너비 설정
    height: 30,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  auth: {
    fontFamily: 'AggroL',
    fontSize: 12,
  },
});

export default SplashScreen;
