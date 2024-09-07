import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { eachDayOfInterval, format } from 'date-fns'; 
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/navigationTypes'; 

type DayScreenNavigationProp = RootStackNavigationProp<'DayScreen'>;

const DayScreen = () => {
  const navigation = useNavigation<DayScreenNavigationProp>();

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const handleDayPress = (day: { dateString: string }) => {
    if (!startDate) {
      setStartDate(day.dateString);
    } else if (!endDate) {
      const selectedDate = new Date(day.dateString);
      const startDateObj = new Date(startDate);
      const maxEndDate = new Date(startDateObj);
      maxEndDate.setDate(startDateObj.getDate() + 2);
  
      if (selectedDate > maxEndDate) {
        setEndDate(format(maxEndDate, 'yyyy-MM-dd'));
      } else if (selectedDate < startDateObj) {
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

  const getMarkedDates = () => {
    let markedDates: { [key: string]: any } = {};
  
    if (startDate) {
      markedDates[startDate] = {
        customStyles: {
          container: {
            backgroundColor: '#4F8EF7',
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
        startingDay: true,
        color: '#4F8EF7',
        textColor: 'white',
      };
    }
  
    if (endDate) {
      markedDates[endDate] = {
        customStyles: {
          container: {
            backgroundColor: '#4F8EF7',
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
          },
          text: {
            color: 'white',
            fontWeight: 'bold',
          },
        },
        endingDay: true,
        color: '#4F8EF7',
        textColor: 'white',
      };
  
      const datesInRange = eachDayOfInterval({
        start: new Date(startDate!),
        end: new Date(endDate!),
      }).slice(1, -1);
  
      datesInRange.forEach((date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        markedDates[formattedDate] = {
          customStyles: {
            container: {
              backgroundColor: '#4F8EF7',
              borderRadius: 0,
            },
            text: {
              color: 'white',
            },
          },
          color: '#4F8EF7',
          textColor: 'white',
        };
      });
    }
  
    return markedDates;
  };
  
  const handleNext = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const totalDays = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1; // 총 일수 계산
  
      navigation.navigate('WithWhoScreen', { totalDays, startDate, endDate });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back-button.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.question}>Q2.</Text>
      <Text style={styles.title}>언제 가시나요?</Text>
      <Text style={styles.infoText}>
        TourMate와 함께 하는 여정은 {''}
        <Text style={styles.highlightedText}>최대 3일</Text>
        까지 가능합니다.
      </Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()} 
        style={[styles.calendar, { borderRadius: 30, backgroundColor: 'transparent' }]}
        markingType={'period'} 
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
      <TouchableOpacity 
        style={[styles.nextButton, { backgroundColor: startDate && endDate ? '#0047A0' : '#D3D3D3' }]} 
        onPress={handleNext}
        disabled={!startDate || !endDate}  // 버튼을 비활성화 시킴
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
  title: {
    paddingLeft: 10,
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
    height: 50,
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
    color: 'white',
  },
  infoText: {
    fontSize: 13.5,
    color: '#666565',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'AggroL',
  },
  highlightedText: {
    color: '#0047A0',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default DayScreen;
