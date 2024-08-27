import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootTabParamList } from '@/components/BottomTabNavigator';


const DayScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDayPress = (day: { dateString: string }) => {
    if (!startDate) {
      setStartDate(day.dateString);
    } else if (!endDate) {
      if (new Date(day.dateString) < new Date(startDate)) {
        // 오는 날이 가는 날보다 이전인 경우, 그 날짜를 가는 날로 설정
        setStartDate(day.dateString);
        setEndDate(null);
      } else {
        setEndDate(day.dateString);
      }
    } else {
      // 날짜 리셋
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      navigation.navigate('(tabs)/recommend-page/withWho');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={require('@/assets/images/back-button.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.question}>Q2.</Text>
        <Text style={styles.title}>언제 가시나요?</Text>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={{
            [startDate || '']: { selected: true, startingDay: true, color: 'blue', textColor: 'white' },
            [endDate || '']: { selected: true, endingDay: true, color: 'blue', textColor: 'white' },
          }}
          style={styles.calendar}
        />
        <View style={styles.selectedDatesRow}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>가는 날</Text>
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>오는 날</Text>
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>다음</Text>
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
    fontFamily: 'AggroM',
    fontSize: 24,
  },
  title: {
    fontFamily: 'AggroM',
    fontSize: 24,
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 50,
  },
  selectedDatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  dateLabel: {
    fontFamily: 'AggroL',
    fontSize: 24,
    marginBottom: 10,
  },
  dateText: {
    fontFamily: 'AggroL',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0047A0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: 'AggroL',
    fontSize: 18,
    color: 'white',
  },
});

export default DayScreen;
