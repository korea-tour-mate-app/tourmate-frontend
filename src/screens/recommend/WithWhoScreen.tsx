import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../navigation/navigationTypes';

type WithWhoScreenNavigationProp = RootStackNavigationProp<'WithWhoScreen'>;
type WithWhoScreenRouteProp = RouteProp<RootStackParamList, 'WithWhoScreen'>;

interface WithWhoScreenProps {
  route: WithWhoScreenRouteProp;
}

const WithWhoScreen: React.FC<WithWhoScreenProps> = ({ route }) => {
  const { totalDays, startDate, endDate } = route.params;
  const navigation = useNavigation<WithWhoScreenNavigationProp>();

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(prevOption => (prevOption === option ? null : option));
  };

  const handleNext = () => {
    if (selectedOption) {
      console.log("totalDays는? " + totalDays);
      console.log("startDate는? " + startDate);
      console.log("endDate는? " + endDate);
      navigation.navigate('BudgetScreen', { totalDays, startDate, endDate });
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
      <Text style={styles.question}>누구와 여행을 떠나시나요?</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '배우자' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('배우자')}
        >
          <Image source={require('../../assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === '배우자' && styles.selectedLabel,
          ]}>배우자</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '가족' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('가족')}
        >
          <Image source={require('../../assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === '가족' && styles.selectedLabel,
          ]}>가족</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '친구/동료' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('친구/동료')}
        >
          <Image source={require('../../assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === '친구/동료' && styles.selectedLabel,
          ]}>친구/동료</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '자녀' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('자녀')}
        >
          <Image source={require('../../assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === '자녀' && styles.selectedLabel,
          ]}>자녀</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '연인' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('연인')}
        >
          <Image source={require('../../assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === '연인' && styles.selectedLabel,
          ]}>연인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.card,
            selectedOption === '친목 단체/모임' && styles.selectedCard,
          ]}
          onPress={() => handleSelect('친목 단체/모임')}
        >
          <Image source={require('../../assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
          <Text style={[
            styles.label,
            selectedOption === '친목 단체/모임' && styles.selectedLabel,
          ]}>친목 단체/모임</Text>
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
    width: 50,
    height: 50,
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
    color: 'white'
  },
  caption: {
    textAlign: 'left',
    color: '#888',
    fontSize: 12,
    fontFamily: 'AggroL',
    marginBottom: 100,
    marginTop: -130
  },
});

export default WithWhoScreen;
