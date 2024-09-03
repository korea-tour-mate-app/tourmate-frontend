import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { RootStackNavigationProp } from '../navigation/navigationTypes';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';

// Theme 객체의 타입 정의
interface Theme {
  label: string;
  subLabel?: string;
  backgroundColor: string;
  textColor: string;
  image: any;  // 이미지의 타입을 any로 설정, 필요에 따라 수정
}

type Themes = {
  [key: string]: Theme;
};

type ThemeScreenRouteProp = RouteProp<RootStackParamList, 'RecommendScreen'>;

type Props = {
  route: ThemeScreenRouteProp;
};


const RecommendScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp<'RecommendScreen'>>();
  const { language: globalLanguage } = useLanguage();

  const [question, setQuestion] = useState<string>('서울에서 어떤 여행 테마를 원하나요?');
  const [content, setContent] = useState<string>('원하는 테마를 모두 골라주세요.');
  const [next, setNext] = useState<string>('다음');

  const [themes, setThemes] = useState<Themes>({
    kpop: {
      label: 'K-POP',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/k-pop.png'),
    },
    palace: {
      label: '궁궐',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/palace.png'),
    },
    templeStay: {
      label: '템플스테이',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/temple-stay.png'),
    },
    leisure: {
      label: '레저스포츠',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/leisure.png'),
    },
    hotel: {
      label: '호캉스',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/hotel.png'),
    },
    hiking: {
      label: '등산코스',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/hiking.png'),
    },
    theme: {
      label: '테마시설',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/amusement-park.png'),
    },
    community: {
      label: '문화시설',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/community.png'),
    },
    handcraft: {
      label: '공방여행',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/handcraft.png'),
    },
    shopping: {
      label: '쇼핑',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/shopping.png'),
    },
    camping: {
      label: '캠핑',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/camping.png'),
    },
    entertainment: {
      label: '유흥/오락',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/yoohoo.png'),
    },
    spa: {
      label: '온천/스파',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/spa.png'),
    },
    education: {
      label: '교육/체험',
      subLabel: '참여하기',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/education.png'),
    },
    drama: {
      label: '드라마 촬영지',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/drama.png'),
    },
    religion: {
      label: '종교/성지 순례',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/religion.png'),
    },
    wellness: {
      label: '웰니스',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/wellness.png'),
    },
    sns: {
      label: 'SNS 인생샷',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/sns.png'),
    },
    pet: {
      label: '반려동물 동반',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/pet.png'),
    },
    influencer: {
      label: '인플루언서',
      subLabel: '따라하기',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/influencer.png'),
    },
    environment: {
      label: '친환경 여행',
      subLabel: '(플로깅 여행)',
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/plogging.png'),
    },
  });

  // 번역된 텍스트를 관리하는 useEffect
  useEffect(() => {
    const translateMenuTexts = async () => {
      try {
        const keys = Object.keys(themes) as (keyof Themes)[];
        const translatedThemes = await Promise.all(
          keys.map(async (key) => {
            const theme = themes[key];
            const translatedLabel = await translateText(theme.label, globalLanguage);
            const translatedSubLabel = theme.subLabel
              ? await translateText(theme.subLabel, globalLanguage)
              : undefined;
            return { [key]: { ...theme, label: translatedLabel, subLabel: translatedSubLabel } };
          })
        );
        setThemes(Object.assign({}, ...translatedThemes));
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateMenuTexts();
  }, [globalLanguage]);

  const handlePress = (key: keyof Themes) => {
    setThemes((prevThemes) => ({
      ...prevThemes,
      [key]: {
        ...prevThemes[key],
        backgroundColor: prevThemes[key].backgroundColor === '#ffffff' ? '#0047A0' : '#ffffff',
        textColor: prevThemes[key].textColor === '#000000' ? '#ffffff' : '#000000',
      },
    }));
  };

  // 다음 버튼 클릭 시 dayScreen으로 이동하는 함수
  const handleNext = () => {
    navigation.navigate('DayScreen');
  };  

  // FlatList의 렌더링 아이템을 위한 함수
  const renderItem = ({ item }: { item: { key: string; theme: Theme } }) => (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.rectangle, { backgroundColor: item.theme.backgroundColor }]}
        onPress={() => handlePress(item.key as keyof Themes)}
      >
        <Image source={item.theme.image} style={styles.icon} resizeMode='contain' />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: item.theme.textColor }]}>{item.theme.label}</Text>
          {item.theme.subLabel && <Text style={[styles.title, { color: item.theme.textColor }]}>{item.theme.subLabel}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  );

  const data = Object.keys(themes).map(key => ({ key, theme: themes[key] }));

  return (
    <View style={styles.container}>
      <View style={styles.fixedContent}>
        <Text style={styles.question}>Q1.</Text>
        <Text style={styles.question}>{question}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={
          <View style={styles.nextContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>{next}</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 80,
  },
  fixedContent: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  rectangle: {
    width: 150,
    height: 150,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center', 
    justifyContent: 'center', 
    marginLeft: 10,
    marginRight: 20,
  },
  flatListContent: {
    flexGrow: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  question: {
    fontFamily: 'AggroM',
    fontSize: 24,
  },
  content: {
    fontFamily: 'AggroL',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'AggroL',
    fontSize: 18,
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom:10,
  },
  nextContainer:{
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton:{
    width: 200,
    height: 50,
    backgroundColor: '#0047A0',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText:{
    fontFamily: 'AggroL',
    fontSize: 20,
    color: 'white',
  }
});

export default RecommendScreen;
