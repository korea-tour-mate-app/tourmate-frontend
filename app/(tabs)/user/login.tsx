import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Font from 'expo-font';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { HelloWave } from '@/components/HelloWave';

const LoginScreen = () => {
  const router = useRouter();

  const headerBackgroundColor = {
    light: 'transparent',
    dark: 'transparent',
  };
  const [fontsLoaded, setFontsLoaded] = useState(false);

  

  return (

    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ParallaxScrollView
        headerBackgroundColor={headerBackgroundColor} // 색상값을 직접 전달합니다.
        headerImage={
          <Image
            source={require('@/assets/images/login-header.png')}
            style={styles.Logo}
          />
        }>
        <View style={styles.container}>
          <Text style={styles.title}>
            안녕하세요! <HelloWave></HelloWave>
          </Text>
          <Text style={styles.content}>
            한국에 방문하는 모든 이들을 위한 여행 경로 추천 서비스, TOURMATE입니다.
          </Text>
          <Text style={styles.inputTitle}>
            Email
          </Text>
          <TextInput style={styles.input} placeholder="   Example@email.com" />
          <Text style={styles.inputTitle}>
            Password
          </Text>
          <TextInput style={styles.input} placeholder="   At least 8 characters" secureTextEntry />

          <TouchableOpacity style={styles.signInButton} onPress={() => { router.push('/home')/* handle login */ }}>
            <Text style={styles.signInButtonText}>
              Sign In
            </Text>
          </TouchableOpacity>

          <View style={styles.lineContainer}>
            <View style={styles.line} />
            <Text style={styles.lineText}>
              Or sign in with
            </Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialLogin}>
            <TouchableOpacity style={styles.googleButton} onPress={() => { /* handle social login */ }}>
              <Image
              source={require('@/assets/images/google-button.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.lineContainer}>
            <Text>Don't you have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/sign-up')}>
              <Text style={styles.signUp}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ParallaxScrollView>
      </>
  );
}

const styles = StyleSheet.create({
  Logo: {
    height: '80%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginLeft: 0,
    fontFamily: 'AggroM',
  },
  content: {
    fontSize: 18,
    marginBottom: 50,
    fontFamily: 'AggroL',
  },
  inputTitle: {
    fontSize: 16,
    fontFamily: 'AggroL',
  },
  input: {
    height: 45,
    fontSize: 16,
    fontFamily: 'AggroL',
    borderColor: '#D4D7E3',
    backgroundColor: '#F3F7FB',
    borderWidth: 1, 
    borderRadius: 8, 
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: 'black',
    paddingVertical: 12,         
    paddingHorizontal: 24,       
    borderRadius: 8,             
    alignItems: 'center',
    marginBottom: 30,
  },
  signInButtonText:{
    fontSize: 18,
    color:'white',
    fontFamily: 'AggroL',
  },
  lineContainer:{
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  line:{
    height:1,
    backgroundColor: '#CFDFE2',
    flex:1,
  },
  lineText:{
    marginHorizontal: 10,
    fontSize: 12,
    fontFamily: 'AggroL',
  },
  socialLogin:{
    alignItems: 'center',
    justifyContent: 'center', 
  },
  googleButton:{
    width: '90%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signUp:{
    fontFamily: 'AggroL',
    fontSize: 12,
    color: '#1E4AE9',
    marginLeft: 10,
  },
});

export default LoginScreen;