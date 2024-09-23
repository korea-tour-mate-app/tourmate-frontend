import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View,TouchableOpacity,Text, ScrollView, Dimensions, Image, Alert, Platform, Linking } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useLanguage} from '../../components/LanguageProvider';
import {translateText} from '../../utils/Translation';

// 위치 및 장소 타입 정의
interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Place {
  tag: string;
  placeId: number;
  placeName: string;
  latitude: number;
  longitude: number;
}

interface PlaceDetail{
  placeId: number;
  themeId: number;
  테마이름: string;
  위도: number;
  경도: number;
  장소명: string;
  주소명: string;
  이미지: string | null; 
  이미지2: string | null; 
  이미지3: string | null; 
  영업시간: string | null; 
  '홈페이지 URL': string | null;
  설명: string | null; 
  평점: number | null;
  리뷰수: number | null;
  가격: number | null;
  '비건 유형': string | null; 
  '음식 종류': string | null; 
  '방문 유형': string | null; 
  '실내외 유형': string | null; 
  '카페 유형': string | null; 
  입장료: string | null; 
  '체크인 시간': string | null; 
  '체크 아웃 시간': string | null;
  숙박료: string | null;
  '영업 시작 시간': string | null; 
  '영업 종료 시간': string | null;
  휴무일: string | null; 
  '관람 시간': string | null;
  비고: string | null; 
  '이용 방법': string | null;
  '수영장 유무': boolean | null;
  가격대: string | null; 
  '관련 링크': string | null;
  '총 별점': number | null; 
}

interface Baggage {
  parentName: string;
  baggageStorageId: number;
  lineNumber: number;
  longitude: number;
  latitude: number;
}

interface BaggageDetail{
  lockerName: string;
  lockerDetail: string;
  smallCount: number;
  mediumCount: number;
  largeCount: number;
  controllerCount: number;
  columnCount: number;
}

