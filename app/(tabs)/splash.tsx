import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, TextInput, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Stack, useRouter } from 'expo-router';
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
  const [showLoginBox, setShowLoginBox] = useState(false); // 로그인 박스 표시 여부 상태
  const [showSignUp, setShowSignUp] = useState(false); // 로그인/회원가입 전환 상태
  const navigation = useNavigation<SplashScreenNavigationProp>();

  // 애니메이션을 위한 변수
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 랜덤으로 스플래시 화면 선택
    const randomIndex = Math.floor(Math.random() * splashScreens.length);
    setSelectedSplash(splashScreens[randomIndex]);

    // 3초 후에 로그인 박스를 표시
    const timer = setTimeout(() => {
      setShowLoginBox(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // 애니메이션의 지속 시간
        useNativeDriver: true,
      }).start();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const LoginFunction = () => {
    navigation.navigate('(tabs)/home'); // 'Home'은 이동하려는 화면의 이름입니다.
  };

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
      {selectedSplash && ( // selectedSplash가 null이 아닐 때만 Image 컴포넌트를 렌더링
        <Image source={selectedSplash} style={styles.splashImage} />
      )}
      
      {showLoginBox && (
        <Animated.View style={[styles.loginBox, { opacity: fadeAnim }]}>
          <Text style={styles.title}>
              {showSignUp ? '처음이신가요?' : '당신의 서울여행 동반자,'}
            </Text>
          <Text style={styles.titleBlue}>
            {showSignUp ? '' : 'TOURMATE'}
            <Text style={styles.title}>
              {showSignUp ? '' : '입니다.'}
            </Text>
          </Text>
          <Text style={styles.content}>
            {showSignUp ? 'TOURMATE는 회원 가입 후에' : '회원 서비스 이용을 위해 로그인 해주세요.'}
          </Text>
          <Text style={styles.content}>
            {showSignUp ? '이용해보실 수 있습니다.' : ''}
          </Text>

          {showSignUp ? (
            <>
            <View style={styles.signUpContainer}>
              <TextInput style={styles.signUpInput} placeholder="이름" />

              <Svg height="2" width="100%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />
              </Svg>
              </View>


              <View style={styles.emailContainer}>
              <TextInput style={styles.emailInput} placeholder="이메일"/>
              <TouchableOpacity style={styles.authButton}><Text style={styles.auth}>인증번호 받기</Text></TouchableOpacity>
              </View>
              <Svg height="2" width="80%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />

              </Svg>
              <View style={styles.emailContainer}>
              <TextInput style={styles.emailInput} placeholder="이메일 인증번호"></TextInput>
              <TouchableOpacity style={styles.authenticationButton}><Text style={styles.auth}>확인</Text></TouchableOpacity>
              </View>
              <Svg height="2" width="80%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />
              </Svg>

              <View style={styles.signUpContainer}>
              <TextInput style={styles.signUpInput} placeholder="비밀번호(8자리 이상)" secureTextEntry />
              
              <Svg height="2" width= '100%'>
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />
              </Svg>
              </View>

              <View style={styles.signUpContainer}>
              <TextInput style={styles.signUpInput} placeholder="비밀번호 확인" secureTextEntry />
              <Svg height="2" width="100%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />
              </Svg>
              </View>
              
              <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signInText}>회원가입</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.signUp}
                onPress={() => setShowSignUp(false)} // 로그인 폼으로 전환
              >
                <Text style={styles.signUpText}>로그인하러 가기</Text>
              </TouchableOpacity>
              <Svg height="2" width="40%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />
              </Svg>
              
            </>
          ) : (
            <>
              <TextInput style={styles.input} placeholder="Email" />
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
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
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />
              </Svg>
              <TouchableOpacity 
                style={styles.signIn}
                onPress={LoginFunction}  // 버튼 클릭 시 홈 화면으로 이동
              >
                <Text style={styles.signInText}>로그인</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.signUp}
                onPress={() => setShowSignUp(true)} // 회원가입 폼으로 전환
              >
                <Text style={styles.signUpText}>회원이 아니신가요?</Text>
              </TouchableOpacity>
              <Svg height="2" width="50%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="#0047A0"
                  strokeWidth="1.5"
                />
              </Svg>
              
            </>
          )}
        </Animated.View>
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
    height: '70%',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 약간의 투명도를 준 배경
    borderRadius: 10,
    alignItems: 'center',
    bottom:50,
  },
  title: {
    fontFamily: 'AggroM',
    fontSize: 25,
    color: 'black',
    marginTop:20,
  },
  titleBlue: {
    fontFamily: 'AggroM',
    fontSize: 25,
    color: '#0047A0',
    marginBottom:10,
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
  signUp: {
    marginTop: 20,
  },
  signUpText: {
    fontFamily: 'AggroM',
    fontSize: 15,
    color: 'black',
  },
  signUpContainer:{
    flex: 1,
    width: '80%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  emailContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', 
  },
  signUpInput: {
    width: 230,
    height: 30,
    fontFamily: 'AggroL',
    fontSize: 17,
    marginTop: 10,

  },
  emailInput:{
    width: 150,
    height: 30,
    fontFamily: 'AggroL',
    fontSize: 17,
    marginTop: 10,
    left: 30,
  },
  signUpButton:{
    width: 210,
    height: 50,
    marginTop: 10,
    backgroundColor: '#0047A0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authButton:{
    position: 'absolute',
    right: 25, // 버튼을 컨테이너의 오른쪽 끝에 배치
    width: 85, // 버튼의 고정 너비 설정
    height: 30,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authenticationButton:{
    position: 'absolute',
    right: 25, // 버튼을 컨테이너의 오른쪽 끝에 배치
    width: 60, // 버튼의 고정 너비 설정
    height: 30,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  auth:{
    fontFamily:'AggroL',
    fontSize: 12,
  },
});

export default SplashScreen;
