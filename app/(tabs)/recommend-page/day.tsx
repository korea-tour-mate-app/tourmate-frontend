import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { eachDayOfInterval, format } from 'date-fns'; 
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
      const selectedDate = new Date(day.dateString);
      const startDateObj = new Date(startDate);
      const maxEndDate = new Date(startDateObj);
      maxEndDate.setDate(startDateObj.getDate() + 2); // 가는 날로부터 3일 후의 날짜 계산
  
      if (selectedDate > maxEndDate) {
        // 사용자가 3일 이상의 날짜를 선택하면
        setEndDate(format(maxEndDate, 'yyyy-MM-dd')); // 오는 날을 최대 3일 후로 설정
      } else if (selectedDate < startDateObj) {
        // 선택한 날짜가 가는 날 이전인 경우
        setStartDate(day.dateString);
        setEndDate(null);
      } else {
        // 사용자가 3일 이내의 날짜를 선택하면
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
            borderTopLeftRadius: 15, // 왼쪽 상단 모서리를 둥글게
            borderBottomLeftRadius: 15, // 왼쪽 하단 모서리를 둥글게
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
            borderTopRightRadius: 15, // 오른쪽 상단 모서리를 둥글게
            borderBottomRightRadius: 15, // 오른쪽 하단 모서리를 둥글게
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
  
      // 가는 날과 오는 날 사이의 날짜들 처리
      const datesInRange = eachDayOfInterval({
        start: new Date(startDate!),
        end: new Date(endDate!),
      }).slice(1, -1);
  
      datesInRange.forEach((date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        markedDates[formattedDate] = {
          customStyles: {
            container: {
              backgroundColor: '#4F8EF7', // 중간 날짜들에 동일한 색상 적용
              borderRadius: 0, // 모서리 둥글지 않게 설정
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
        <Text style={styles.infoText}>
          TourMate와 함께 하는 여정은 {''}
          <Text style={styles.highlightedText}>최대 3일</Text>
          까지 가능합니다.
        </Text>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()} // 함수 호출로 대체
          style={[styles.calendar, { borderRadius: 30, backgroundColor: 'transparent' }]} // 배경색을 투명하게 설정
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
    height: 50,  // 고정된 높이를 지정하여 레이아웃 변경 방지
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
    backgroundColor: '#0047A0',
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
    color: 'white',
  },
  infoText: {
    fontSize: 13.5,
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'AggroL',
  },
  highlightedText: {
    color: '#0047A0',
    fontWeight: 'bold', 
    textDecorationLine: 'underline', // 밑줄 추가
  },
  
});

export default DayScreen;