function ThemeScreen() {
  const [location, setLocation] = useState<LocationType | undefined>();
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>(undefined); // 초기 위치를 undefined로 설정
  const [region, setRegion] = useState<Region | undefined>(undefined); // 지역 상태 추가


  // 필터 상태
  const [activeFilter, setActiveFilter] = useState<string>('전체');
  const [places, setPlaces] = useState<Place[]>([]); // 장소 데이터 상태 관리
  const [visitedFilterActive, setVisitedFilterActive] = useState(false);
  const [likesFilterActive, setLikesFilterActive] = useState(false);
  const [baggageFilterActive, setBaggageFilterActive] = useState(false);
  // 마커 상태
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedBaggage, setSelectedBaggage] = useState<Baggage | null>(null);
  const [isVisitedActive, setIsVisitedActive] = useState(false);
  const [isLikesActive, setIsLikesActive] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(-1);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const {language: globalLanguage} = useLanguage(); // 현재 언어 상태 가져오기
  // Place 관련 상태
  const [placeNames, setPlaceNames] = useState([]);
  const [placeIds, setPlaceIds] = useState([]);
  const [placeLatitudes, setPlaceLatitudes] = useState([]);
  const [placeLongitudes, setPlaceLongitudes] = useState([]);
  // Place Detail 관련 상태
  const [placeDetail, setPlaceDetail] = useState<PlaceDetail | null>(null);
  // Baggage Data 관련 상태
  const [isBaggageDataFetched, setIsBaggageDataFetched] = useState(false);
  const [baggageData, setBaggageData] = useState<Baggage[]>([]);
  const [parentNames, setParentNames] = useState([]);
  const [baggageStorageIds, setBaggageStorageIds] = useState([]);
  const [lineNumbers, setLineNumbers] = useState([]);
  const [longitudes, setLongitudes] = useState([]);
  const [latitudes, setLatitudes] = useState([]);
  // Baggage Detail 관련 상태
  const [baggageDetail, setBaggageDetail] = useState<BaggageDetail[]>([]);

  // 필터 단어 목록
  const filters = [
    '전체',
    'k-pop',
    '쇼핑',
    '템플스테이',
    '캠핑',
    '온천/스파',
    '공방 여행',
    '역사',
    '레저 스포츠',
    '문화시설',
    '테마시설',
    '호캉스',
    '카페',
    '식도락',
  ];

  // 번역된 필터 상태 관리
  const [translatedFilters, setTranslatedFilters] = useState<string[]>(filters);

  useEffect(() => {
    const fetchAndTranslateData = async () => {
      try {
        const permissionStatus = await request(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );
  
        if (permissionStatus !== RESULTS.GRANTED) {
          setErrorMessage('위치 권한이 거부되었습니다.');
          return;
        }
  
        Geolocation.getCurrentPosition(
          position => {
            const userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.004,
              longitudeDelta: 0.004,
            };
            setLocation(userLocation);
            setInitialRegion(userLocation); // 초기 위치 설정
            setInitialLocationSet(true);
          },
          error => {
            console.error(error);
            setErrorMessage('위치를 가져오는 데 실패했습니다.');
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('데이터를 가져오는 데 실패했습니다.');
      }
    };
  
    fetchAndTranslateData();
  }, [globalLanguage]);

  const [filteredPlaces, setFilteredPlaces] = useState(places);

  const handleFilterPress = async (filter: string) => {
    setActiveFilter(filter);
    setFilteredPlaces(
      filter === '전체' ? places : places.filter(place => place.tag === filter),
    );
  
    try {
      let url = 'http://13.125.53.226:8080/api/themes';
      if (filter !== '전체') {
        url += `/${filter.toLowerCase()}/places`; // 필터 값에 따른 API 호출
      } else {
        url += `/places`; // '전체' 선택 시 모든 장소 조회
      }
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
      console.log(result);
  
      if (response.ok) {
        const placesData = result.places; // places 배열에 접근

        // 각각의 값들을 배열로 분리해서 상태로 저장
        const placeNames = placesData.map((item: any) => item.placeName);
        const placeIds = placesData.map((item: any) => item.placeId);
        const longs = placesData.map((item: any) => item.longitude);
        const lats = placesData.map((item: any) => item.latitude);

        setPlaceNames(placeNames);
        setPlaceIds(placeIds);
        setPlaceLongitudes(longs);
        setPlaceLatitudes(lats);

        setFilteredPlaces(placesData); // 모든 장소로 업데이트
      }
    } catch (error) {
      console.error('데이터 요청 실패:', error); // 에러 로그 출력
    }
  };
  
  

  const handleBaggageFilterPress = async () => {
    setBaggageFilterActive(prevState => !prevState);
    if (isBaggageDataFetched == true) {
      return;
    }
    try {
      const response = await fetch(
        'http://13.125.53.226:8080/api/baggage/all-grouped',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();
      if (response.ok) {
        // 응답 데이터를 상태로 저장
        setBaggageData(result);

        // 각각의 값들을 배열로 분리해서 상태로 저장
        const parents = result.map((item: any) => item.parentName);
        const storageIds = result.map((item: any) => item.baggageStorageId);
        const lines = result.map((item: any) => item.lineNumber);
        const longs = result.map((item: any) => item.longitude);
        const lats = result.map((item: any) => item.latitude);

        setParentNames(parents);
        setBaggageStorageIds(storageIds);
        setLineNumbers(lines);
        setLongitudes(longs);
        setLatitudes(lats);

        setIsBaggageDataFetched(true);
      } else {
        Alert.alert(
          'Fail to get Data',
          result.message || 'Contact to developers.',
        );
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Fail to connect', '서버에 연결할 수 없습니다.');
    }
  };

  const handlePlaceMarkerPress = async (place: Place) => {
    setSelectedPlace(place);
    const placeId = place.placeId;
    console.log(placeId);
    try{
      const response = await fetch(
        `http://13.125.53.226:8080/api/themes/place/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const result = await response.json();
      console.log(result);
      if (response.ok){
        setPlaceDetail({
          placeId: result.placeId,
          themeId: result.themeId,
          테마이름: result.테마이름,
          위도: result.위도,
          경도: result.경도,
          장소명: result.장소명,
          주소명: result.주소명,
          이미지: result['이미지'] || null,
          이미지2: result['이미지2'] || null,
          이미지3: result['이미지3'] || null,
          '영업시간': result['영업시간'] || null,
          '홈페이지 URL': result['홈페이지 URL'] || null,
          설명: result['설명'] || null,
          평점: result['평점'] || null,
          리뷰수: result['리뷰수'] || null,
          가격: result['가격'] || null,
          '비건 유형': result['비건 유형'] || null,
          '음식 종류': result['음식 종류'] || null,
          '방문 유형': result['방문 유형'] || null,
          '실내외 유형': result['실내외 유형'] || null,
          '카페 유형': result['카페 유형'] || null,
          입장료: result['입장료'] || null,
          '체크인 시간': result['체크인 시간'] || null,
          '체크 아웃 시간': result['체크 아웃 시간'] || null,
          숙박료: result['숙박료'] || null,
          '영업 시작 시간': result['영업 시작 시간'] || null,
          '영업 종료 시간': result['영업 종료 시간'] || null,
          휴무일: result['휴무일'] || null,
          '관람 시간': result['관람 시간'] || null,
          비고: result['비고'] || null,
          '이용 방법': result['이용 방법'] || null,
          '수영장 유무': result['수영장 유무'] || null,
          가격대: result['가격대'] || null,
          '관련 링크': result['관련 링크'] || null,
          '총 별점': result['총 별점'] || null, 
        });
        console.log("place: ",placeDetail);
      }
      else{
        console.error('응답 오류:', result);
      }
    }catch (error) {
      console.error('데이터 요청 실패:', error);
    }
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleBaggageMarkerPress = async (item: Baggage) => {
    setSelectedBaggage(item);
    const stationName = item.parentName;
    console.log(stationName);
    try {
      const response = await fetch(
        `http://13.125.53.226:8080/api/baggage/station/${stationName}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      const result = await response.json();
      if (response.ok) {
        setBaggageDetail(result);  // 상태를 배열로 저장
      }
       else {
        console.error('응답 오류:', result);
      }
    } catch (error) {
      console.error('데이터 요청 실패:', error);
    }
  
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
      {/* {initialRegion && ( */}
        <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: initialRegion?.latitude ?? 37.5492,
          longitude: initialRegion?.longitude ?? 126.9654, 
          latitudeDelta: initialRegion?.latitudeDelta ?? 0.005,
          longitudeDelta: initialRegion?.longitudeDelta ?? 0.005,
          }}
        region={region} 
        showsUserLocation={true}>
            {filteredPlaces.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
            latitude: place.latitude,
            longitude: place.longitude,
          }}
          onPress={() => {handlePlaceMarkerPress(place)}}
        >
           <View style={styles.markerContainer}>
            <Image
              source={require('../../assets/images/map/theme-marker.png')}
              style={styles.themeMarker}
            />
          </View>
          <Text style={styles.markerPlace}>{place.placeName}</Text>
        </Marker>
       ))}

          {/* baggageData 마커 */}
          {baggageFilterActive == true &&
            baggageData.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                onPress={() => handleBaggageMarkerPress(item)}>
                <View style={styles.markerContainer}>
                  <Image
                    source={require('../../assets/images/map/baggages-marker.png')}
                    style={styles.themeMarker}
                  />
                </View>
                <Text style={styles.markerPlace}>{item.parentName}</Text>
              </Marker>
            ))}
        </MapView>
      

      {errorMessage && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.filterScrollView}
          showsHorizontalScrollIndicator={false}>
          {translatedFilters.map((filter, index) => (
            <TouchableOpacity
              key={filters[index]} // 원래 필터 단어로 key 설정
              style={[
                styles.filterButton,
                activeFilter === filters[index] && styles.activeFilterButton,
              ]}
              onPress={() => handleFilterPress(filters[index])} // 선택한 필터는 원래 단어로 처리
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filters[index] && styles.activeFilterText,
                ]}>
                {filter} {/* 번역된 필터 단어를 표시 */}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
      <TouchableOpacity
  style={[
    styles.buttonVisited,
    visitedFilterActive && {backgroundColor: '#02BC7D'},
  ]}
  onPress={() => setVisitedFilterActive(prevState => !prevState)}
>
  <Text
    style={[
      styles.buttonText,
      visitedFilterActive && {color: '#FFFFFF'},
    ]}
  >
    Visited
  </Text>
  
  <Image
    source={
      visitedFilterActive
        ? require('../../assets/images/map/visited-filter.png')
        : require('../../assets/images/map/visited-active.png')
       }
         style={styles.buttonIcon}
         />
        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.buttonLikes,
            likesFilterActive && {backgroundColor: '#FF344C'},
          ]}
          onPress={() => setLikesFilterActive(prevState => !prevState)}>
          <Text
            style={[
              styles.buttonText,
              likesFilterActive && {color: '#FFFFFF'},
            ]}>
            Likes
          </Text>
          <Image
          source={
          likesFilterActive
            ? require('../../assets/images/map/likes-filter.png')
            : require('../../assets/images/map/likes-active.png')        
          }
          style={styles.buttonIcon}
        />                        
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonLikes,
            baggageFilterActive && {backgroundColor: '#0047A0'},
          ]}
          onPress={handleBaggageFilterPress}>
          <Text
            style={[
              styles.buttonText,
              baggageFilterActive && {color: '#FFFFFF'},
            ]}>
            Baggage
          </Text>
          <Image
          source={
            baggageFilterActive
            ? require('../../assets/images/map/baggage-filter.png')
            : require('../../assets/images/map/baggage-active.png')        
          }
          style={styles.buttonIcon}
          />             
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['30%', '80%']}
        enablePanDownToClose={true}
        onChange={handleBottomSheetChange}>
        {/* selectedPlace 관련 렌더링 */}
        {selectedPlace && placeDetail && (
  <View style={styles.bottomSheetContainer}>
    {/* Collapsed 상태일 때 */}
    {bottomSheetIndex === 0 && (
      <>
        <View style={styles.bottomSheetTitleContainerCollapsed}>
          <Text style={styles.bottomSheetTitleCollapsed}>
            {placeDetail.장소명}
          </Text>
          <View style={styles.bottomSheetButtonContainer}>
            <TouchableOpacity
              style={styles.bottomSheetButton}
              onPress={handleVisitedPress}>
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
              style={styles.bottomSheetButton}
              onPress={handleLikesPress}>
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
            <Text style={styles.bottomSheetAddress}>
              {placeDetail.주소명}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSheetDescriptionContainer}>
        {placeDetail.이미지 ? (
  <Image
    source={{ uri: placeDetail.이미지 }}
    style={styles.bottomSheetImageContainerCollapsed}
  />
) : (
  <Text>No images</Text>
)}
        </View>
      </>
    )}

    {/* Expanded 상태일 때 */}
    {bottomSheetIndex === 1 && (
       <ScrollView>
       <View style={styles.bottomSheetTitleContainerExpand}>
         <Text style={styles.bottomSheetTitleExpand}>
           {placeDetail.장소명}
         </Text>
       </View>

       {/* 주소, 영업시간 등 null 값을 체크하고 렌더링 */}
       <View style={styles.bottomSheetListContainer}>
         {placeDetail.주소명 && (
           <>
             <Text style={styles.bottomSheetListAddressTitle}>주소</Text>
             <Text style={styles.bottomSheetListContent}>
               {placeDetail.주소명}
             </Text>
           </>
         )}
         
         {placeDetail['홈페이지 URL'] && (
  <>
    <Text style={styles.bottomSheetListHomepageTitle}>홈페이지</Text>
    <TouchableOpacity onPress={() => placeDetail['홈페이지 URL'] && Linking.openURL(placeDetail['홈페이지 URL'])}>
  <Text style={[styles.bottomSheetListHomepage, { color: 'blue', textDecorationLine: 'underline' }]}>
    {placeDetail['홈페이지 URL'] || '홈페이지 없음'}
  </Text>
</TouchableOpacity>

  </>
)}

         {placeDetail.설명 && (
           <>
             <Text style={styles.bottomSheetListTitle}>설명</Text>
             <Text style={styles.bottomSheetListContent}>
               {placeDetail.설명}
             </Text>
           </>
         )}


          {placeDetail.영업시간 && (
           <>
             <Text style={styles.bottomSheetListTitle}>이용시간</Text>
             <Text style={styles.bottomSheetListContent}>
               {placeDetail.영업시간}
             </Text>
           </>
         )}

        {placeDetail['평점'] !== undefined && (
           <>
             <Text style={styles.bottomSheetListTitle}>별점</Text>
             <Text style={styles.bottomSheetListContent}>
               {placeDetail['평점']}
             </Text>
           </>
         )}

         {/* 다른 필드들도 동일한 방식으로 처리 */}
         {placeDetail.비고 && (
           <>
             <Text style={styles.bottomSheetListTitle}>비고</Text>
             <Text style={styles.bottomSheetListContent}>
               {placeDetail.비고}
             </Text>
           </>
         )}

       </View>
     </ScrollView>
   )}
 </View>
)}


        {/* selectedBaggage 관련 렌더링 */}
        {selectedBaggage && (
          <View style={styles.bottomSheetContainer}>
            {(
              <>
                <View>
  {baggageDetail.length > 0 && baggageDetail.map((item, index) => (
    <ScrollView>
    <View key={index}>
      <Text style={styles.baggagePlace}>{item.lockerName}</Text>
      <Text style={styles.baggageDetail}>위치: {item.lockerDetail}</Text>
      <Text style={styles.baggageDetail}>소형 칸 개수: {item.smallCount}</Text>
      <Text style={styles.baggageDetail}>중형 칸 개수: {item.mediumCount}</Text>
      <Text style={styles.baggageDetail}>대형 칸 개수: {item.largeCount}</Text>
      <Text></Text>
    </View>
    </ScrollView>
  ))}
</View>

              </>
            )}
          </View>
        )}
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

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
  buttonLikes: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
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
  bottomSheetButton: {},
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
  bottomSheetListTitle: {
    fontFamily: 'SBAggroM',
    fontSize: 20,
    marginTop: 20,
  },
  bottomSheetListContent: {
    fontFamily: 'SBAggroL',
    fontSize: 18,
    marginTop: 10,
  },
  baggagePlace:{
    fontSize: 20,
  },
  baggageDetail:{
    fontSize: 16,
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
