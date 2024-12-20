import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';
import { RootTabParamList } from '../../components/BottomTabNavigator';

const PasswordChangeScreen= () => {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  console.log('현재언어:', globalLanguage);

  useEffect(() => {
    const translateMenuTexts = async () => {
      try {
        const currentPassword = await translateText('현재 비밀번호', globalLanguage);
        const changePassword = await translateText('비밀번호 변경', globalLanguage);
        const confirm = await translateText('확인', globalLanguage);
  
        setCurrentPassword(currentPassword);
        setChangePassword(changePassword);
        setConfirm(confirm);
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };
  
    translateMenuTexts();
  }, [globalLanguage]);
  

  const [currentPassword, setCurrentPassword] = useState<string>('현재 비밀번호');
  const [changePassword, setChangePassword] = useState<string>('비밀번호 변경');
  const [confirm, setConfirm] = useState<string>('확인');

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back-button.png')} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.inputTitle}>{currentPassword}</Text>
        <TextInput style={styles.input} placeholder="   At least 8 characters" secureTextEntry/>

        <Text style={styles.inputTitle}>{changePassword}</Text>
        <TextInput style={styles.input} placeholder="   At least 8 characters" secureTextEntry />

        <TouchableOpacity
  style={styles.checkButton}
  onPress={() => {
    Alert.alert(
      "Password Changed", // 제목
      "Complete to change password.", // 메시지
      [
        {
          text: "OK", // 버튼 텍스트
          onPress: () => navigation.goBack(), // OK 버튼을 눌렀을 때 이전 화면으로 이동
        },
      ],
      { cancelable: false } // 알림창 바깥을 눌러서 닫지 못하게 설정
    );
  }}
>
          <Text style={styles.checkButtonText}>{confirm}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  backButton: {
    marginBottom: 50,
  },
  inputTitle: {
    fontSize: 20,
    fontFamily: 'AggroL',
    marginTop: 50,
    marginBottom: 20,
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
  checkButton: {
    backgroundColor: '#0047A0',
    paddingVertical: 12,         
    paddingHorizontal: 24,       
    borderRadius: 8,             
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30
  },
  checkButtonText: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'AggroL',
  },
});

export default PasswordChangeScreen;
