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
  const dynamicStyles = getDynamicStyles(globalLanguage); // 컴포넌트 내부에서 사용

  // 다중 선택을 위한 배열 상태
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  // 번역된 텍스트 상태
  const [question, setQuestion] = useState<string>('누구와 여행을 떠나시나요?');
  const [parent, setParent] = useState<string>('부모/조부모/형제자매');
  const [spouse, setSpouse] = useState<string>('배우자');
  const [friend, setFriend] = useState<string>('친구/동료');
  const [children, setChildren] = useState<string>('자녀');
  const [couple, setCouple] = useState<string>('연인');
  const [group, setGroup] = useState<string>('친목 단체/모임');
  const [next, setNext] = useState<string>('다음');

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

        const translatedGroup = await translateText('친목단체', globalLanguage);
        setGroup(translatedGroup);

        const translatedNext = await translateText('다음', globalLanguage); // 추가된 부분
        setNext(translatedNext); 
        
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateTexts();
  }, [globalLanguage]);

  // 다중 선택을 위한 handleSelect 함수
  const handleSelect = (index: number) => {
    // 선택된 인덱스를 selectedWithWho에 추가하거나 제거
    const newSelectedOptions = selectedOptions.includes(index)
      ? selectedOptions.filter(opt => opt !== index) // 이미 선택된 경우 제거
      : [...selectedOptions, index]; // 선택되지 않은 경우 추가

    setSelectedOptions(newSelectedOptions); // 선택된 인덱스 상태 업데이트
    setSelectedWithWho(newSelectedOptions); // 선택된 인덱스를 setSelectedWithWho에 업데이트
  };

  const handleNext = () => {
    console.log('selectedWithWho:', selectedWithWho);
    if (selectedOptions.length > 0) { // 선택된 옵션이 있는지 확인
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
            selectedOptions.includes(0) && styles.selectedCard, // 다중 선택 확인
          ]}
          onPress={() => handleSelect(0)}
        >
          <Image source={require('../../assets/images/themeIcon/who_parent.png')} style={styles.icon} />
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(0) && styles.selectedLabel,
            { textAlign: 'center', marginVertical: -7 }, // 중앙 정렬 추가
          ]}>
            {parent.split('/')[0]} {/* 부모/조부모 중 부모 부분 사용 */}
          </Text>
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(0) && styles.selectedLabel,
            { textAlign: 'center', marginVertical: -7 }, // 중앙 정렬 추가
          ]}>
            {parent.split('/')[1]} {/* 부모/조부모 중 조부모 부분 사용 */}
          </Text>
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(0) && styles.selectedLabel,
            { textAlign: 'center', marginVertical: -7, marginBottom: 4 }, // 중앙 정렬 추가
          ]}>
            {parent.split('/')[2]} {/* 부모/조부모 중 조부모 부분 사용 */}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOptions.includes(1) && styles.selectedCard,
          ]}
          onPress={() => handleSelect(1)}
        >
          <Image source={require('../../assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(1) && styles.selectedLabel,
          ]}>{spouse}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOptions.includes(2) && styles.selectedCard,
          ]}
          onPress={() => handleSelect(2)}
        >
          <Image source={require('../../assets/images/themeIcon/who_friend.png')} style={styles.icon} />
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(2) && styles.selectedLabel,
            { textAlign: 'center', marginVertical: -7},
          ]}>{friend.split('/')[0]}</Text>
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(2) && styles.selectedLabel,
            { textAlign: 'center', marginVertical: -7 },
          ]}>{friend.split('/')[1]}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOptions.includes(3) && styles.selectedCard,
          ]}
          onPress={() => handleSelect(3)}
        >
          <Image source={require('../../assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(3) && styles.selectedLabel,
          ]}>{children}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOptions.includes(4) && styles.selectedCard,
          ]}
          onPress={() => handleSelect(4)}
        >
          <Image source={require('../../assets/images/themeIcon/who_couple.png')} style={styles.icon} />
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(4) && styles.selectedLabel,
          ]}>{couple}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.card,
            selectedOptions.includes(5) && styles.selectedCard,
          ]}
          onPress={() => handleSelect(5)}
        >
          <Image source={require('../../assets/images/themeIcon/who_group.png')} style={styles.icon} />
          <Text style={[
            dynamicStyles.label,
            selectedOptions.includes(5) && styles.selectedLabel,
          ]}>{group}</Text>
        </TouchableOpacity>
        
      </View>

      <Text style={styles.caption}>*사진출처 Microsoft Fluent Emoji – Color</Text>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: selectedOptions.length > 0 ? '#0047A0' : '#D3D3D3' }
        ]}
        onPress={handleNext}
        disabled={selectedOptions.length === 0} // 선택된 항목이 없으면 비활성화
      >
        <Text style={styles.nextText}>{next}</Text>
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
    width: 150,
    height: 150,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 13,
    marginRight: 20,
    marginBottom: 20,
  },
  selectedCard: {
    backgroundColor: '#0047A0',
  },
  icon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
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
    marginBottom: 40,
    marginTop: 0,
    marginLeft: 15,
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

const getDynamicStyles = (globalLanguage: string) => StyleSheet.create({
  label: {
    marginTop: 10,
    fontFamily: 'SBAggroL',
    fontSize: globalLanguage !== 'ko' ? 14 : 18,
    color: '#000000',
  },
});



export default WithWhoScreen;