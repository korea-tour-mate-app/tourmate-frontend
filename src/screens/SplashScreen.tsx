import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Animated, Dimensions, Platform, Alert } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// 클라이언트 ID는 자신의 프로젝트에 맞게 설정하세요.
const WEB_CLIENT_ID = '299344355959-ne6qtu0r6qi6bqf85hetkumnp51q32nu.apps.googleusercontent.com';
const IOS_CLIENT_ID = '299344355959-92rr00u40av2vi80u9pk79kj5ve494h4.apps.googleusercontent.com';

const splashScreens = [
  require('../assets/images/splash/splash1.png'),
  require('../assets/images/splash/splash2.png'),
  require('../assets/images/splash/splash3.png'),
  require('../assets/images/splash/splash4.png'),
  require('../assets/images/splash/splash5.png'),
];

interface SplashScreenProps {
  navigateToHome: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigateToHome }) => {
  const [selectedSplash, setSelectedSplash] = useState(null);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,  // 웹 클라이언트 ID
      iosClientId: IOS_CLIENT_ID,  // iOS 클라이언트 ID
      offlineAccess: true,
      hostedDomain: '',
    });

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

const loginWithGoogle = async (): Promise<{ idToken: string } | null> => {
  try {
    // Play Services가 설치되어 있는지 확인
    await GoogleSignin.hasPlayServices();
    
    // 사용자 로그인
    const userInfo = await GoogleSignin.signIn();

    // ID 토큰을 가져오기
    const tokens = await GoogleSignin.getTokens();
    const idToken = tokens.idToken;

    if (idToken) {
      return {
        idToken,
      };
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('로그인이 취소되었습니다.');
      } else if (error.message === statusCodes.IN_PROGRESS) {
        Alert.alert('로그인이 진행 중입니다.');
      } else if (error.message === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Google Play 서비스가 필요합니다.');
      } else {
        Alert.alert('로그인 실패: ', error.message);
      }
    } else {
      Alert.alert('알 수 없는 오류가 발생했습니다.');
    }
    return null;
  }
};

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (result) {
      console.log(result.idToken);  // ID 토큰을 콘솔에 출력합니다.
      navigateToHome(); // 로그인 성공 시 홈으로 이동
    }
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
      ? { width: windowWidth * 0.8, height: windowHeight * 0.7 }
      : { width: windowWidth * 0.8, height: windowHeight * 0.6 };
  };

  const platformSignUpBoxSize = () => {
    return Platform.OS === 'android'
      ? { width: windowWidth * 0.8, height: windowHeight * 0.75 }
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

          <TouchableOpacity style={[styles.signIn, { width: platformButtonSize(210), height: platformButtonSize(50) }]} onPress={navigateToHome}>
            <Text style={[styles.signInText, { fontSize: platformFontSize(20) }]}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoogleLogin}>
            <Image source={require('../assets/images/google-button.png')} style={[styles.googleLogin, { width: platformButtonSize(210), height: platformButtonSize(40) }]}></Image>
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
            <TextInput style={[styles.passwordInput, { fontSize: platformFontSize(17) }]} placeholder="비밀번호" secureTextEntry />
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

          <TouchableOpacity style={[styles.signIn, { width: platformButtonSize(210), height: platformButtonSize(50), marginTop: platformSpacing(36) }]}>
            <Text style={[styles.signInText, { fontSize: platformFontSize(20) }]}>가입하기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.signUp, { marginTop: platformSpacing(18) }]} onPress={() => {
            setShowSignUp(false);
            setShowLoginBox(true);
          }}>
            <Text style={[styles.signUpText, { fontSize: platformFontSize(15) }]}>이미 회원이신가요?</Text>
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
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
  },
  loginBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    position: 'absolute',
    top: '15%',
    alignSelf: 'center',
    paddingTop: 30,
  },
  signUpBox: {
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    position: 'absolute',
    top: '12%',
    alignSelf: 'center',
    paddingTop: 30,
  },
  title: {
    fontFamily: 'SB Aggro M',
    color: '#707070',
    fontWeight: '300',
    textAlign: 'center',
  },
  titleBlue: {
    fontFamily: 'SB Aggro M',
    color: '#0047A0',
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    fontFamily: 'SB Aggro L',
    color: '#707070',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    width: '75%',
    height: 50,
    marginTop: 30,
    fontFamily: 'SB Aggro L',
    fontWeight: '300',
    color: '#0047A0',
  },
  signIn: {
    backgroundColor: '#0047A0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 36,
  },
  signInText: {
    fontFamily: 'SB Aggro L',
    color: 'white',
  },
  googleLogin:{
    borderRadius: 50,
    marginTop: 10,
  },
  signUp: {
    marginTop: 18,
    alignItems: 'center',
    fontFamily: 'SB Aggro L',
  },
  signUpText: {
    color: '#0047A0',
    fontWeight: '300',
    fontFamily: 'SB Aggro M',
  },
  signUpContainer: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpInput: {
    width: '100%',
    height: 50,
    fontFamily: 'SB Aggro L',
    fontWeight: '300',
  },
  emailContainer: {
    width: '80%',
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailInput: {
    width: '60%',
    height: 50,
    fontFamily: 'SB Aggro L',
    fontWeight: '300',
    color: '#0047A0',
  },
  authButton: {
    backgroundColor: '#0047A0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginLeft: 10,
  },
  auth: {
    fontFamily: 'AggroL',
    color: 'white',
    fontWeight: '300',
  },
  authenticationButton: {
    backgroundColor: '#0047A0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginLeft: 10,
  },
  passwordContainer: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInput: {
    width: '100%',
    height: 50,
    fontFamily: 'SB Aggro L',
    fontWeight: '300',
    color: '#0047A0',
  },
});

export default SplashScreen;