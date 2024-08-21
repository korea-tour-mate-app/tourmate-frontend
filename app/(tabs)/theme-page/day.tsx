import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useRouter } from 'expo-router';

const DayScreen = () => {
  const router = useRouter();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDayPress = (day: { dateString: string }) => {
    if (!startDate) {
      setStartDate(day.dateString);
    } else if (!endDate) {
      setEndDate(day.dateString);
    } else {
      // 날짜 리셋 
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  const handleConfirm = () => {
    if (startDate && endDate) {

    }
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
        <View style={styles.selectedDates}>
          <Text style={styles.dateText}>가는 날: {startDate || ''}</Text>
          <Text style={styles.dateText}>오는 날: {endDate || ''}</Text>
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
  question:{
    fontFamily: 'AggroM',
    fontSize: 24,
  },
  title: {
    fontFamily: 'AggroM',
    fontSize: 24,
    marginBottom: 20,
  },
  calendar: {
    marginBottom: 20,
  },
  selectedDates: {
    marginBottom: 20,
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
  },
  buttonText: {
    fontFamily: 'AggroL',
    fontSize: 18,
    color: 'white',
  },
});

export default DayScreen;
