import React, {useEffect, useRef, useState} from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Animated, Dimensions, Platform, Alert } from 'react-native';
import Svg, {Line} from 'react-native-svg';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import {RootStackNavigationProp} from './navigation/navigationTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../components/AuthProvider';


const WEB_CLIENT_ID =
  '299344355959-ne6qtu0r6qi6bqf85hetkumnp51q32nu.apps.googleusercontent.com';
const IOS_CLIENT_ID =
  '299344355959-92rr00u40av2vi80u9pk79kj5ve494h4.apps.googleusercontent.com';
const ANDROID_CLIENT_ID =
  '299344355959-hmvqnrqm4p60scun3mh6p8174hodgn2l.apps.googleusercontent.com';

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

const SplashScreen: React.FC = () => {
  const [selectedSplash, setSelectedSplash] = useState(null);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [email_signIn, setEmail_signIn] = useState('');
  const [password_signIn, setPassword_signIn] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(''); 
  const [isVerified, setIsVerified] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const navigation = useNavigation<RootStackNavigationProp<'SplashScreen'>>();

  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const { isGoogleUser, setIsGoogleUser } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID, // 웹 클라이언트 ID
      iosClientId: IOS_CLIENT_ID, // iOS 클라이언트 ID
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

  const loginWithGoogle = async (): Promise<{ accessToken: string } | null> => {
    try {
      // Play Services가 설치되어 있는지 확인
      await GoogleSignin.hasPlayServices();
  
      // 사용자 로그인
      const userInfo = await GoogleSignin.signIn();
  
      // accessToken을 가져오기
      const tokens = await GoogleSignin.getTokens();
      const accessToken = tokens.accessToken;
  
      if (accessToken) {
        return {
          accessToken,
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
          Alert.alert('로그인 실패. 다시 시도해주세요.');
        }
      } else {
        Alert.alert('알 수 없는 오류가 발생했습니다.');
      }
      return null;
    }
  };
  

  const handleLogin = async () => {
    if (email_signIn && password_signIn) {
      try {
        console.log(email_signIn, password_signIn);
        const response = await fetch(
          'http://13.125.53.226:8080/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email_signIn, password_signIn }),
          }
        );
  
        const result = await response.json();

        if (response.ok) {
        await AsyncStorage.setItem('jwtToken', result.accessToken);
        setIsGoogleUser(false);
          navigation.navigate('Tabs'); // 로그인 성공 시 Tabs 화면으로 이동
        } else {
          Alert.alert('로그인 실패', result.message || '로그인에 실패하였습니다. 다시 시도해 주세요.');
        }
        
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('로그인 실패', '로그인에 실패했습니다. 다시 시도해 주세요.');
      }
    } else {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해 주세요.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (result) {
        const { accessToken } = result;
        console.log(accessToken);
  
        // 서버에 accessToken 전송
        const response = await fetch('http://13.125.53.226:8080/api/auth/google-login', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`, // Google 로그인 후 받은 accessToken 사용
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to log in');
        }
  
        // 응답 데이터를 JSON으로 변환
        const data = await response.json();
        await AsyncStorage.setItem('jwtToken', data.accessToken);
  
        setIsGoogleUser(true);   
        navigation.navigate('Tabs'); // 로그인 성공 시 Tabs 화면으로 이동   
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };
  
  
  
  const handleVerifyEmail = async () => {
    if (!email) {
      Alert.alert('이메일을 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(
        'http://13.125.53.226:8080/api/auth/verify-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email}), // 이메일 데이터를 JSON으로 전송
        },
      );

      const result = await response.json();
      if (response.ok) {
        Alert.alert('인증번호가 전송되었습니다. 이메일을 확인해주세요');
      } else {
        Alert.alert(
          '인증번호 요청 실패',
          result.message || '개발자에게 문의하세요.',
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('서버 연결 오류', '서버에 연결할 수 없습니다.');
    }
  };

  const handleVerifyCode = async () => {
    if (!email || !code) {
      Alert.alert('이메일과 코드를 입력해주세요.');
      return;
    }
    try {
      const response = await fetch(
        'http://13.125.53.226:8080/api/auth/verify-code',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({email, code}), // 이메일과 코드를 JSON으로 전송
        },
      );
      const result = await response.json();
      if (response.ok) {
        setIsVerified(true); // 인증이 완료되면 true로 설정
        Alert.alert('인증이 성공적으로 완료되었습니다.');
      } else {
        Alert.alert('인증 실패', result.message || '개발자에게 문의하세요.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('서버 연결 오류', '서버에 연결할 수 없습니다.');
    }
  };

  const handleSignUp = async () => {
    if (nickname && email && password) {
      try {
        const response = await fetch(
          'http://13.125.53.226:8080/api/auth/signup',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({nickname, email, password}),
          },
        );

        const responseText = await response.text(); // 응답을 텍스트로 확인
        console.log('Response Text:', responseText); // 응답 텍스트 출력

        // JSON 파싱 가능 여부 확인
        try {
          const result = JSON.parse(responseText);
          if (response.ok) {
            Alert.alert('회원가입 성공', '회원가입이 완료되었습니다.');
            setShowSignUp(false);
            setShowLoginBox(true);
          } else {
            Alert.alert('회원가입 실패', result.message);
          }
        } catch (jsonError) {
          console.error('JSON Parse Error:', jsonError);
          Alert.alert('회원가입 실패', '서버 응답이 올바르지 않습니다.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert(
          '회원가입 실패',
          '회원가입에 실패했습니다. 다시 시도해 주세요.',
        );
      }
    } else {
      Alert.alert('입력 오류', '모든 필드를 입력해 주세요.');
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
      ? {width: windowWidth * 0.8, height: windowHeight * 0.7}
      : {width: windowWidth * 0.8, height: windowHeight * 0.65};
  };

  const platformSignUpBoxSize = () => {
    return Platform.OS === 'android'
      ? {width: windowWidth * 0.8, height: windowHeight * 0.75}
      : {width: windowWidth * 0.8, height: windowHeight * 0.8};
  };

  return (
    <View style={styles.container}>
      {selectedSplash && (
        <Image source={selectedSplash} style={styles.splashImage} />
      )}

      {showLoginBox && !showSignUp && (
        <Animated.View
          style={[
            styles.loginBox,
            platformLoginBoxSize(),
            {opacity: fadeAnim},
          ]}>
          <Text style={[styles.title, {fontSize: platformFontSize(25)}]}>
            Your travel friend in Seoul,
          </Text>
          <Text style={[styles.titleBlue, {fontSize: platformFontSize(25)}]}>
            TOURMATE.
          </Text>
          <Text style={[styles.content, {fontSize: platformFontSize(16)}]}>
            Please log in to use
          </Text>
          <Text style={{fontSize: platformFontSize(16)}}>
            our member services.
          </Text>

          <TextInput
            style={[styles.input, {fontSize: platformFontSize(20)}]}
            placeholder="Email"
            value={email_signIn}
            placeholderTextColor="#7A7C7E"
            onChangeText={setEmail_signIn}
          />
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

          <TextInput
            style={[styles.input, {fontSize: platformFontSize(20)}]}
            placeholder="Password"
            value={password_signIn}
            placeholderTextColor="#7A7C7E"
            onChangeText={setPassword_signIn}
            secureTextEntry
          />
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

          <TouchableOpacity
            style={[
              styles.signIn,
              {width: platformButtonSize(210), height: platformButtonSize(50)},
            ]}
            onPress={handleLogin}>
            <Text style={[styles.signInText, {fontSize: platformFontSize(20)}]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGoogleLogin}>
            <Image
              source={require('../assets/images/google-button.png')}
              style={[
                styles.googleLogin,
                {
                  width: platformButtonSize(210),
                  height: platformButtonSize(40),
                },
              ]}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signUp, {marginTop: platformSpacing(18)}]}
            onPress={() => {
              setShowSignUp(true);
              setShowLoginBox(false);
            }}>
            <Text style={[styles.signUpText, {fontSize: platformFontSize(15)}]}>
              Don't you have an account?
            </Text>
          </TouchableOpacity>
          <Svg height="2" width="70%">
            <Line
              x1="0"
              y1="1"
              x2={windowWidth * 0.8}
              y2="1"
              stroke="#0047A0"
              strokeWidth="1.5"
            />
          </Svg>
        </Animated.View>
      )}

      {showSignUp && (
        <View style={[styles.signUpBox, platformSignUpBoxSize()]}>
          <Text style={[styles.title, {fontSize: platformFontSize(25)}]}>
            Is this your first time?
          </Text>
          <Text style={[styles.content, {fontSize: platformFontSize(16)}]}>
            TOURMATE is available
          </Text>
          <Text style={[styles.content, {fontSize: platformFontSize(16)}]}>
           after signing up for membership.
          </Text>

          <View
            style={[styles.signUpContainer, {marginTop: platformSpacing(30)}]}>
            <TextInput
              style={[styles.signUpInput, {fontSize: platformFontSize(17)}]}
              placeholder="Nickname"
              value={nickname}
              placeholderTextColor="#7A7C7E"
              onChangeText={text => setNickname(text)}
            />
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

          <Text style={{marginTop: platformSpacing(10)}}>Please put your email address</Text>
          <Text>and get a code for authentication !</Text>
          <View
            style={[styles.emailContainer, {marginTop: platformSpacing(10)}]}>
            <TextInput
              style={[styles.emailInput, {fontSize: platformFontSize(17)}]}
              placeholder="Email"
              placeholderTextColor="#7A7C7E"
              value={email}
              onChangeText={setEmail} // 입력된 이메일 상태 업데이트
            />
            <TouchableOpacity
              style={[
                styles.authButton,
                {width: platformButtonSize(60), height: platformButtonSize(30)},
              ]}
              onPress={handleVerifyEmail} // 버튼 클릭 시 이메일 전송 함수 호출
            >
              <Text style={[styles.auth, {fontSize: platformFontSize(12)}]}>
                Send
              </Text>
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

          <View
            style={[styles.emailContainer, {marginTop: platformSpacing(27)}]}>
            <TextInput
              style={[styles.emailInput, {fontSize: platformFontSize(17)}]}
              placeholder="Code (6 Characters)"
              placeholderTextColor="#7A7C7E"
              value={code}
              onChangeText={setCode} // 코드 상태 업데이트
            />
            <TouchableOpacity
              style={[
                styles.authenticationButton,
                {width: platformButtonSize(60), height: platformButtonSize(30)},
              ]}
              onPress={handleVerifyCode} // 버튼 클릭 시 코드 검증 함수 호출
            >
              <Text style={[styles.auth, {fontSize: platformFontSize(12)}]}>
                Check
              </Text>
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
          <Text style={styles.verified}>
            {isVerified ? 'Authenticated!' : 'Please complete the verification.'}
          </Text>

          <View
            style={[
              styles.passwordContainer,
              {marginTop: platformSpacing(10)},
            ]}>
            <TextInput
              style={[styles.passwordInput, {fontSize: platformFontSize(17)}]}
              placeholder="Password (At least 6 characters)"
              value={password}
              placeholderTextColor="#7A7C7E"
              secureTextEntry
              onChangeText={text => setPassword(text)}
            />
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

          <TouchableOpacity
            style={[
              styles.signIn,
              {
                width: platformButtonSize(210),
                height: platformButtonSize(50),
                marginTop: platformSpacing(36),
              },
            ]}
            onPress={handleSignUp}>
            <Text style={[styles.signInText, {fontSize: platformFontSize(20)}]}>
              Sign Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signUp, {marginTop: platformSpacing(18)}]}
            onPress={() => {
              setShowSignUp(false);
              setShowLoginBox(true);
            }}>
            <Text style={[styles.signUpText2, {fontSize: platformFontSize(15)}]}>
            Do you already have an account?
            </Text>
          </TouchableOpacity>
          <Svg height="2" width="70%">
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
    fontFamily: 'SBAggroM',
    color: 'black',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 15,
  },
  titleBlue: {
    fontFamily: 'SBAggroM',
    color: '#0047A0',
    fontWeight: '500',
    textAlign: 'center',
  },
  content: {
    fontFamily: 'SBAggroL',
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },
  input: {
    width: '75%',
    height: 50,
    marginTop: 30,
    fontFamily: 'SBAggroL',
  },
  signIn: {
    backgroundColor: '#0047A0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 36,
  },
  signInText: {
    fontFamily: 'SBAggroL',
    color: 'white',
  },
  googleLogin: {
    borderRadius: 50,
    marginTop: 10,
  },
  signUp: {
    marginTop: 18,
    alignItems: 'center',
    fontFamily: 'SBAggroL',
  },
  signUpText: {
    color: '#0047A0',
    fontWeight: '300',
    fontFamily: 'SBAggroM',
    marginTop: 10,
  },
  signUpText2: {
    color: '#0047A0',
    fontWeight: '300',
    fontFamily: 'SBAggroM',
    marginTop: 2,
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
    fontFamily: 'SBAggroL',
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
    fontFamily: 'SBAggroL',
    color: 'black',
  },
  verified: {
    color: '#0047A0',
    marginTop: 10,
  },
  authButton: {
    backgroundColor: '#0047A0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginLeft: 10,
  },
  auth: {
    fontFamily: 'SBAggroL',
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
    fontFamily: 'SBAggroL',
    fontWeight: '300',
    color: '#0047A0',
  },
});

export default SplashScreen;
