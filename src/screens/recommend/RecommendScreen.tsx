import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/NavigationTypes'; 
import { useLanguage } from '../../components/LanguageProvider'; 
import { translateText } from '../../utils/Translation'; 

interface Theme {
  label: string;
  subLabel?: string;
  backgroundColor: string;
  textColor: string;
  image: any; 
}

type Themes = {
  [key: string]: Theme;
};

type RecommendScreenNavigationProp = {
  navigate: (screen: keyof RootStackParamList) => void;
};

const RecommendScreen: React.FC = () => {
  const navigation = useNavigation<RecommendScreenNavigationProp>();
  const { language: globalLanguage } = useLanguage();

  const [question, setQuestion] = useState<string>('서울에서 어떤 여행 테마를 원하나요?');
  const [content, setContent] = useState<string>('원하는 테마를 모두 골라주세요.');
  const [next, setNext] = useState<string>('다음');

  const [themes, setThemes] = useState<Themes>({
    // 테마 설정 ...
  });

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

  const handleNext = () => {
    navigation.navigate('DayScreen'); // 또는 다른 탭 화면으로 이동
  };

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
    marginBottom: 10,
  },
  nextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    width: 200,
    height: 50,
    backgroundColor: '#0047A0',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: {
    fontFamily: 'AggroL',
    fontSize: 20,
    color: 'white',
  },
});

export default RecommendScreen;
