import React, {useEffect, useState, useCallback} from 'react';
import { StyleSheet, View,TouchableOpacity,Text, ScrollView, Dimensions, Image, Alert, Platform, Linking } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import BottomSheet from '@gorhom/bottom-sheet';
import {GestureHandlerRootView, HoverEffect} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {useLanguage} from '../../components/LanguageProvider';
import {translateText} from '../../utils/Translation';
import { TextInput } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary, ImagePickerResponse, Asset } from 'react-native-image-picker';


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
  'visited': boolean | null, // 방문 여부 추가,
  'likes': boolean | null,
}

interface Visited{
  placeId: number;
  placeName: string;
  placeLocation: string;
  longitude: number;
  latitude: number;
}

interface Likes{
  placeId: number;
  placeName: string;
  placeLocation: string;
  longitude: number;
  latitude: number;
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

// ReviewResponseDto interface (리뷰 데이터의 인터페이스)
interface ReviewResponseDto {
  reviewId: number;
  reviewDec: string;
  rate: number;
  reviewUrl1?: string;
  reviewUrl2?: string;
  reviewUrl3?: string;
  isMyReview: boolean; // 내 리뷰 여부
}

function ThemeScreen() {
  const [location, setLocation] = useState<LocationType | undefined>();
  const [initialLocationSet, setInitialLocationSet] = useState(false);
  const [initialLatitude, setInitialLatitude] = useState<number | undefined>(undefined);
  const [initialLongitude, setInitialLogitude] = useState<number | undefined>(undefined);
  const [initialRegion, setInitialRegion] = useState<Region | undefined>(undefined); // 초기 위치를 undefined로 설정
  const [region, setRegion] = useState<Region | undefined>(undefined); // 지역 상태 추가 

  // 필터 상태
  const [activeFilter, setActiveFilter] = useState<string>('');
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
  const [placeNames, setPlaceNames] = useState<string[]>([]);
  const [placeIds, setPlaceIds] = useState([]);
  const [placeLatitudes, setPlaceLatitudes] = useState([]);
  const [placeLongitudes, setPlaceLongitudes] = useState([]);
  // Place Detail 관련 상태
  const [placeDetail, setPlaceDetail] = useState<PlaceDetail | null>(null);

  // Visited Data 관련 상태
  const [visitedData, setVisitedData] = useState<Visited[]>([]);
  const [visitedPlaceId, setVisitedPlaceId] = useState([]);
  const [visitedPlaceName, setVisitedPlaceName] = useState<string[]>([]);
  const [visitedPlaceLocation, setVisitedPlaceLocation] = useState([]);
  const [visitedLatitudes, setVisitedLatitudes] = useState([]);
  const [visitedLongitudes, setVisitedLongitudes] = useState([]);

  // Likes Data 관련 상태
  const [likesData, setLikesData] = useState<Likes[]>([]);
  const [likesPlaceId, setLikesPlaceId] = useState<string[] | null>(null);
  const [likesPlaceName, setLikesPlaceName] = useState<string[]>([]);
  const [likesPlaceLocation, setLikesPlaceLocation] = useState<string[] | null>(null);
  const [likesLongitudes, setLikesLongitudes] = useState<number[] | null>(null);
  const [likesLatitudes, setLikesLatitudes] = useState<number[] | null>(null);  

  // Baggage Data 관련 상태
  const [isBaggageDataFetched, setIsBaggageDataFetched] = useState(false);
  const [baggageData, setBaggageData] = useState<Baggage[]>([]);
  const [parentNames, setParentNames] = useState<string[]>([]);
  const [baggageStorageIds, setBaggageStorageIds] = useState([]);
  const [lineNumbers, setLineNumbers] = useState([]);
  const [longitudes, setLongitudes] = useState([]);
  const [latitudes, setLatitudes] = useState([]);
  // Baggage Detail 관련 상태
  const [baggageDetail, setBaggageDetail] = useState<BaggageDetail[]>([]);

  // Bottom Sheet 관련 상태
  const [address, setAddress] = useState<string>('주소');
  const [homepage, setHomepage] = useState<string>('홈페이지');
  const [info, setInfo] = useState<string>('설명');
  const [time, setTime] = useState<string>('이용시간');
  const [rating, setRating] = useState<string>('별점');
  
  // Review 관련 상태
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]); // 리뷰 데이터 상태
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false); // 리뷰 작성 모달 상태
  const [newReview, setNewReview] = useState(''); // 새 리뷰 내용
  const [newRating, setNewRating] = useState<number>(0); // 새 리뷰 평점
  const [reviewImages, setReviewImages] = useState<{ uri: string }[]>([]);
  const [isMyReview, setIsMyReview] = useState(false); // 내 리뷰 여부
  const [isVisited, setIsVisited] = useState(false); // 방문 여부

  // 번역된 텍스트를 저장할 상태
  const [translatedLabels, setTranslatedLabels] = useState({
    writeReview: '리뷰 작성',
    submitReview: '리뷰 등록',
    cancelReview: '취소',
    rating: '별점',
    selectImage: '이미지 선택',
    reviewPlaceholder: '리뷰 내용을 입력하세요',

  });
  useEffect(() => {
    const translateLabels = async () => {
      const translatedWriteReview = await translateText('리뷰 작성', globalLanguage);
      const translatedSubmitReview = await translateText('리뷰 등록', globalLanguage);
      const translatedCancelReview = await translateText('취소', globalLanguage);
      const translatedRating = await translateText('별점', globalLanguage);
      const translatedSelectImage = await translateText('이미지 선택', globalLanguage);
      const translatedReviewPlaceholder = await translateText('리뷰 내용을 입력하세요', globalLanguage);

      setTranslatedLabels({
        writeReview: translatedWriteReview,
        submitReview: translatedSubmitReview,
        cancelReview: translatedCancelReview,
        rating: translatedRating,
        selectImage: translatedSelectImage,
        reviewPlaceholder: translatedReviewPlaceholder,
      });
    };

    translateLabels();
  }, [globalLanguage]);

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
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
            
            setLocation(userLocation);
            setInitialLatitude(userLocation.latitude);
            setInitialLogitude(userLocation.longitude);
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

    const translateFilters = async () => {
      const translated = await Promise.all(
        filters.map(async (filter) => await translateText(filter,globalLanguage))
      );
      setTranslatedFilters(translated);
    };

    translateFilters();

    const translateContent = async () => {
      try {
        const translatedAddress = await translateText('주소', globalLanguage);
        setAddress(translatedAddress);

        const translatedHomepage = await translateText('홈페이지', globalLanguage);
        setHomepage(translatedHomepage);

        const translatedInfo= await translateText('설명', globalLanguage);
        setInfo(translatedInfo);

        const translatedTime = await translateText('이용시간', globalLanguage);
        setTime(translatedTime);

        const translatedRating = await translateText('별점', globalLanguage);
        setRating(translatedRating);


      } catch (error) {
        console.error('Translation Error:', error);
      }
    }
    translateContent();
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
        // '온천/스파' 필터에 대한 처리
        if (filter === '온천/스파') {
          url += '/온천 스파/places'; // 필터 값이 '온천/스파'일 때
        } else {
          url += `/${filter.toLowerCase()}/places`; // 그 외의 필터
        }
      } else {
        url += `/places`; // '전체' 선택 시 모든 장소 조회
      }

      console.log(url)
  
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
        const placeIds = placesData.map((item: any) => item.placeId);
        const longs = placesData.map((item: any) => item.longitude);
        const lats = placesData.map((item: any) => item.latitude);
  
        // 번역 작업
        const placeNamesPromises = placesData.map(async (item: any) => {
          const translatedName = await translateText(item.placeName, globalLanguage); // 번역된 장소 이름
          return translatedName;
        });
  
        const placeNames = await Promise.all(placeNamesPromises); // 모든 번역 결과를 기다림
  
        setPlaceNames(placeNames); // 번역된 장소 이름 상태 업데이트
        setPlaceIds(placeIds);
        setPlaceLongitudes(longs);
        setPlaceLatitudes(lats);
  
        setFilteredPlaces(placesData); // 모든 장소로 업데이트
      }
    } catch (error) {
      console.error('데이터 요청 실패:', error); // 에러 로그 출력
    }
  };
  
  
  const handleVisitedFilterPress = async () => {
    const jwtToken = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
    try{
      const response = await fetch(
        'http://13.125.53.226:8080/api/visited',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();
      if(response.ok){
        setVisitedData(result);

          const placeName = result.map(async (item: any) => {
            const translatedName = await translateText(item.placeName, globalLanguage);
            return translatedName;
          });
    
          // 모든 번역 결과를 기다립니다.
          const placeNames = await Promise.all(placeName);

         // 각각의 값들을 배열로 분리해서 상태로 저장
         const placeId = result.map((item: any) => item.placeId);
         const placeLocation = result.map((item: any) => item.placeLocation);
         const latitude = result.map((item: any) => item.latitude);
         const longitude = result.map((item: any) => item.longitude);
 
         setVisitedPlaceId(placeId);
         setVisitedPlaceName(placeNames);
         setVisitedPlaceLocation(placeLocation);
         setVisitedLongitudes(longitude);
         setVisitedLatitudes(latitude);
      }
  }catch (error) {
    console.error('Error:', error);
    Alert.alert('Fail to connect', '서버에 연결할 수 없습니다.');
  }
};

const handleLikesFilterPress = async () => {
  const jwtToken = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
  console.log(jwtToken);
  try {
    const response = await fetch(
      'http://13.125.53.226:8080/api/likes',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // 응답 상태 코드 확인
    if (!response.ok) {
      const errorResponse = await response.json(); // 에러 메시지 텍스트 읽기
      console.error('Error fetching likes:', errorResponse);
      Alert.alert('Error', 'Unable to fetch likes data.');
      return;
    }

    const result = await response.json();
    if (response.ok) {
      setLikesData(result);

      // 각각의 값들을 배열로 분리해서 상태로 저장
      const placeId = result.map((item: any) => item.placeId);
      const latitude = result.map((item: any) => item.latitude);
      const longitude = result.map((item: any) => item.longitude);
      const placeLocation = result.map((item: any) => item.placeLocation);

      const placeName = result.map(async (item: any) => {
        const translatedName = await translateText(item.placeName, globalLanguage);
        return translatedName;
      });

      // 모든 번역 결과를 기다립니다.
      const placeNames = await Promise.all(placeName);

      setLikesPlaceId(placeId);
      setLikesPlaceName(placeNames); // 번역된 장소명 저장
      setLikesPlaceLocation(placeLocation);
      setLikesLongitudes(longitude);
      setLikesLatitudes(latitude);
    }
  } catch (error) {
    console.error('Error:', error);
    Alert.alert('Fail to connect', '서버에 연결할 수 없습니다.');
  }
};


  
const handleBaggageFilterPress = async () => {
  setBaggageFilterActive(prevState => !prevState);

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

      const parentsPromises = result.map(async (item: any) => {
        const translatedName = await translateText(item.parentName, globalLanguage);
        return translatedName;
      });

      // 모든 번역 결과를 기다립니다.
      const parents = await Promise.all(parentsPromises);
      
      const storageIds = result.map((item: any) => item.baggageStorageId);
      const lines = result.map((item: any) => item.lineNumber);
      const longs = result.map((item: any) => item.longitude);
      const lats = result.map((item: any) => item.latitude);

      setParentNames(parents); // 번역된 부모 이름 상태 업데이트
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

// parentNames가 업데이트될 때마다 로그 출력
useEffect(() => {
  console.log("최종:", parentNames);
}, [parentNames]);


const handlePlaceMarkerPress = async (placeId: number) => {
  const jwtToken = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
  console.log("token", jwtToken);
  console.log(placeId);
  try {
    const response = await fetch(
      `http://13.125.53.226:8080/api/themes/place/${placeId}`,
      {
        method: 'GET',
        headers: {
           Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await response.json();
    console.log(result);
    
    if (response.ok) {
      const translatedPlaceName = await translateText(result.장소명, globalLanguage); // 장소명 번역
      const translatedLocation = await translateText(result.주소명, globalLanguage);

      setPlaceDetail({
        placeId: result.placeId,
        themeId: result.themeId,
        테마이름: result.테마이름,
        위도: result.위도,
        경도: result.경도,
        장소명: translatedPlaceName,
        주소명: translatedLocation,
        이미지: result['이미지'] || null,
        이미지2: result['이미지2'] || null,
        이미지3: result['이미지3'] || null,
        '영업시간': result['영업시간'] ? await translateText(result['영업시간'], globalLanguage) : null,
        '홈페이지 URL': result['홈페이지 URL'] || null,
        설명: result['설명'] ? await translateText(result['설명'], globalLanguage) : null,
        평점: result['평점'] || null,
        리뷰수: result['리뷰수'] || null,
        가격: result['가격'], 
        '비건 유형': result['비건 유형'] || null,
        '음식 종류': result['음식 종류'] || null,
        '방문 유형': result['방문 유형'] || null,
        '실내외 유형': result['실내외 유형'] || null,
        '카페 유형': result['카페 유형'] || null,
        입장료: result['입장료'] ? await translateText(result['입장료'], globalLanguage) : null,
        '체크인 시간': result['체크인 시간'] || null,
        '체크 아웃 시간': result['체크 아웃 시간'] || null,
        숙박료: result['숙박료'] || null,
        '영업 시작 시간': result['영업 시작 시간'] ? await translateText(result['영업 시작 시간'],globalLanguage): null,
        '영업 종료 시간': result['영업 종료 시간'] ? await translateText(result['영업 종료 시간'],globalLanguage): null,
        휴무일: result['휴무일'] || null,
        '관람 시간': result['관람 시간'] || null,
        비고: result['비교'] ? await translateText(result['비고'], globalLanguage) : null,
        '이용 방법': result['이용 방법'] || null,
        '수영장 유무': result['수영장 유무'] || null,
        가격대: result['가격대'] || null,
        '관련 링크': result['관련 링크'] || null,
        '총 별점': result['총 별점'] || null, 
        'visited': result.visited || false, // 방문 여부 추가,
        'likes': result.likes || false // 좋아요 여부 추가,
      });
      console.log("place: ", translatedPlaceName);

      // 리뷰를 가져오는 함수 호출
      await getReviewsByPlaceId(placeId); // 추가: 리뷰 호출

    } else {
      console.error('응답 오류:', result);
    }
  } catch (error) {
    console.error('데이터 요청 실패:', error);
  }
  bottomSheetRef.current?.snapToIndex(0);
};


  const handleBaggageMarkerPress = async (item: Baggage) => {
    setSelectedBaggage(item);
    const stationName = item.parentName;
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
  

  const handleVisitedPress = async(place: PlaceDetail) => {
    setIsVisitedActive(prevState => !prevState);
    const jwtToken = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
    console.log("token", jwtToken);
    const placeId = place.placeId;
    try{
      const response = await fetch(
        `http://13.125.53.226:8080/api/visited/${placeId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

          // 응답 상태를 확인하고 로그로 출력 (필요한 경우)
    if (response.ok) {
      console.log('Visited 성공');
      await handleVisitedFilterPress(); // 최신 좋아요 목록 가져오기
    } else {
      console.error('Visited 실패', response.status);
    }
    }catch(error){
      console.error('fail to connect', error);
    }

  };

  const handleLikesPress = async(place: PlaceDetail) => {
    setIsLikesActive(prevState => !prevState);
    const jwtToken = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
    console.log("token", jwtToken);
    const placeId = place.placeId;
    try{
      const response = await fetch(
        `http://13.125.53.226:8080/api/likes/${placeId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
          // 응답 상태를 확인하고 로그로 출력 (필요한 경우)
    if (response.ok) {
      console.log('Like 성공');
      await handleLikesFilterPress(); // 최신 좋아요 목록 가져오기
    } else {
      console.error('Like 실패', response.status);
    }

    }catch(error){
      console.error('fail to connect', error);
    }
  };

  const handleBottomSheetChange = useCallback((index: number) => {
    setBottomSheetIndex(index);
    if (index === -1) {
      setSelectedPlace(null);
    }
  }, []);

  // 리뷰 리스트 가져오기(내 방문 여부, 내 리뷰인지)
  const getReviewsByPlaceId = async (placeId: number) => {
    console.log(placeId);
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken'); // JWT 토큰 가져오기
      const response = await fetch(
        `http://13.125.53.226:8080/api/place/${placeId}/reviews`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        // 리뷰 데이터를 번역한 후 상태에 저장
        const translatedReviews = await Promise.all(
          result.reviews.map(async (review: ReviewResponseDto) => {
            const translatedReviewDec = await translateText(review.reviewDec, globalLanguage);
            return { ...review, reviewDec: translatedReviewDec };
          })
        );

        setReviews(translatedReviews); // 번역된 리뷰 리스트 상태 업데이트
        setIsVisited(result.visited); // 방문 여부 업데이트
        setIsMyReview(result.reviews.some((review: ReviewResponseDto) => review.isMyReview)); // 내 리뷰 여부 확인
      } else {
        console.error('리뷰 조회 실패:', result);
      }
    } catch (error) {
      console.error('리뷰 조회 중 오류 발생:', error);
    }
  };

  const selectImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // 0을 설정하면 여러 이미지를 선택할 수 있음
        includeBase64: false, // base64 데이터를 포함하지 않도록 설정
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          // 여러 이미지가 있을 경우 모든 이미지를 reviewImages에 추가
          const selectedImages = response.assets
            .map((asset: Asset) => {
              // uri가 존재하는 이미지 객체만 생성
              return asset.uri ? { uri: asset.uri } : null;
            })
            .filter((image): image is { uri: string } => image !== null); // null이 아닌 이미지 객체 필터링
  
          // 선택한 이미지를 기존 이미지 배열에 추가
          setReviewImages(prevImages => [...prevImages, ...selectedImages]);
        }
      }
    );
  };
  
  // 리뷰 생성
  const handleCreateReview = async (placeId: number) => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) {
        console.error('JWT 토큰이 없습니다.');
        return;
      }
      const reviewRequestDto = {
        reviewDec: newReview,
        rate: newRating,
      };
      const formData = new FormData();
      formData.append('reviewRequestDto', JSON.stringify(reviewRequestDto)); // JSON 문자열 추가
  
      // 선택된 이미지들을 FormData에 추가
      reviewImages.forEach((image, index) => {
        formData.append('reviewImages', {
          uri: image.uri,
          name: `review-image-${index}.jpg`,
          type: 'image/jpeg',
        });
      });

      const response = await fetch(
        `http://13.125.53.226:8080/api/${placeId}/review`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'multipart/form-data', // 'multipart/form-data' 헤더는 자동 설정되므로 생략 가능
          },
          body: formData,
        }
      );

      if (response.ok) {
        setNewReview('');
        setNewRating(0);
        setReviewImages([]);
        setIsReviewModalVisible(false);
        if (placeDetail?.placeId !== undefined) {
          await getReviewsByPlaceId(placeDetail.placeId); // 리뷰 리스트 갱신
        }
      } else {
        const errorData = await response.json(); // 에러 응답을 파싱
        console.error('리뷰 등록 실패:', response);
      }
    } catch (error) {
      console.error('리뷰 등록 중 오류 발생:', error);
    }
  };
  
    // 리뷰 삭제
  const handleDeleteReview = async (reviewId: number) => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const response = await fetch(
        `http://13.125.53.226:8080/api/review/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.ok) {
        await getReviewsByPlaceId(placeDetail?.placeId); // 리뷰 리스트 갱신
      } else {
        console.error('리뷰 삭제 실패:', response);
      }
    } catch (error) {
      console.error('리뷰 삭제 중 오류 발생:', error);
    }
  };
  
  // Wrapper 함수 생성 
  const handlePressCreateReview = () => {
    if (placeDetail?.placeId !== undefined) {
      handleCreateReview(placeDetail.placeId);
    }
  };


  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          // latitude: initialLatitude ?? 37.5457,
          // longitude: initialLongitude ?? 126.9644,
          latitude: 37.5659,
          longitude: 126.9753,
          latitudeDelta: initialRegion?.latitudeDelta ?? 0.005,
          longitudeDelta: initialRegion?.longitudeDelta ?? 0.005,
        }}
        region={region}
        showsUserLocation={true}
      >
        {filteredPlaces.map((place, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: place.latitude,
              longitude: place.longitude,
            }}
            onPress={() => {
              handlePlaceMarkerPress(place.placeId);
            }}
          >
            <View style={styles.markerContainer}>
              <Image
                source={require('../../assets/images/map/theme-marker.png')}
                style={styles.themeMarker}
              />
            </View>
            <Text style={styles.markerPlace}>{placeNames[index]}</Text>
          </Marker>
        ))}
  
        {/* visitedData 마커 */}
        {visitedFilterActive === true &&
          visitedData.map((item, index) => {
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                onPress={() => {
                  handlePlaceMarkerPress(item.placeId);
                }}
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={require('../../assets/images/map/visited-marker.png')}
                    style={styles.themeMarker}
                  />
                </View>
                <Text style={styles.markerPlace}>{visitedPlaceName[index]}</Text>
              </Marker>
            );
          })}
  
        {/* likesData 마커 */}
        {likesFilterActive == true &&
          likesData.map((item, index) => {
            console.log(item);
            console.log(item.latitude);
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                onPress={() => {
                  handlePlaceMarkerPress(item.placeId); // Place 객체 전달
                }}
              >
                <View style={styles.markerContainer}>
                  <Image
                    source={require('../../assets/images/map/likes-marker.png')}
                    style={styles.themeMarker}
                  />
                </View>
                <Text style={styles.markerPlace}>{likesPlaceName[index]}</Text>
              </Marker>
            );
          })}
  
        {/* baggageData 마커 */}
        {baggageFilterActive == true &&
          baggageData.map((item, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              onPress={() => handleBaggageMarkerPress(item)}
            >
              <View style={styles.markerContainer}>
                <Image
                  source={require('../../assets/images/map/baggages-marker.png')}
                  style={styles.themeMarker}
                />
              </View>
              <Text style={styles.markerPlace}>{parentNames[index]}</Text>
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
          showsHorizontalScrollIndicator={false}
        >
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
                ]}
              >
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
            visitedFilterActive && { backgroundColor: '#02BC7D' },
          ]}
          onPress={() => {
            handleVisitedFilterPress(); // 방문 필터 함수 호출
            setVisitedFilterActive((prevState) => !prevState); // 상태 토글
          }}
        >
          <Text
            style={[
              styles.buttonText,
              visitedFilterActive && { color: '#FFFFFF' },
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
            likesFilterActive && { backgroundColor: '#FF344C' },
          ]}
          onPress={() => {
            handleLikesFilterPress(); // 방문 필터 함수 호출
            setLikesFilterActive((prevState) => !prevState); // 상태 토글
          }}
        >
          <Text
            style={[styles.buttonText, likesFilterActive && { color: '#FFFFFF' }]}
          >
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
            baggageFilterActive && { backgroundColor: '#0047A0' },
          ]}
          onPress={handleBaggageFilterPress}
        >
          <Text
            style={[
              styles.buttonText,
              baggageFilterActive && { color: '#FFFFFF' },
            ]}
          >
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
        onChange={handleBottomSheetChange}
      >
        {/* selectedPlace 관련 렌더링 */}
        {placeDetail && (
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
                      onPress={async () => {
                        await handleVisitedPress(placeDetail); // 장소 정보를 서버에 저장
                        await handleVisitedFilterPress(); // 저장된 장소 목록 가져오기
                      }}
                    >
                      <Image
                        source={
                          placeDetail?.visited // placeDetail의 visited 상태를 사용하여 이미지 변경
                            ? require('../../assets/images/map/visited-active.png')
                            : require('../../assets/images/map/visited-inactive.png')
                        }
                        style={styles.bottomSheetVisitedButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.bottomSheetButton}
                      onPress={async () => {
                        await handleLikesPress(placeDetail); // 장소 정보를 서버에 저장
                        await handleLikesFilterPress(); // 저장된 장소 목록 가져오기
                      }}
                    >
                      <Image
                        source={
                          placeDetail?.likes // placeDetail의 likes 상태를 사용하여 이미지 변경
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
                  <View style={styles.bottomSheetButtonContainer}>
                    <TouchableOpacity
                      style={styles.bottomSheetButton}
                      onPress={async () => {
                        await handleVisitedPress(placeDetail);
                        await handleVisitedFilterPress();
                      }}
                    >
                      <Image
                        source={
                          placeDetail?.visited 
                            ? require('../../assets/images/map/visited-active.png')
                            : require('../../assets/images/map/visited-inactive.png')
                        }
                        style={styles.bottomSheetVisitedButton}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.bottomSheetButton}
                      onPress={async () => {
                        await handleLikesPress(placeDetail);
                        await handleLikesFilterPress();
                      }}
                    >
                      <Image
                        source={
                          placeDetail?.likes 
                            ? require('../../assets/images/map/likes-active.png')
                            : require('../../assets/images/map/likes-inactive.png')
                        }
                        style={styles.bottomSheetLikesButton}
                      />
                    </TouchableOpacity>
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
  
                {/* 주소, 영업시간 등 null 값을 체크하고 렌더링 */}
                <View style={styles.bottomSheetListContainer}>
                  {placeDetail.주소명 && (
                    <>
                      <Text style={styles.bottomSheetListAddressTitle}>
                        {address}
                      </Text>
                      <Text style={styles.bottomSheetListContent}>
                        {placeDetail.주소명}
                      </Text>
                    </>
                  )}
  
                  {placeDetail['홈페이지 URL'] && (
                    <>
                      <Text style={styles.bottomSheetListHomepageTitle}>
                        {homepage}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          placeDetail['홈페이지 URL'] &&
                          Linking.openURL(placeDetail['홈페이지 URL'])
                        }
                      >
                        <Text
                          style={[
                            styles.bottomSheetListHomepage,
                            {
                              color: 'blue',
                              textDecorationLine: 'underline',
                            },
                          ]}
                        >
                          {placeDetail['홈페이지 URL'] || '홈페이지 없음'}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
  
                  {placeDetail.설명 && (
                    <>
                      <Text style={styles.bottomSheetListTitle}>{info}</Text>
                      <Text style={styles.bottomSheetListContent}>
                        {placeDetail.설명}
                      </Text>
                    </>
                  )}
  
                  {placeDetail.영업시간 && (
                    <>
                      <Text style={styles.bottomSheetListTitle}>{time}</Text>
                      <Text style={styles.bottomSheetListContent}>
                        {placeDetail.영업시간}
                      </Text>
                    </>
                  )}
  
                  {placeDetail['평점'] && (
                    <>
                      <Text style={styles.bottomSheetListTitle}>{rating}</Text>
                      <Text style={styles.bottomSheetListContent}>
                        {placeDetail['평점']}
                      </Text>
                    </>
                  )}
                </View>
  
                {/* [추가]리뷰 리스트 렌더링 */}
                {reviews.length > 0 && (
                  <View style={styles.reviewsContainer}>
                    <Text style={styles.reviewsTitle}>리뷰</Text>
                    {reviews.map((review) => (
                      <View key={review.reviewId} style={styles.reviewItem}>
                        <Text style={styles.reviewText}>{review.reviewDec}</Text>
                        <Text style={styles.reviewRate}>
                          평점: {review.rate}
                        </Text>
                        {review.reviewUrl1 && (
                          <Image
                            source={{ uri: review.reviewUrl1 }}
                            style={styles.reviewImage}
                            resizeMode="cover" // 이미지가 잘 맞도록 수정
                          />
                        )}
                        {review.isMyReview && (
                          <TouchableOpacity
                            onPress={() => handleDeleteReview(review.reviewId)}
                            style={styles.deleteReviewButton}
                          >
                            <Text style={styles.deleteReviewButtonText}>
                              삭제
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    ))}
                  </View>
                )}
  
                {/* 리뷰 작성 버튼 */}
                {placeDetail?.visited && (
                  <TouchableOpacity
                    style={styles.writeReviewButton}
                    onPress={() => setIsReviewModalVisible(true)}
                  >
                    <Text style={styles.writeReviewButtonText}>{translatedLabels.writeReview}</Text>
                  </TouchableOpacity>
                )}
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
                  {baggageDetail.length > 0 &&
                    baggageDetail.map((item, index) => (
                      <ScrollView>
                        <View key={index}>
                          <Text style={styles.baggagePlace}>
                            {item.lockerName}
                          </Text>
                          <Text style={styles.baggageDetail}>
                            위치: {item.lockerDetail}
                          </Text>
                          <Text style={styles.baggageDetail}>
                            소형 칸 개수: {item.smallCount}
                          </Text>
                          <Text style={styles.baggageDetail}>
                            중형 칸 개수: {item.mediumCount}
                          </Text>
                          <Text style={styles.baggageDetail}>
                            대형 칸 개수: {item.largeCount}
                          </Text>
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
  
      {isReviewModalVisible && (
        <View style={styles.reviewModal}>
          <Text style={styles.modalTitle}>{translatedLabels.writeReview}</Text>
          
          {/* 리뷰 입력 필드 */}
          <TextInput
            style={styles.reviewInput}
            placeholder={translatedLabels.reviewPlaceholder}
            value={newReview}
            onChangeText={setNewReview}
            multiline
          />

          {/* 별점 선택 */}
          <View style={styles.ratingContainer}>
            <Text style={styles.modalSubTitle}>{translatedLabels.rating}</Text>
            <View style={styles.ratingStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
                  <Image
                    source={
                      star <= newRating
                        ? require('../../assets/images/star-filled.png') // 채워진 별 이미지
                        : require('../../assets/images/star-outline.png') // 비어있는 별 이미지
                    }
                    style={styles.starIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 이미지 선택 버튼 */}
          <TouchableOpacity
            onPress={selectImages} // 이미지 선택 함수 호출
            style={styles.imagePickerButton}
          >
            <Text style={styles.imagePickerButtonText}>{translatedLabels.selectImage}</Text>
          </TouchableOpacity>
          
          {/* 선택된 이미지 미리보기 */}
          <View style={styles.imagePreviewContainer}>
            {reviewImages.map((image, index) => (
              <Image key={index} source={{ uri: image.uri }} style={styles.selectedImage} />
            ))}
          </View>

          {/* 리뷰 등록 버튼 */}
          <TouchableOpacity onPress={handlePressCreateReview} style={styles.submitReviewButton}>
            <Text style={styles.submitReviewButtonText}>{translatedLabels.submitReview}</Text>
          </TouchableOpacity>

          {/* 취소 버튼 */}
          <TouchableOpacity
            onPress={() => setIsReviewModalVisible(false)}
            style={styles.cancelReviewButton}
          >
            <Text style={styles.cancelReviewButtonText}>{translatedLabels.cancelReview}</Text>
          </TouchableOpacity>

        </View>
)}

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
  reviewsContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  reviewsTitle: {
    fontFamily: 'SBAggroM',
    fontSize: 18,
    marginBottom: 10,
  },
  reviewItem: {
    marginBottom: 10,
  },
  reviewText: {
    fontFamily: 'SBAggroL',
    fontSize: 16,
  },
  reviewRate: {
    fontFamily: 'SBAggroM',
    fontSize: 14,
  },
  reviewImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginTop: 5,
  },
  deleteReviewButton: {
    backgroundColor: '#FF344C',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  deleteReviewButtonText: {
    color: '#fff',
  },
  writeReviewButton: {
    backgroundColor: '#02BC7D',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  writeReviewButtonText: {
    color: '#fff',
    fontFamily: 'SBAggroM',
    fontSize: 16,
  },
  reviewModal: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reviewInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginBottom: 15,
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top', // 텍스트 입력 시 위쪽부터 시작하도록 설정
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ratingStars: {
    flexDirection: 'row',
  },
  starIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
  imagePickerButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: 'center',
  },
  imagePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  imagePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  selectedImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginLeft: 10,
  },
  submitReviewButton: {
    backgroundColor: '#02BC7D',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  submitReviewButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelReviewButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'center',
  },
  cancelReviewButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default ThemeScreen;
