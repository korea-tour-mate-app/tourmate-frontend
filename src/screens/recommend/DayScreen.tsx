import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { eachDayOfInterval, format } from 'date-fns'; 
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/navigationTypes';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation'; 
import { useSelection } from '../../components/SelectionContext';

type DayScreenNavigationProp = RootStackNavigationProp<'DayScreen'>;

const DayScreen = () => {
  const navigation = useNavigation<DayScreenNavigationProp>();
  const { language: globalLanguage } = useLanguage();
  const { selectedDay, setSelectedDay } = useSelection();  // 상태와 setter 함수 사용
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const [question, setQuestion] = useState<string>('언제 가시나요?');
  const [info, setInfo] = useState<string>('Tourmate와 함께 하는 여정은 최대 3일까지 가능합니다.');
  const [go, setGo] = useState<string>('가는 날');
  const [come, setCome] = useState<string>('오는 날');
  const [next, setNext] = useState<string>('다음');
  const [translatedStartDate, setTranslatedStartDate] = useState<string>('');
  const [translatedEndDate, setTranslatedEndDate] = useState<string>('');

  useEffect(() => {
    const translateMenuTexts = async () => {
      try {
        const translatedQuestion = await translateText('언제 가시나요?', globalLanguage);
        setQuestion(translatedQuestion);
        
        const translatedInfo = await translateText('Tourmate와 함께 하는 여정은 최대 3일까지 가능합니다.', globalLanguage);
        setInfo(translatedInfo);

        const translatedGo = await translateText('가는 날', globalLanguage);
        setGo(translatedGo);

        const translatedCome = await translateText('오는 날', globalLanguage);
        setCome(translatedCome);

        const translatedNext = await translateText('다음', globalLanguage);
        setNext(translatedNext);
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateMenuTexts();
  }, [globalLanguage]);

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

  const formatDate = async (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일`;

    try {
      const translatedDate = await translateText(formattedDate, globalLanguage);
      return translatedDate;
    } catch (error) {
      console.error('Date Translation Error:', error);
      return formattedDate;
    }
  };

  useEffect(() => {
    const updateTranslatedDates = async () => {
      if (startDate) {
        const translatedStart = await formatDate(startDate);
        setTranslatedStartDate(translatedStart);
      }

      if (endDate) {
        const translatedEnd = await formatDate(endDate);
        setTranslatedEndDate(translatedEnd);
      }
    };

    updateTranslatedDates();
  }, [startDate, endDate, globalLanguage]);

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

      // 날짜를 '24.10.1' 포맷으로 변환
      const formattedStartDate = `${start.getFullYear().toString().slice(-2)}.${start.getMonth() + 1}.${start.getDate()}`;
      const formattedEndDate = `${end.getFullYear().toString().slice(-2)}.${end.getMonth() + 1}.${end.getDate()}`;

      // 선택된 날짜를 SelectionContext에 저장
      const newSelectedDay = [formattedStartDate, formattedEndDate, totalDays];
      setSelectedDay(newSelectedDay);
      
      console.log('newSelectedDay:', newSelectedDay);

      // 다음 화면으로 이동
      navigation.navigate('WithWhoScreen');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back-button.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.question}>Q2.</Text>
      <Text style={styles.title}>{question}</Text>
      <Text style={styles.infoText}>
        {info}
      </Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDates()}
        style={[styles.calendar, { borderRadius: 30, backgroundColor: 'transparent' }]}
        markingType={'period'}
      />
      <View style={styles.selectedDatesRow}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>{go}</Text>
          <Text style={styles.dateText}>{translatedStartDate}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>{come}</Text>
          <Text style={styles.dateText}>{translatedEndDate}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: startDate && endDate ? '#0047A0' : '#D3D3D3' }]}
        onPress={handleNext}
        disabled={!startDate || !endDate} 
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
  title: {
    paddingLeft: 10,
    fontFamily: 'SBAggroM',
    fontSize: 24,
    marginBottom: 20,
    color: '#000000',
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
    fontFamily: 'SBAggroL',
    fontSize: 24,
    marginBottom: 10,
    color: '#000000',
  },
  dateText: {
    fontFamily: 'SBAggroL',
    fontSize: 18,
    color: '#000000',
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
    color: 'white',
  },
  infoText: {
    fontSize: 13.5,
    color: '#0047A0',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'SBAggroL',
  },
  highlightedText: {
    color: '#0047A0',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default DayScreen;
