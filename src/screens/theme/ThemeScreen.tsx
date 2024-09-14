import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, Image, Alert, Platform } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions'; 

// 화면 높이 가져오기
const { height: screenHeight } = Dimensions.get('window');

// 위치 및 장소 타입 정의
interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Place {
  id: number;
  name: string;
  tag: string;
  description: string;
  address: string;
  homepage: string;
  contact: string;
  hour: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

function ThemeScreen() {
  const [location, setLocation] = useState<LocationType | undefined>();
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [visitedFilterActive, setVisitedFilterActive] = useState(false);
  const [likesFilterActive, setLikesFilterActive] = useState(false);
  const [baggageFilterActive, setBaggageFilterActive] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isVisitedActive, setIsVisitedActive] = useState(false);
  const [isLikesActive, setIsLikesActive] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(-1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // 더미 장소 데이터
  const places: Place[] = [
    { id: 1, name: '월드케이팝센터', tag: 'K-POP', description: '케이팝 문화와 관련된 다양한 경험을 제공하는 공간', address: '서울특별시 중구 장충단로 72 (장충동2가, 한국자유총연맹)', homepage: 'https://w-kpop.com/', contact:'02-2232-7399', hour: '09:00 ~ 20:00', coordinate: { latitude: 37.5580, longitude: 127.0065 } },
    { id: 2, name: 'HEMA studio', tag: 'K-POP', description: '전문적인 케이팝 녹음 스튜디오', address: '서울특별시 강남구 학동로3길 27 (논현동, 메리디엠타워) 지하1층', homepage: 'https://hemastudio.com/', contact:'070-7504-1415', hour: '10:00 ~ 22:00', coordinate: { latitude: 37.5149, longitude: 127.0318 } },
    { id: 3, name: '광야@서울', tag: 'K-POP', description: '케이팝 팬들을 위한 체험형 공간', address: '서울특별시 성동구 왕십리로 83-21 (성수동1가, 아크로 서울포레스트) B1F', homepage: 'https://www.instagram.com/kwangya_seoul/?igshid=MzRlODBiNWFlZA%3D%3D/', contact:'02-6233-6729', hour: '10:30 ~ 20:00', coordinate: { latitude: 37.5446, longitude: 127.0435 } },
    { id: 4, name: 'REAL K-POP DANCE', tag: 'K-POP', description: '케이팝 댄스를 배울 수 있는 공간', address: '서울특별시 마포구 동교로 19길 48', homepage: 'https://www.realkpopdance.co', contact:'010-3445-2737', hour: '10:00 ~ 21:00', coordinate: { latitude: 37.5586, longitude: 126.9254 } },
    { id: 5, name: '한류스타 거리', tag: 'K-POP', description: '한류 스타들을 기념하는 거리', address: '서울특별시 강남구 압구정동 517', homepage: '', contact:'', hour: '24시간 영업', coordinate: { latitude: 37.5281, longitude: 127.0285 } },
    { id: 6, name: '이스타아카데미', tag: 'K-POP', description: '케이팝 관련 교육을 제공하는 아카데미', address: '서울특별시 양천구 오목로 321-1 (목동, 서경빌딩)', homepage: 'https://www.instagram.com/estar_academy/?hl=en', contact:'', hour: '11:00 ~ 22:00', coordinate: { latitude: 37.5260, longitude: 126.8720 } },
    { id: 7, name: '라인프렌즈 홍대 플래그십스토어', tag: 'K-POP', description: '라인 캐릭터 상품을 구매할 수 있는 플래그십 스토어', address: '서울특별시 마포구 양화로 141', homepage: 'https://brand.naver.com/linefriends', contact:'02-322-9631', hour: '11:00 ~ 22:00', coordinate: { latitude: 37.5565, longitude: 126.9236 } },
  ];
  

  useEffect(() => {
    const getLocation = async () => {
      // 위치 권한 요청 및 확인
      const permissionStatus = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      if (permissionStatus !== RESULTS.GRANTED) {
        setErrorMessage('위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.');
        Alert.alert('위치 권한 오류', '위치 권한이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.');
        return;
      }

      Geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          setInitialLocationSet(true);
        },
        (error) => {
          console.error(error);
          setErrorMessage('위치를 가져오는 데 실패했습니다. 네트워크 상태를 확인해주세요.');
          Alert.alert('위치 오류', '위치를 가져오는 데 실패했습니다. 네트워크 상태를 확인해주세요.');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    };

    getLocation();
  }, []);


  const [filteredPlaces, setFilteredPlaces] = useState(places);

  const handleFilterPress = (filter: string) => {
    setActiveFilter(filter);
    setFilteredPlaces(
      filter === '모두' ? places : places.filter(place => place.tag === filter)
    );
  };

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    bottomSheetRef.current?.snapToIndex(0); 
  };

  const handleVisitedPress = () => {
    setIsVisitedActive(prevState => !prevState); 
  };

  const handleLikesPress = () => {
    setIsLikesActive(prevState => !prevState); 
  };

  const handleBottomSheetChange = useCallback((index: number) => {
    setBottomSheetIndex(index);
    if (index === -1) {
      setSelectedPlace(null);
    }
  }, []);

  
  return (
    <GestureHandlerRootView style={styles.container}>
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={initialLocationSet ? location : undefined}
          showsUserLocation={true}
        >
          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              coordinate={place.coordinate}
              onPress={() => handleMarkerPress(place)}
              
            >
              <View style={styles.markerContainer}>
                <Image source={require('../../assets/images/map/theme-marker.png')} style={styles.themeMarker}/>
              </View>
              <Text style={styles.markerPlace}>{place.name}</Text>
            </Marker>
          ))}
        </MapView>
      )}

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.filterScrollView}
          showsHorizontalScrollIndicator={false}
        >
          {['모두', 'K-POP', '고궁', '템플스테이', '식도락', '레저스포츠', '등산코스', '테마시설', '문화시설', '호캉스', '카페', '공방'].map(filter => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, activeFilter === filter && styles.activeFilterButton]}
              onPress={() => handleFilterPress(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.buttonVisited, visitedFilterActive && { backgroundColor: '#e0e0e0' }]} 
          onPress={() => setVisitedFilterActive(prevState => !prevState)}
        >
          <Text style={styles.buttonText}>Visited</Text>
          <Image source={require('../../assets/images/map/visited-active.png')} style={styles.buttonVisitedIcon}/>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonLikes, likesFilterActive && { backgroundColor: '#e0e0e0' }]} 
          onPress={() => setLikesFilterActive(prevState => !prevState)}
        >
          <Text style={styles.buttonText}>Likes</Text>
          <Image source={require('../../assets/images/map/likes-active.png')} style={styles.buttonLikesIcon}/> 
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buttonLikes, baggageFilterActive && { backgroundColor: '#e0e0e0' }]} 
          onPress={() => setBaggageFilterActive(prevState => !prevState)}
        >
          <Text style={styles.buttonText}>Baggage</Text>
          <Image source={require('../../assets/images/map/baggage-button.png')} style={styles.buttonLikesIcon}/> 
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['30%', '80%']}
        enablePanDownToClose={true}
        onChange={handleBottomSheetChange}
      >
        {selectedPlace && (
          <View style={styles.bottomSheetContainer}>
            {bottomSheetIndex === 0 && (
              <>
                <View style={styles.bottomSheetTitleContainerCollapsed}>
                  <Text style={styles.bottomSheetTitleCollapsed}>
                    {selectedPlace.name}
                  </Text>
                  <View style={styles.bottomSheetButtonContainer}>
                    <TouchableOpacity style={styles.bottomSheetButton} onPress={handleVisitedPress}>
                      <Image
                        source={
                          isVisitedActive 
                            ? require('../../assets/images/map/visited-active.png') 
                            : require('../../assets/images/map/visited-inactive.png') 
                        }
                        style={styles.bottomSheetVisitedButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomSheetButton} onPress={handleLikesPress}>
                      <Image
                        source={
                          isLikesActive 
                            ? require('../../assets/images/map/likes-active.png') 
                            : require('../../assets/images/map/likes-inactive.png') 
                        }
                        style={styles.bottomSheetLikesButton}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.bottomSheetAddressContainerCollapsed}>
                    <Text style={styles.bottomSheetAddress}>{selectedPlace.address}</Text>
                  </View>
                </View>

                <View style={styles.bottomSheetDescriptionContainer}>
                  <Image source={require('../../assets/images/map/example-image.png')} style={styles.bottomSheetImageContainerCollapsed}/>
                  <Text style={styles.bottomSheetDescription}>{selectedPlace.description}</Text>
                </View>
              </>
            )}
            {bottomSheetIndex === 1 && (
              <ScrollView>
                <View style={styles.bottomSheetTitleContainerExpand}>
                  <Text style={styles.bottomSheetTitleExpand}>{selectedPlace.name}</Text>
                  <View style={styles.bottomSheetButtonContainer}>
                    <TouchableOpacity
                      style={[styles.bottomSheetButton, isVisitedActive && { backgroundColor: '#e0e0e0' }]}
                      onPress={handleVisitedPress}
                    >
                      <Image
                        source={
                          isVisitedActive
                            ? require('../../assets/images/map/visited-active.png')
                            : require('../../assets/images/map/visited-inactive.png')
                        }
                        style={styles.bottomSheetVisitedButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.bottomSheetButton, isLikesActive && { backgroundColor: '#e0e0e0' }]}
                      onPress={handleLikesPress}
                    >
                      <Image
                        source={
                          isLikesActive
                            ? require('../../assets/images/map/likes-active.png')
                            : require('../../assets/images/map/likes-inactive.png')
                        }
                        style={styles.bottomSheetLikesButton}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.bottomSheetAddressContainerExpand}>
                  <Text style={styles.bottomSheetAddress}>{selectedPlace.address}</Text>
                </View>
                <Image source={require('../../assets/images/map/example-image.png')} style={styles.bottomSheetImageContainerExpand}/>
                <View style={styles.bottomSheetListContainer}>
                  <Text style={styles.bottomSheetListAddressTitle}>주소</Text>
                  <Text style={styles.bottomSheetListAddress}>{selectedPlace.address}</Text>
                  <Text style={styles.bottomSheetListHomepageTitle}>홈페이지</Text>
                  <Text style={styles.bottomSheetListHomepage}>{selectedPlace.homepage}</Text>
                  <Text style={styles.bottomSheetListContactTitle}>연락처</Text>
                  <Text style={styles.bottomSheetListContact}>{selectedPlace.contact}</Text>
                  <Text style={styles.bottomSheetListHourTitle}>이용시간</Text>
                  <Text style={styles.bottomSheetListHour}>{selectedPlace.hour}</Text>
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </BottomSheet>
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerPlace: {
    fontFamily: 'SBAggroL',
    fontSize: 18,
  },
  themeMarker: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  filterContainer: {
    position: 'absolute',
    top: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  filterScrollView: {
    maxHeight: 60,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterButton: {
    borderBottomColor: '#0047A0',
  },
  filterText: {
    color: 'black',
    fontSize: 17,
  },
  activeFilterText: {
    color: '#0047A0',
    fontFamily: 'SBAggroM',
    fontSize: 16,
  },
  buttonContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  buttonVisited: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonVisitedIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  buttonLikes: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonLikesIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'SBAggroL',
  },
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  bottomSheetTitleContainerCollapsed: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  bottomSheetTitleContainerExpand: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  bottomSheetTitleCollapsed: {
    fontFamily: 'SBAggroM',
    fontSize: 24,
    marginLeft: 10,
  },
  bottomSheetTitleExpand: {
    fontFamily: 'SBAggroL',
    fontSize: 30,
  },
  bottomSheetButtonContainer: {
    flexDirection: 'row',
  },
  bottomSheetButton: {
  },
  bottomSheetVisitedButton: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
  bottomSheetLikesButton: {
    width: 25,
    height: 25,
    resizeMode: 'cover',
    marginHorizontal: 5,
  },
  bottomSheetAddressContainerCollapsed: {
    width: 150,
    marginLeft: 30,
  },
  bottomSheetAddressContainerExpand: {
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  bottomSheetAddress: {
    fontFamily: 'SBAggroL',
    fontSize: 16,
    color: 'black',
  },
  bottomSheetDescriptionContainer: {
    flexDirection: 'row',
  },
  bottomSheetImageContainerCollapsed: {
    width: 130,
    height: 115,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 40,
  },
  bottomSheetImageContainerExpand: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginTop: 30,
  },
  bottomSheetDescription: {
    fontFamily: 'SBAggroL',
    fontSize: 16,
    color: 'black',
    marginTop: 10,
  },
  bottomSheetListContainer: {
    marginTop: 20,
    padding: 10,
  },
  bottomSheetListAddressTitle: {
    fontFamily: 'SBAggroM',
    fontSize: 20,
  },
  bottomSheetListAddress: {
    fontFamily: 'SBAggroL',
    fontSize: 20,
    marginTop: 20,
  },
  bottomSheetListHomepageTitle: {
    fontFamily: 'SBAggroM',
    fontSize: 20,
    marginTop: 20,
  },
  bottomSheetListHomepage: {
    fontFamily: 'SBAggroL',
    fontSize: 20,
    marginTop: 20,
  },
  bottomSheetListContactTitle: {
    fontFamily: 'SBAggroM',
    fontSize: 20,
    marginTop: 20,
  },
  bottomSheetListContact: {
    fontFamily: 'SBAggroL',
    fontSize: 20,
    marginTop: 20,
  },
  bottomSheetListHourTitle: {
    fontFamily: 'SBAggroM',
    fontSize: 20,
    marginTop: 20,
  },
  bottomSheetListHour: {
    fontFamily: 'AggroL',
    fontSize: 20,
    marginTop: 20,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default ThemeScreen;