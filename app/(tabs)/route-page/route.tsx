import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';

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

// DayData 인터페이스 선언
interface DayData {
  id: number;
  title: string;
  img: any; // 실제 이미지 타입으로 변경 가능
}

// DaysData 인터페이스 선언 (동적으로 키가 들어올 수 있도록 설정)
interface DaysData {
  [key: string]: DayData[]; // 인덱스 시그니처로 키를 문자열로 정의
}

const RouteScreen = () => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [selectedDay, setSelectedDay] = useState("1일차");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { totalDays, startDate, endDate } = useLocalSearchParams(); // 기본값 3일로 설정
  const tMapApiKey = Constants.expoConfig?.extra?.tMapApiKey; // T-Map API 키 가져오기

  console.log("totalDays는? " + totalDays);
  // totalDays에 따라 동적으로 데이터 생성
  const data: DaysData = {};
  for (let i = 1; i <= Number(totalDays); i++) {
    data[`${i}일차`] = [
      { id: 1, title: "숭례문", img: require('@/assets/images/recommend/recommend-place.png') },
      { id: 2, title: "운헌궁", img: require('@/assets/images/recommend/recommend-place.png') },
      { id: 3, title: "경복궁", img: require('@/assets/images/recommend/recommend-place.png') },
      { id: 4, title: "창덕궁", img: require('@/assets/images/recommend/recommend-place.png') },
      { id: 5, title: "남산서울타워", img: require('@/assets/images/recommend/recommend-place.png') },
    ];
  }
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
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 40.17523875839218, // 기존 값에서 약간 증가시킴
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
        snapPoints={['10%', '50%', '85%']}
      >
        <View style={styles.bottomSheetHeader}>
          {Object.keys(data).slice(0, Number(totalDays)).map(day => ( // totalDays만큼만 표시
            <TouchableOpacity 
              key={day} 
              onPress={() => setSelectedDay(day)}
              style={[
                styles.dayButton, 
                selectedDay === day && styles.selectedDayButton // 선택된 버튼에만 추가 스타일 적용
              ]}
            >
              <Text style={selectedDay === day ? styles.selectedDayText : styles.dayButtonText}>{day}</Text>
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
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    // backgroundColor: '#f0f0f0',
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  dayButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDayButton: {
    backgroundColor: '#0047A0', // 클릭된 버튼에 적용할 배경색
  },
  selectedDayText: {
    fontSize: 16,
    color: '#fff', // 클릭된 버튼의 텍스트 색상
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