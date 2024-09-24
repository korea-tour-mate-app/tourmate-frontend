import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, AnimatableStringValue } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/navigationTypes';
import { RootStackNavigationProp } from '../navigation/navigationTypes';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';
import { useSelection } from '../../components/SelectionContext';


interface Theme {
  label: string;
  subLabel?: string;
  backgroundColor: string;
  textColor: string;
  image?: any;
}

interface Texts {
  [key: string]: {
    label: string;
    subLabel?: string;
  };
}

type Themes = {
  [key: string]: Theme;
};

type ThemeScreenRouteProp = RouteProp<RootStackParamList, 'ThemeScreen'>;

type Props = {
  route: ThemeScreenRouteProp;
};

const RecommendScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp<'ThemeScreen'>>();
  const { language: globalLanguage } = useLanguage();
  const { selectedThemes, setSelectedThemes } = useSelection();  // 상태와 setter 함수 사용
  // const [selectedThemes, setSelectedThemes] = useState<number[]>([]);
  const dynamicStyles = getDynamicStyles(globalLanguage); // 컴포넌트 내부에서 사용

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
      label: '역사',
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
    spa: {
      label: '온천',
      subLabel: '스파', // subLabel에 '스파' 추가
      backgroundColor: '#ffffff',
      textColor: '#000000',
      image: require('../../assets/images/themeIcon/spa.png'),
    }
  });

 
  // 한글 라벨을 담는 Text 인터페이스
  const textData: Texts = {
    kpop: { label: 'K-POP' },
    palace: { label: '역사' },
    templeStay: { label: '템플스테이' },
    leisure: { label: '레저스포츠' },
    hotel: { label: '호캉스' },
    hiking: { label: '등산코스' },
    theme: { label: '테마시설' },
    community: { label: '문화시설' },
    handcraft: { label: '공방여행' },
    shopping: { label: '쇼핑' },
    camping: { label: '캠핑' },
    spa: { label: '온천', subLabel: '스파' },
  };
  

  useEffect(() => {
    const translateTexts = async () => {
      try {
        const keys = Object.keys(themes) as (keyof Themes)[];
        const translatedThemes = await Promise.all(
          keys.map(async (key) => {
            const theme = themes[key];
            const translatedLabel = globalLanguage === 'ko' ? textData[key].label : await translateText(theme.label, globalLanguage);
            const translatedSubLabel = globalLanguage === 'ko' && textData[key].subLabel
              ? textData[key].subLabel
              : theme.subLabel
              ? await translateText(theme.subLabel, globalLanguage)
              : undefined;
            return { [key]: { ...theme, label: translatedLabel, subLabel: translatedSubLabel } };
          })
        );
        const newThemes = Object.assign({}, ...translatedThemes);

        const translatedQuestion = await translateText('서울에서 어떤 여행 테마를 원하나요?', globalLanguage);
        const translatedContent = await translateText('원하는 테마를 모두 골라주세요.', globalLanguage);
        const translatedNext = await translateText('다음', globalLanguage);

        setThemes(newThemes);
        setQuestion(translatedQuestion);
        setContent(translatedContent);
        setNext(translatedNext);
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateTexts();
  }, [globalLanguage]);

  const handlePress = (key: keyof Themes) => {
    const themeIndex = Object.keys(themes).indexOf(key as string); // key의 인덱스 가져오기
    setThemes((prevThemes) => ({
      ...prevThemes,
      [key]: {
        ...prevThemes[key],
        backgroundColor: prevThemes[key].backgroundColor === '#ffffff' ? '#0047A0' : '#ffffff',
        textColor: prevThemes[key].textColor === '#000000' ? '#ffffff' : '#000000',
      },
    }));
    
    // 선택된 테마를 selectedThemes에 추가 또는 제거
    setSelectedThemes((prevSelectedThemes : number[]) => {
      const themeIndex = Object.keys(themes).indexOf(String(key));

      if (prevSelectedThemes.includes(themeIndex)) {
        // 이미 선택된 테마인 경우 제거
        return prevSelectedThemes.filter((theme) => theme !== themeIndex);
      } else {
        // 선택되지 않은 테마인 경우 추가
        return [...prevSelectedThemes, themeIndex];
      }
    });
  };

  const handleNext = () => {
      // 선택된 테마가 있는지 확인 후 이동
      if (selectedThemes.length > 0) {
        console.log('selectedThemes:', selectedThemes);
        navigation.navigate('DayScreen');
      } else {
        console.log('선택된 테마가 없습니다.');
      }
  };

  // 기존 renderItem 메서드의 수정 후
  const renderItem = ({ item }: { item: { key: string; theme: Theme } }) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.rectangle, { backgroundColor: item.theme.backgroundColor }]}
          onPress={() => handlePress(item.key as keyof Themes)}
        >
          <Image source={item.theme.image} style={styles.icon} resizeMode='contain' />
          <View style={styles.textContainer}>
            <Text style={[dynamicStyles.title, { color: item.theme.textColor }]}>
              {item.theme.label}
            </Text>
            {item.theme.subLabel && (
              <Text style={[dynamicStyles.subTitle, { color: item.theme.textColor }]}>
                {item.theme.subLabel}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

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
            <TouchableOpacity
              style={[
                styles.nextButton,
                {
                  backgroundColor: selectedThemes.length > 0 ? '#0047A0' : '#D3D3D3',
                },
              ]}
              onPress={handleNext}
              disabled={selectedThemes.length === 0} // 선택된 테마가 없으면 비활성화
            >
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 30,
    paddingRight: 30,
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
    fontFamily: 'SBAggroM',
    fontSize: 24,
    color: '#000000',
  },
  content: {
    fontFamily: 'SBAggroL',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 20,
    color: '#000000',
  },
  icon: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  nextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    width: '100%', // 전체 화면 너비로 설정
    paddingVertical: 15, // 세로 padding을 사용하여 높이 설정
    backgroundColor: '#0047A0',
    borderRadius: 10, // radius 조정
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, // 버튼 위아래 여백 추가
  },
  nextText: {
    fontFamily: 'SBAggroL',
    fontSize: 18,
    color: 'white',
  }
});

const getDynamicStyles = (globalLanguage: string) => StyleSheet.create({
  title: {
    fontFamily: 'SBAggroL',
    fontSize: globalLanguage !== 'ko' ? 15 : 18,
    color: '#000000',
  },
  subTitle: {  // subLabel에 대한 스타일 추가
    fontFamily: 'SBAggroL',
    fontSize: globalLanguage !== 'ko' ? 14 : 18, 
    color: '#000000',
  },
});



export default RecommendScreen;
