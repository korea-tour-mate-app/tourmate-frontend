import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image, Switch } from 'react-native';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes'; 
import { RootTabParamList } from '../../components/BottomTabNavigator';

type LanguageScreenRouteProp = RouteProp<RootStackParamList, 'LanguageScreen'>;
type LanguageScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LanguageScreen'>;

const LanguageScreen: React.FC = () => {
  const route = useRoute<LanguageScreenRouteProp>();
  const navigation = useNavigation<LanguageScreenNavigationProp>();
  const { language: globalLanguage, setLanguage } = useLanguage();

  // 토글 상태 관리를 위한 state
  const [selectedLanguage, setSelectedLanguage] = useState<string>(globalLanguage);

  const [info, setInfo] = useState<string>('동시에 선택할 수 없어요.');

  useEffect(() => {
    const translateMenuTexts = async () => {
      try {
        const translatedInfo = await translateText('동시에 선택할 수 없어요.', globalLanguage);
        setInfo(translatedInfo);

      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateMenuTexts();
  }, [globalLanguage]);

  const handleLanguageToggle = (newLang: string) => {
    setSelectedLanguage(newLang);
    setLanguage(newLang);
    navigation.navigate('MyPage', { language: newLang });; 
  };

  const renderLanguageOption = (language: string, label: string) => {
    return (
      <View style={styles.optionContainer}>
        <Text style={styles.menu}>{label}</Text>
        <Switch
          onValueChange={() => handleLanguageToggle(language)}
          value={selectedLanguage === language}
        />
      </View>
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/images/back-button.png')} />
          </TouchableOpacity>

          <View style={styles.redLine}></View>
          <Text style={styles.info}>{info}</Text>

          <View style={styles.menuContainer}>
            {renderLanguageOption('en', 'English')}
            {renderLanguageOption('ja', '日本語')}
            {renderLanguageOption('zh-CN', '汉语(简体)')}
            {renderLanguageOption('zh-TW', '漢語(繁體)')}
            {renderLanguageOption('vi', 'tiếng Việt')}
            {renderLanguageOption('th', 'ภาษาไทย')}
            {renderLanguageOption('id', 'Bahasa Indonésia')}
            {renderLanguageOption('fr', 'la langue française')}
            {renderLanguageOption('es', 'castellano')}
            {renderLanguageOption('ru', 'Русский')}
            {renderLanguageOption('de', 'Deutsch')}
            {renderLanguageOption('it', 'la lingua italiana')}
            {renderLanguageOption('ko', '한국어')}

            <View style={styles.blueLine}></View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  backButton: {
    marginLeft: 20,
  },
  redLine: {
    marginTop: 20,
    marginBottom: 30,
    height: 25,
    width: '100%',
    backgroundColor: '#CD2E3A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  info:{
    fontSize: 18,
    marginTop: 10,
    marginLeft: 30,
  },
  menuContainer: {
    flex: 1,
  },
  menu: {
    fontSize: 20,
    fontFamily: 'AggroL',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    marginHorizontal: 50,
  },
  blueLine: {
    marginTop: 30,
    height: 25,
    width: '100%',
    backgroundColor: '#0047A0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default LanguageScreen;
