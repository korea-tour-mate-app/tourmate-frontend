import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/translation';
import { RootTabParamList } from '../../components/BottomTabNavigator';

const PasswordChangeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  console.log('현재언어:', globalLanguage);

  useEffect(() => {
    console.log('Current language:', globalLanguage); // 현재 언어 확인
    const translateMenuTexts = async () => {
      console.log('Translating texts...');
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
  }, [globalLanguage]); // 글로벌 언어가 변경될 때마다 번역 실행

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

        <TouchableOpacity style={styles.checkButton} onPress={() => navigation.goBack()}>
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
    backgroundColor: 'black',
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
