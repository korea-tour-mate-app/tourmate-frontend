import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Animated, Dimensions, Platform } from 'react-native';
import Svg, { Line } from 'react-native-svg';

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

const SplashScreen : React.FC<SplashScreenProps> = ({ navigateToHome }) => {
  const [selectedSplash, setSelectedSplash] = useState(null);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

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

          <TouchableOpacity style={[styles.signIn, { width: platformButtonSize(210), height: platformButtonSize(50) }]} onPress={navigateToHome}>
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
    color: '#707070',
    fontWeight: '300',
    textAlign: 'center',
  },
  titleBlue: {
    color: '#0047A0',
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    color: '#707070',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    width: '75%',
    height: 50,
    marginTop: 30,
    textAlign: 'center',
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
    color: 'white',
  },
  signUp: {
    marginTop: 18,
    alignItems: 'center',
  },
  signUpText: {
    color: '#0047A0',
    fontWeight: '300',
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
    textAlign: 'center',
    fontWeight: '300',
    color: '#0047A0',
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
    textAlign: 'center',
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
    textAlign: 'center',
    fontWeight: '300',
    color: '#0047A0',
  },
});

export default SplashScreen;
