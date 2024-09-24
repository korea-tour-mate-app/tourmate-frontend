import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../navigation/navigationTypes';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';
import { useSelection } from '../../components/SelectionContext';

type WithWhoScreenNavigationProp = RootStackNavigationProp<'WithWhoScreen'>;
type WithWhoScreenRouteProp = RouteProp<RootStackParamList, 'WithWhoScreen'>;

interface WithWhoScreenProps {
  route: WithWhoScreenRouteProp;
}

const WithWhoScreen: React.FC<WithWhoScreenProps> = ({ route }) => {
  const navigation = useNavigation<WithWhoScreenNavigationProp>();
  const { language: globalLanguage } = useLanguage();
  const { selectedWithWho, setSelectedWithWho } = useSelection();  // 상태와 setter 함수 사용

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // 번역된 텍스트 상태
  const [question, setQuestion] = useState<string>('누구와 여행을 떠나시나요?');
  const [parent, setParent] = useState<string>('부모/조부모/형제자매');
  const [spouse, setSpouse] = useState<string>('배우자');
  const [friend, setFriend] = useState<string>('친구/동료');
  const [children, setChildren] = useState<string>('자녀');
  const [couple, setCouple] = useState<string>('연인');
  const [group, setGroup] = useState<string>('친목 단체/모임');

  useEffect(() => {
    const translateTexts = async () => {
      try {
        const translatedQuestion = await translateText('누구와 여행을 떠나시나요?', globalLanguage);
        setQuestion(translatedQuestion);

        const translatedParent = await translateText('부모/조부모/형제자매', globalLanguage);
        setParent(translatedParent);

        const translatedSpouse = await translateText('배우자', globalLanguage);
        setSpouse(translatedSpouse);

        const translatedFriend = await translateText('친구/동료', globalLanguage);
        setFriend(translatedFriend);

        const translatedChildren = await translateText('자녀', globalLanguage);
        setChildren(translatedChildren);

        const translatedCouple = await translateText('연인', globalLanguage);
        setCouple(translatedCouple);

        const translatedGroup = await translateText('친목 단체/모임', globalLanguage);
        setGroup(translatedGroup);
        
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateTexts();
  }, [globalLanguage]);

  const handleSelect = (index: number, option: string) => {
    // 선택된 인덱스를 selectedWithWho에 저장
    setSelectedWithWho(index);

    // 선택된 인덱스 업데이트
    setSelectedOption(prevOption => (prevOption === option ? null : option));
  };

  const handleNext = () => {
    console.log('selectedWithWho:', selectedWithWho);
    if (selectedOption) {
      navigation.navigate('VehicleScreen');
    } else {
      Alert.alert('오류', '여행 인원을 선택해주세요.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back-button.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.question}>Q3.</Text>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === parent && styles.selectedCard,
          ]}
          onPress={() => handleSelect(0, parent)}
        >
          <Image source={require('../../assets/images/themeIcon/who_parent.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === parent && styles.selectedLabel,
            { textAlign: 'center' }, // 중앙 정렬 추가
          ]}>
            부모/조부모
          </Text>
          <Text style={[
            styles.label,
            selectedOption === parent && styles.selectedLabel,
            { textAlign: 'center' }, // 중앙 정렬 추가
          ]}>
            형제자매
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === spouse && styles.selectedCard,
          ]}
          onPress={() => handleSelect(1, spouse)}
        >
          <Image source={require('../../assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === spouse && styles.selectedLabel,
          ]}>{spouse}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === children && styles.selectedCard,
          ]}
          onPress={() => handleSelect(3, children)}
        >
          <Image source={require('../../assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === children && styles.selectedLabel,
          ]}>{children}</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === friend && styles.selectedCard,
          ]}
          onPress={() => handleSelect(2, friend)}
        >
          <Image source={require('../../assets/images/themeIcon/who_friend.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === friend && styles.selectedLabel,
          ]}>{friend}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === couple && styles.selectedCard,
          ]}
          onPress={() => handleSelect(4, couple)}
        >
          <Image source={require('../../assets/images/themeIcon/who_couple.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === couple && styles.selectedLabel,
          ]}>{couple}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === group && styles.selectedCard,
          ]}
          onPress={() => handleSelect(5, group)}
        >
          <Image source={require('../../assets/images/themeIcon/who_group.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === group && styles.selectedLabel,
          ]}>{group}</Text>
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
        <Text style={styles.nextText}>다음</Text>
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
    fontFamily: 'SBAggroM',
    fontSize: 24,
    color: '#000000',
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
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  label: {
    marginTop: 10,
    fontFamily: 'SBAggroL',
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
    fontFamily: 'SBAggroL',
    fontSize: 18,
    color: 'white'
  },
  caption: {
    textAlign: 'left',
    color: '#888',
    fontSize: 12,
    fontFamily: 'SBAggroL',
    marginBottom: 100,
    marginTop: -130
  },
  multiLineLabelContainer: {
    alignItems: 'center', // 텍스트가 카드의 가운데 정렬되도록 설정
    justifyContent: 'center',
  },
  multiLineLabel: {
    marginTop: 10,
    fontFamily: 'SBAggroL',
    fontSize: 16, // 적절한 폰트 크기 설정
    color: '#000000',
    textAlign: 'center', // 텍스트 중앙 정렬
    lineHeight: 22, // 줄 간격 조정
  },
});

export default WithWhoScreen;
