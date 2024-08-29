import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; 
import { RootStackParamList } from './navigation/navigationTypes';
import { ImageSourcePropType } from 'react-native';
import Svg, { Line } from 'react-native-svg';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SplashScreen'>;

const splashScreens = [
  require('../assets/images/splash/splash1.png'),
  require('../assets/images/splash/splash2.png'),
  require('../assets/images/splash/splash3.png'),
  require('../assets/images/splash/splash4.png'),
  require('../assets/images/splash/splash5.png'),
];

const SplashScreen: React.FC = () => {
  const [selectedSplash, setSelectedSplash] = useState<ImageSourcePropType | null>(null);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const navigation = useNavigation<SplashScreenNavigationProp>();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

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
    navigation.navigate('HomeScreen'); // 로그인 후 이동할 화면으로 변경 필요
  };

  const platformFontSize = (size: number) => {
    return Platform.OS === 'android' ? size - 2 : size;
  };

  const platformButtonSize = (size: number) => {
    return Platform.OS === 'android' ? size * 0.9 : size;
  };

  const platformSpacing = (size: number) => {
    return Platform.OS === 'android' ? size * 0.7 : size;
  };

  const platformLoginBoxSize = () => {
    return Platform.OS === 'android' 
      ? { width: windowWidth * 0.8, height: windowHeight * 0.6 } 
      : { width: windowWidth * 0.8, height: windowHeight * 0.5 };
  };

  const platformSignUpBoxSize = () => {
    return Platform.OS === 'android' 
      ? { width: windowWidth * 0.8 , height: windowHeight * 0.75 } 
      : { width: windowWidth * 0.8, height: windowHeight * 0.7 };
  };

  return (
    <View style={styles.container}>
      {selectedSplash && (
        <Image source={selectedSplash} style={styles.splashImage} />
      )}

      {showLoginBox && !showSignUp && (
        <Animated.View style={[
          styles.loginBox,
          platformLoginBoxSize(),
          { opacity: fadeAnim }
        ]}>
          <Text style={[styles.title, { fontSize: platformFontSize(25) }]}>당신의 서울여행 동반자,</Text>
          <Text style={[styles.titleBlue, { fontSize: platformFontSize(25) }]}>
            TOURMATE<Text style={styles.title}>입니다.</Text>
          </Text>
          <Text style={[styles.content, { fontSize: platformFontSize(16) }]}>회원 서비스 이용을 위해 로그인 해주세요.</Text>

          <TextInput style={[styles.input, { fontSize: platformFontSize(20) }]} placeholder="Email" />
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

          <TextInput style={[styles.input, { fontSize: platformFontSize(20) }]} placeholder="Password" secureTextEntry />
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

          <TouchableOpacity style={[styles.signIn, { width: platformButtonSize(210), height: platformButtonSize(50) }]} onPress={LoginFunction}>
            <Text style={[styles.signInText, { fontSize: platformFontSize(20) }]}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signUp, { marginTop: platformSpacing(18) }]} onPress={() => {
            setShowSignUp(true);
            setShowLoginBox(false);
          }}>
            <Text style={[styles.signUpText, { fontSize: platformFontSize(15) }]}>회원이 아니신가요?</Text>
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
        <View style={[styles.signUpBox, platformSignUpBoxSize()]}>
          <Text style={[styles.title, { fontSize: platformFontSize(25) }]}>처음이신가요?</Text>
          <Text style={[styles.content, { fontSize: platformFontSize(16) }]}>TOURMATE는 회원 가입 후에</Text>
          <Text style={[styles.content, { fontSize: platformFontSize(16) }]}>이용해보실 수 있습니다.</Text>

          <View style={[styles.signUpContainer, { marginTop: platformSpacing(45) }]}>
            <TextInput style={[styles.signUpInput, { fontSize: platformFontSize(17) }]} placeholder="이름" />
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

          <View style={[styles.emailContainer, { marginTop: platformSpacing(27) }]}>
            <TextInput style={[styles.emailInput, { fontSize: platformFontSize(17) }]} placeholder="이메일" />
            <TouchableOpacity style={[styles.authButton, { width: platformButtonSize(85), height: platformButtonSize(30) }]}>
              <Text style={[styles.auth, { fontSize: platformFontSize(12) }]}>인증번호 받기</Text>
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

          <View style={[styles.emailContainer, { marginTop: platformSpacing(27) }]}>
            <TextInput style={[styles.emailInput, { fontSize: platformFontSize(17) }]} placeholder="이메일 인증번호" />
            <TouchableOpacity style={[styles.authenticationButton, { width: platformButtonSize(60), height: platformButtonSize(30) }]}>
              <Text style={[styles.auth, { fontSize: platformFontSize(12) }]}>확인</Text>
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

          <View style={[styles.passwordContainer, { marginTop: platformSpacing(27) }]}>
            <TextInput style={[styles.passwordInput, { fontSize: platformFontSize(17) }]} placeholder="비밀번호(8자리 이상)" secureTextEntry />
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

            <TextInput style={[styles.passwordInput, { fontSize: platformFontSize(17) }]} placeholder="비밀번호 확인" secureTextEntry />
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

          <TouchableOpacity style={[styles.signUpButton, { width: platformButtonSize(210), height: platformButtonSize(50) }]}>
            <Text style={[styles.signInText, { fontSize: platformFontSize(20) }]}>회원가입</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signUp, { marginTop: platformSpacing(18) }]} onPress={() => {
            setShowSignUp(false);
            setShowLoginBox(true);
          }}>
            <Text style={[styles.signUpText, { fontSize: platformFontSize(15) }]}>로그인하러 가기</Text>
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
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 약간의 투명도를 준 배경
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'AggroM',
    color: 'black',
    marginTop: 20,
    marginBottom: 10,
  },
  titleBlue: {
    fontFamily: 'AggroM',
    color: '#0047A0',
    marginBottom: 10,
  },
  content: {
    fontFamily: 'AggroL',
  },
  input: {
    width: 220,
    height: 50,
    fontFamily: 'AggroL',
    marginTop: 20,
  },
  signIn: {
    backgroundColor: '#0047A0',
    borderRadius: 50,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontFamily: 'AggroL',
    color: 'white',
  },
  googleSignIn: {},
  signUpBox: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 약간의 투명도를 준 배경
    borderRadius: 10,
    alignItems: 'center',
  },
  signUp: {
    marginTop: 20,
  },
  signUpText: {
    fontFamily: 'AggroM',
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
  },
  emailInput: {
    width: 150,
    height: 30,
    fontFamily: 'AggroL',
    marginTop: 10,
    left: 30,
  },
  passwordInput: {
    width: '100%',
    height: 30,
    fontFamily: 'AggroL',
    marginTop: 10,
  },
  signUpButton: {
    marginTop: 40,
    backgroundColor: '#0047A0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButton: {
    position: 'absolute',
    right: 25,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authenticationButton: {
    position: 'absolute',
    right: 25,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  auth: {
    fontFamily: 'AggroL',
  },
});

export default SplashScreen;
