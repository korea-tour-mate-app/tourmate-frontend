import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, FlatList } from 'react-native';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList, RootStackNavigationProp } from '../navigation/navigationTypes';
import { useLanguage } from '../../components/LanguageProvider';
import { translateText } from '../../utils/Translation';
import { useSelection } from '../../components/SelectionContext';

type WithWhoScreenNavigationProp = RootStackNavigationProp<'WithWhoScreen'>;
type WithWhoScreenRouteProp = RouteProp<RootStackParamList, 'WithWhoScreen'>;

interface WithWhoScreenProps {
  route: WithWhoScreenRouteProp;
}

const WithWhoScreen: React.FC<WithWhoScreenProps> = ({ route }) => {
  const navigation = useNavigation<WithWhoScreenNavigationProp>();
  const { language: globalLanguage } = useLanguage();
  const { selectedWithWho, setSelectedWithWho } = useSelection();  
  const dynamicStyles = getDynamicStyles(globalLanguage);

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const [labels, setLabels] = useState({
    question: '누구와 여행을 떠나시나요?',
    parent: '부모/조부모/형제자매',
    spouse: '배우자',
    friend: '친구/동료',
    children: '자녀',
    couple: '연인',
    group: '친목 단체/모임',
    next: '다음',
  });

  const data = [
    { id: 0, image: require('../../assets/images/themeIcon/who_parent.png'), label: labels.parent.split('/') },
    { id: 1, image: require('../../assets/images/themeIcon/who_spouse.png'), label: [labels.spouse] },
    { id: 2, image: require('../../assets/images/themeIcon/who_friend.png'), label: labels.friend.split('/') },
    { id: 3, image: require('../../assets/images/themeIcon/who_daughter.png'), label: [labels.children] },
    { id: 4, image: require('../../assets/images/themeIcon/who_couple.png'), label: [labels.couple] },
    { id: 5, image: require('../../assets/images/themeIcon/who_group.png'), label: [labels.group] },
  ];

  useEffect(() => {
    const translateTexts = async () => {
      try {
        const translatedLabels = {
          question: await translateText('누구와 여행을 떠나시나요?', globalLanguage),
          parent: await translateText('부모/조부모/형제자매', globalLanguage),
          spouse: await translateText('배우자', globalLanguage),
          friend: await translateText('친구/동료', globalLanguage),
          children: await translateText('자녀', globalLanguage),
          couple: await translateText('연인', globalLanguage),
          group: await translateText('친목단체', globalLanguage),
          next: await translateText('다음', globalLanguage),
        };
        setLabels(translatedLabels);
      } catch (error) {
        console.error('Translation Error:', error);
      }
    };

    translateTexts();
  }, [globalLanguage]);

  const handleSelect = (id: number) => {
    const newSelectedOptions = selectedOptions.includes(id)
      ? selectedOptions.filter(opt => opt !== id)
      : [...selectedOptions, id];

    setSelectedOptions(newSelectedOptions);
    setSelectedWithWho(newSelectedOptions);
  };

  const handleNext = () => {
    if (selectedOptions.length > 0) {
      navigation.navigate('VehicleScreen');
    } else {
      Alert.alert('오류', '여행 인원을 선택해주세요.');
    }
  };

  const renderItem = ({ item }: { item: typeof data[0] }) => (
    <TouchableOpacity
      style={[
        styles.card,
        selectedOptions.includes(item.id) && styles.selectedCard,
      ]}
      onPress={() => handleSelect(item.id)}
    >
      <Image source={item.image} style={styles.icon} />
      {item.label.map((line, index) => (
        <Text
          key={index}
          style={[
            dynamicStyles.label,
            selectedOptions.includes(item.id) && styles.selectedLabel,
            { textAlign: 'center', marginVertical: -7 },
          ]}
        >
          {line}
        </Text>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={require('../../assets/images/back-button.png')} style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.question}>Q3.</Text>
      <Text style={styles.question}>{labels.question}</Text>

      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.cardContainer}
      />

      <Text style={styles.caption}>*사진출처 Microsoft Fluent Emoji – Color</Text>

      <TouchableOpacity
        style={[
          styles.nextButton,
          { backgroundColor: selectedOptions.length > 0 ? '#0047A0' : '#D3D3D3' }
        ]}
        onPress={handleNext}
        disabled={selectedOptions.length === 0}
      >
        <Text style={styles.nextText}>{labels.next}</Text>
      </TouchableOpacity>
    </View>
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
    fontFamily: 'SBAggroM',
    fontSize: 24,
    color: '#000000',
  },
  cardContainer: {
    justifyContent: 'space-between',
    marginTop: 20,
  },
  card: {
    width: 150,
    height: 150,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  selectedCard: {
    backgroundColor: '#0047A0',
  },
  icon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
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
    fontFamily: 'SBAggroL',
    fontSize: 18,
    color: 'white',
  },
  caption: {
    textAlign: 'left',
    color: '#888',
    fontSize: 12,
    fontFamily: 'SBAggroL',
    marginBottom: 40,
    marginLeft: 15,
  },
});

const getDynamicStyles = (globalLanguage: string) =>
  StyleSheet.create({
    label: {
      marginTop: 10,
      fontFamily: 'SBAggroL',
      fontSize: globalLanguage !== 'ko' ? 14 : 18,
      color: '#000000',
    },
  });

export default WithWhoScreen;
