import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TextInput, Button, useColorScheme, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Font from 'expo-font';
import { HelloWave } from '@/components/HelloWave';

const SignUpScreen = () => {
  const router = useRouter();

  return (
    <>
    <Stack.Screen options={{ headerShown: false }} />
    <View style={styles.container}>
    <TouchableOpacity  style={styles.backButton} onPress={() => { router.push('/') }}>
      <Image
      source={require('@/assets/images/back-button.png')}
        />
      </TouchableOpacity>
      <Text style={styles.title}>처음이신가요?<HelloWave/></Text>
      <Text style={styles.content}>TOURMATE는 회원가입 후에 이용해보실 수 있습니다.</Text>

      <Text style={styles.inputTitle}>Name</Text>
      <TextInput style={styles.input} placeholder="Username" />

      <Text style={styles.inputTitle}>Email</Text>
      <TextInput style={styles.input} placeholder="Example@email.com" />

      <Text style={styles.inputTitle}>Password</Text>
      <TextInput style={styles.input} placeholder="At least 8 characters" secureTextEntry />
      <Text style={styles.inputTitle}>Password Verification</Text>
      <TextInput style={styles.input} placeholder="At least 8 characters" secureTextEntry />

      <TouchableOpacity style={styles.signUpButton} onPress={() => { /* handle sign up */ }}>
      <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  backButton:{
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: 'AggroM',
  },
  content:{
    fontSize:16,
    marginBottom:50,
    fontFamily: 'AggroL',
  },
  inputTitle: {
    fontSize: 16,
    fontFamily: 'AggroL',
  },
  input: {
    height: 40,
    fontFamily: 'AggroL',
    borderColor: '#D4D7E3',
    backgroundColor: '#F3F7FB',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    borderRadius: 12,  
  },
  signUpButton: {
    backgroundColor: 'black',
    paddingVertical: 12,         
    paddingHorizontal: 24,       
    borderRadius: 8,             
    alignItems: 'center',
    marginTop: 50,
  },
  signUpButtonText:{
    fontSize: 18,
    color:'white',
    fontFamily: 'AggroL',
  },
});

export default SignUpScreen;
