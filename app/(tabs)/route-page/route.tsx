import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import Constants from 'expo-constants';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// 여기에 타입을 정의합니다
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

const RouteScreen = () => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const tMapApiKey = Constants.expoConfig?.extra?.tMapApiKey; // T-Map API 키 가져오기

  // bottomSheetRef를 useRef로 정의합니다.
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.56523875839218,  // 출발지 위도
          longitude: 126.977613738705,  // 출발지 경도
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {renderRoute()}
      </MapView>

      <BottomSheet
        ref={bottomSheetRef}
        index={1} // 초기 상태가 45%만큼 올라오도록 설정
        snapPoints={['10%', '45%', '80%']} // snap points 설정
        enablePanDownToClose={false} // 아래로 스와이프하여 닫기 불가, 특정 위치로만 이동 가능
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.sheetText}>경로 정보</Text>
          {routeData && (
            <>
              <Text>총 거리: {(parseInt(routeData.properties.totalDistance) / 1000).toFixed(1)} km</Text>
              <Text>총 시간: {(parseInt(routeData.properties.totalTime) / 60).toFixed(0)} 분</Text>
              <Text>총 요금: {routeData.properties.totalFare} 원</Text>
            </>
          )}
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomSheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  sheetText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RouteScreen;