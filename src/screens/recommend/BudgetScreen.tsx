import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';

type BudgetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BudgetScreen'>;
type BudgetScreenRouteProp = RouteProp<RootStackParamList, 'BudgetScreen'>;

const BudgetScreen: React.FC = () => {
  const navigation = useNavigation<BudgetScreenNavigationProp>();
  const route = useRoute<BudgetScreenRouteProp>();
  const { totalDays, startDate, endDate } = route.params;

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // 번역된 텍스트 상태
  const [questionText, setQuestionText] = useState<string>('여행 예산에 대해 알려주세요!');
  const [valueOption1, setValueOption1] = useState<string>('가성비 여행');
  const [valueOption2, setValueOption2] = useState<string>('다소 가성비 여행');
  const [valueOption3, setValueOption3] = useState<string>('다소 럭셔리 여행');
  const [valueOption4, setValueOption4] = useState<string>('럭셔리 여행');
  const [next, setNext] = useState<string>('여행경로 추천받기');

  const { language: globalLanguage } = useLanguage();

  useEffect(() => {
    const translateTexts = async () => {
      try {
        const translatedQuestion = await translateText('여행 예산에 대해 알려주세요!', globalLanguage);
        setQuestionText(translatedQuestion);

        const translatedOption1 = await translateText('가성비 여행', globalLanguage);
        setValueOption1(translatedOption1);

        const translatedOption2 = await translateText('다소 가성비 여행', globalLanguage);
        setValueOption2(translatedOption2);

        const translatedOption3 = await translateText('다소 럭셔리 여행', globalLanguage);
        setValueOption3(translatedOption3);

        const translatedOption4 = await translateText('럭셔리 여행', globalLanguage);
        setValueOption4(translatedOption4);
        
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
  };

  const handleNext = () => {
    if (selectedOption) {
      console.log("totalDays는? " + totalDays);
      console.log("startDate는? " + startDate);
      console.log("endDate는? " + endDate);

      // navigation.navigate('RoutePage', { totalDays, startDate, endDate });
    } else {
      Alert.alert('오류', '여행 예산을 선택해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back-button.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.question}>Q4.</Text>
      <Text style={styles.question}>{questionText}</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === valueOption1 && styles.selectedCard,
          ]}
          onPress={() => handleSelect(valueOption1)}
        >
          <Image source={require('../../assets/images/themeIcon/lowrange_travel.png')} style={[styles.icon, { width: 40, height: 40 }]} />
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
          <Image source={require('../../assets/images/themeIcon/lowrange_travel.png')} style={[styles.icon, { width: 60, height: 60 }]} />
          <Text style={[
            styles.label,
            selectedOption === valueOption2 && styles.selectedLabel,
          ]}>{valueOption2}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === valueOption3 && styles.selectedCard,
          ]}
          onPress={() => handleSelect(valueOption3)}
        >
          <Image source={require('../../assets/images/themeIcon/premium_travel.png')} style={[styles.icon, { width: 40, height: 40 }]} />
          <Text style={[
            styles.label,
            selectedOption === valueOption3 && styles.selectedLabel,
          ]}>{valueOption3}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === valueOption4 && styles.selectedCard,
          ]}
          onPress={() => handleSelect(valueOption4)}
        >
          <Image source={require('../../assets/images/themeIcon/premium_travel.png')} style={[styles.icon, { width: 60, height: 60 }]} />
          <Text style={[
            styles.label,
            selectedOption === valueOption4 && styles.selectedLabel,
          ]}>{valueOption4}</Text>
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
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
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
    marginTop: -76
  },
});

export default BudgetScreen;
