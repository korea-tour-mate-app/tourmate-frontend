import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useLanguage } from '../../components/LanguageProvider';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '../../components/BottomTabNavigator';

const LanguageScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const { setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: string) => {
    console.log('Changing language to:', newLang); 
    setLanguage(newLang); 
    navigation.navigate('MyPage', { language: newLang }); 
  };
  
  return (
    <>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={require('../../assets/images/back-button.png')} />
          </TouchableOpacity>

          <View style={styles.redLine}></View>
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={() => handleLanguageChange('en')}>
              <Text style={styles.menu}>English</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('ja')}>
              <Text style={styles.menu}>日本語</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2" 
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('zh-CN')}>
              <Text style={styles.menu}>汉语(简体)</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('zh-TW')}>
              <Text style={styles.menu}>漢語(繁體)</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('vi')}>
              <Text style={styles.menu}>tiếng Việt</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('th')}>
              <Text style={styles.menu}>ภาษาไทย</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('id')}>
              <Text style={styles.menu}>Bahasa Indonésia</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('fr')}>
              <Text style={styles.menu}>la langue française</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>
            
            <TouchableOpacity onPress={() => handleLanguageChange('es')}>
              <Text style={styles.menu}>castellano</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('ru')}>
              <Text style={styles.menu}>Русский</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('de')}>
              <Text style={styles.menu}>Deutsch</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('it')}>
              <Text style={styles.menu}>la lingua italiana</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <TouchableOpacity onPress={() => handleLanguageChange('ko')}>
              <Text style={styles.menu}>한국어</Text>
            </TouchableOpacity>

            <View style={styles.dottedLineContainer}>
              <Svg height="2" width="75%">
                <Line
                  x1="0"
                  y1="1"
                  x2="100%"
                  y2="1"
                  stroke="black"
                  strokeWidth="2"
                  strokeDasharray="5,2"
                />
              </Svg>
            </View>

            <View style={styles.blueLine}></View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  backButton: {
    marginLeft: 20,
  },
  redLine: {
    marginTop: 20,
    marginBottom: 30,
    height: 25,
    width: '100%',
    backgroundColor: '#CD2E3A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', 
  },
  menuContainer: {
    flex: 1,
  },
  menu: {
    fontSize: 20,
    fontFamily: 'AggroL',
    marginLeft: 50,
  },
  dottedLineContainer: {
    width: '100%',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  blueLine: {
    marginTop: 20,
    height: 25,
    width: '100%',
    backgroundColor: '#0047A0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', 
  },
});

export default LanguageScreen;
