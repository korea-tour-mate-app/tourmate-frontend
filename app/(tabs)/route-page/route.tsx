import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// T-Map API로부터 받은 경로 데이터 타입 정의
type RouteData = {
  type: string;
  properties: {
    totalDistance: string;
    totalTime: string;
    totalFare: string;
  };
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: {
      viaPointId: string;
      viaPointName: string;
    };
  }[];
};

interface DayData {
  id: number;
  title: string;
  img: any; // any는 실제 이미지 타입으로 변경할 수 있습니다.
}


// 일차별 일정 데이터
const data = {
  "1일차": [
    { id: 1, title: "제주국제공항", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 2, title: "스위트호텔 제주", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 3, title: "대기정", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 4, title: "스위트호텔 제주", img: require('@/assets/images/recommend/recommend-place.png') },
  ],
  "2일차": [
    { id: 1, title: "스위트호텔 제주", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 2, title: "협재해변", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 3, title: "새별오름 나홀로나무", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 4, title: "스위트호텔 제주", img: require('@/assets/images/recommend/recommend-place.png') },
  ],
  "3일차": [
    { id: 1, title: "제주국제공항", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 2, title: "스위트호텔 제주", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 3, title: "대기정", img: require('@/assets/images/recommend/recommend-place.png') },
    { id: 4, title: "스위트호텔 제주", img: require('@/assets/images/recommend/recommend-place.png') },
  ]
};

const RouteScreen = () => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [selectedDay, setSelectedDay] = useState("1일차");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const tMapApiKey = Constants.expoConfig?.extra?.tMapApiKey; // T-Map API 키 가져오기

  useEffect(() => {
    const fetchRoute = async () => {
      if (!tMapApiKey) {
        console.error('T-Map API 키가 설정되지 않았습니다.');
        return;
      }

      try {
        const response = await fetch('https://apis.openapi.sk.com/tmap/routes/routeOptimization10?version=1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'appKey': tMapApiKey,
            'accept': 'application/json',
          },
          body: JSON.stringify({
            reqCoordType: "WGS84GEO", // 요청 좌표 타입
            resCoordType: "WGS84GEO", // 응답 좌표 타입
            startName: "숭례문",
            startX: "126.975208",  // 출발지 경도
            startY: "37.561004",  // 출발지 위도
            startTime: "202408251200", // 출발 시간 (예시로 2024년 8월 25일 12:00)
            endName: "운현궁",
            endX: "126.985512",  // 도착지 경도
            endY: "37.574385",  // 도착지 위도
            searchOption: "0",
            carType: "4",
            viaPoints: [
              {
                viaPointId: "test01",
                viaPointName: "경복궁",
                viaX: "126.976889",
                viaY: "37.579617"
              },
              {
                viaPointId: "test02",
                viaPointName: "창덕궁",
                viaX: "126.991898",
                viaY: "37.579620"
              },
              {
                viaPointId: "test03",
                viaPointName: "남산서울타워",
                viaX: "126.988205",
                viaY: "37.551169"
              }
            ]
          }),
        });

        if (response.ok) {
          const data: RouteData = await response.json();
          setRouteData(data);
          console.log('T-Map API 응답:', data);
        } else {
          const errorData = await response.json();
          console.error(`T-Map API 호출 중 오류 발생: ${errorData.message}`);
        }
      } catch (error) {
        console.error('T-Map API 호출 중 오류 발생:', error);
      }
    };

    fetchRoute();
  }, [tMapApiKey]);

  // 지도에 표시될 경로와 마커들 생성
  const renderRoute = () => {
    if (!routeData || !routeData.features) {
      return null;
    }

    const markers = routeData.features
      .filter(feature => feature.geometry.type === "Point")
      .map((feature, index) => (
        <Marker
          key={`marker-${index}`}
          coordinate={{
            latitude: parseFloat(feature.geometry.coordinates[1].toString()), // 숫자를 문자열로 변환 후 파싱
            longitude: parseFloat(feature.geometry.coordinates[0].toString()), // 숫자를 문자열로 변환 후 파싱
          }}
        >
          <Callout>
            <Text>{`${index + 1}. ${feature.properties.viaPointName.replace('[0] ', '')}`}</Text>
          </Callout>
        </Marker>
      ));

    const polylineCoords = routeData.features
      .filter(feature => feature.geometry.type === "LineString")
      .flatMap(feature =>
        feature.geometry.coordinates.map(coord => ({
          latitude: parseFloat(coord[1].toString()), // 숫자를 문자열로 변환 후 파싱
          longitude: parseFloat(coord[0].toString()), // 숫자를 문자열로 변환 후 파싱
        }))
      );

    return (
      <>
        {markers}
        <Polyline
          coordinates={polylineCoords}
          strokeColor="#0000FF" // 파란색 선 색깔
          strokeWidth={3}       // 선 두께
        />
      </>
    );
  };

  const renderDayView = (dayKey: string) => (
    <ScrollView contentContainerStyle={styles.dayContainer}>
      {(data[dayKey as keyof typeof data] as DayData[]).map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <Image source={item.img} style={styles.itemImage} />
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.56523875839218,
          longitude: 126.977613738705,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {renderRoute()}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={['10%', '45%', '80%']}
      >
        <View style={styles.bottomSheetHeader}>
          {Object.keys(data).map(day => (
            <TouchableOpacity key={day} onPress={() => setSelectedDay(day)}>
              <Text style={styles.dayButton}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {renderDayView(selectedDay)}
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
    height: '55%',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  dayButton: {
    fontSize: 16,
    color: '#333',
  },
  dayContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  itemImage: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  itemTextContainer: {
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RouteScreen;