import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';

const WithWhoScreen = () => {
  const router = useRouter();

  // 선택된 카드를 관리하기 위한 상태
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

// 선택된 카드를 설정하거나 해제하는 함수
const handleSelect = (option: string) => {
  setSelectedOption(prevOption => (prevOption === option ? null : option));
};

  // 다음 버튼 클릭 시 budget.tsx로 이동
  const handleNext = () => {
    if (selectedOption) {
      router.push('(tabs)/recommend-page/budget');
    } else {
      Alert.alert('TourMate', '여행 동반자를 선택해주세요!');
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('@/assets/images/back-button.png')} style={styles.backButton} />
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
            <Image source={require('@/assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
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
            <Image source={require('@/assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
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
            <Image source={require('@/assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
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
            <Image source={require('@/assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
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
            <Image source={require('@/assets/images/themeIcon/who_spouse.png')} style={styles.icon} />
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
            <Image source={require('@/assets/images/themeIcon/who_daughter.png')} style={styles.icon} />
            <Text style={[
              styles.label,
              selectedOption === '친목 단체/모임' && styles.selectedLabel,
            ]}>친목 단체/모임</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.caption}>*사진출처 Microsoft Fluent Emoji – Color</Text>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>다음</Text>
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
    fontSize: 16,
    color: '#000000',
  },
  selectedLabel: {
    color: '#ffffff',
  },
  nextButton:{
    height: 50,
    backgroundColor: '#0047A0',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    width: '100%',
  },
  nextText:{
    fontFamily: 'AggroL',
    fontSize: 20,
    color: 'white',
  },
  caption: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    fontFamily: 'AggroL',
  },
});

export default WithWhoScreen;
