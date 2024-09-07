// screens/BudgetScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // 여기서 RouteProp을 가져옵니다
import { RootStackParamList } from '../navigation/navigationTypes'; // 경로를 알맞게 수정해주세요

type BudgetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BudgetScreen'>;
type BudgetScreenRouteProp = RouteProp<RootStackParamList, 'BudgetScreen'>;

const BudgetScreen: React.FC = () => {
  const navigation = useNavigation<BudgetScreenNavigationProp>();
  const route = useRoute<BudgetScreenRouteProp>();
  
  const { totalDays, startDate, endDate } = route.params;

  // 선택된 카드를 관리하기 위한 상태
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // 선택된 카드를 설정하거나 해제하는 함수
  const handleSelect = (option: string) => {
    setSelectedOption(prevOption => (prevOption === option ? null : option));
  };

  // 다음 버튼 클릭 시 경로 추천 결과 페이지로 이동
  const handleNext = () => {
    if (selectedOption) {
      console.log("totalDays는? " + totalDays);
      console.log("startDate는? " + startDate);
      console.log("endDate는? " + endDate);

    //   navigation.navigate('RoutePage', { totalDays, startDate, endDate });
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
      <Text style={styles.question}>여행 예산에 대해 알려주세요!</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '가성비 여행' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('가성비 여행')}
        >
          <Image source={require('../../assets/images/themeIcon/lowrange_travel.png')} style={[styles.icon, { width: 40, height: 40 }]} />
          <Text style={[
            styles.label,
            selectedOption === '가성비 여행' && styles.selectedLabel,
          ]}>가성비 여행</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '다소 가성비 여행' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('다소 가성비 여행')}
        >
          <Image source={require('../../assets/images/themeIcon/lowrange_travel.png')} style={[styles.icon, { width: 60, height: 60 }]} />
          <Text style={[
            styles.label,
            selectedOption === '다소 가성비 여행' && styles.selectedLabel,
          ]}>다소 가성비 여행</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '다소 럭셔리 여행' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('다소 럭셔리 여행')}
        >
          <Image source={require('../../assets/images/themeIcon/premium_travel.png')} style={[styles.icon, { width: 40, height: 40 }]} />
          <Text style={[
            styles.label,
            selectedOption === '다소 럭셔리 여행' && styles.selectedLabel,
          ]}>다소 럭셔리 여행</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '럭셔리 여행' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('럭셔리 여행')}
        >
          <Image source={require('../../assets/images/themeIcon/premium_travel.png')} style={[styles.icon, { width: 60, height: 60 }]} />
          <Text style={[
            styles.label,
            selectedOption === '럭셔리 여행' && styles.selectedLabel,
          ]}>럭셔리 여행</Text>
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
          여행 경로 추천받기
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
    position: 'relative', // 부모 컨테이너의 위치를 relative로 설정
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
    position: 'absolute', // 절대 위치 설정
    bottom: 50, // 하단에서 50px 위로 위치
    left: 20,  // 좌우 padding을 고려해서 left와 right도 설정
  },
  nextText: {
    fontFamily: 'AggroL',
    fontSize: 18,
  },
  caption: {
    textAlign: 'left', // 왼쪽 정렬
    color: '#888',
    fontSize: 12,
    fontFamily: 'AggroL',
    marginBottom: 100,
    marginTop: -76
  },
});

export default BudgetScreen;