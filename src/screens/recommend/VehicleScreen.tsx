import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';

type VehicleScreenNavigationProp = StackNavigationProp<RootStackParamList, 'VehicleScreen'>;
type VehicleScreenRouteProp = RouteProp<RootStackParamList, 'VehicleScreen'>;

const VehicleScreen: React.FC = () => {
  const navigation = useNavigation<VehicleScreenNavigationProp>();
  const route = useRoute<VehicleScreenRouteProp>();
  const { totalDays, startDate, endDate } = route.params;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // 번역된 텍스트 상태
  const [questionText, setQuestionText] = useState<string>('여행 예산에 대해 알려주세요!');
  const [info, setInfo] = useState<string>('여행 시 이용하실 이동수단을 선택해주세요.');
  const [valueOption1, setValueOption1] = useState<string>('대중교통');
  const [valueOption2, setValueOption2] = useState<string>('자가용');
  const [next, setNext] = useState<string>('여행경로 추천받기');

  const { language: globalLanguage } = useLanguage();

  useEffect(() => {
    const translateTexts = async () => {
      try {
        const translatedQuestion = await translateText('이동수단을 선택해주세요!', globalLanguage);
        setQuestionText(translatedQuestion);

        const translatedInfo = await translateText('여행 시 이용하실 이동수단을 선택해주세요.', globalLanguage);
        setInfo(translatedInfo);

        const translatedOption1 = await translateText('대중교통', globalLanguage);
        setValueOption1(translatedOption1);

        const translatedOption2 = await translateText('자가용', globalLanguage);
        setValueOption2(translatedOption2);
        
        const translatedNext = await translateText('여행경로 추천받기', globalLanguage);
        setNext(translatedNext);
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateTexts();
  }, [globalLanguage]);

  const handleSelect = (option: string) => {
    setSelectedOption(prevOption => (prevOption === option ? null : option));

    if (selectedOption === option) {
      setSelectedOption(null);
      setInfo('여행 시 이용하실 이동수단을 선택해주세요.');
    } else {
      setSelectedOption(option);

      // 각 옵션에 따라 info 업데이트
      if (option === valueOption1) {
        setInfo('버스나 지하철을 이용해요.');
      } else if (option === valueOption2) {
        setInfo('택시나 렌트카를 이용해요.');
      }
    }
  };

  const handleNext = () => {
    if (selectedOption) {
      console.log("totalDays는? " + totalDays);
      console.log("startDate는? " + startDate);
      console.log("endDate는? " + endDate);

      // navigation.navigate('RoutePage', { totalDays, startDate, endDate });
    } else {
      Alert.alert('오류', '이동수단을 선택해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back-button.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.question}>Q5.</Text>
      <Text style={styles.question}>{questionText}</Text>

      <View style={styles.rectangleContainer}>
          <View style={styles.rectangle}>
            <Text style={styles.info}>{info}</Text>
          </View>
        </View>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === valueOption1 && styles.selectedCard,
          ]}
          onPress={() => handleSelect(valueOption1)}
        >
          <Image source={require('../../assets/images/themeIcon/bus.png')} style={[styles.icon, { width: 80, height: 80 }]} />
          <Text style={[
            styles.label,
            selectedOption === valueOption1 && styles.selectedLabel,
          ]}>{valueOption1}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === valueOption2 && styles.selectedCard,
          ]}
          onPress={() => handleSelect(valueOption2)}
        >
          <Image source={require('../../assets/images/themeIcon/car.png')} style={[styles.icon, { width: 80, height: 80 }]} />
          <Text style={[
            styles.label,
            selectedOption === valueOption2 && styles.selectedLabel,
          ]}>{valueOption2}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.caption}>*사진출처 Microsoft Fluent Emoji – Color</Text>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: selectedOption ? '#0047A0' : '#D3D3D3' }
        ]}
        onPress={handleNext}
        disabled={!selectedOption} 
      >
        <Text style={[
          styles.nextText,
          { color: 'white' } 
        ]}>
          {next}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    position: 'relative',
  },
  backButton: {
    marginBottom: 10,
  },
  question: {
    paddingLeft: 10,
    paddingBottom: 2,
    fontFamily: 'AggroM',
    fontSize: 24,
  },
    info: {
    fontFamily: 'AggroL',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  rectangleContainer:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  rectangle:{
    width: '90%',
    height: 65,
    borderRadius: 20,
    backgroundColor: 'white',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedCard: {
    backgroundColor: '#0047A0',
  },
  icon: {
    resizeMode: 'contain',
  },
  label: {
    marginTop: 10,
    fontFamily: 'AggroL',
    fontSize: 18,
    color: '#000000',
  },
  selectedLabel: {
    color: '#ffffff',
  },
  nextButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    position: 'absolute',
    bottom: 50,
    left: 20,
  },
  nextText: {
    fontFamily: 'AggroL',
    fontSize: 18,
  },
  caption: {
    textAlign: 'left',
    color: '#888',
    fontSize: 12,
    fontFamily: 'AggroL',
    marginBottom: 100,
    marginTop: 30,
  },
});

export default VehicleScreen;