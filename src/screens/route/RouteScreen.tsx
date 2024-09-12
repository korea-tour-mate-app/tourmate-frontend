import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { useSelection } from '../../components/SelectionContext';
import axios from 'axios';

interface DayData {
  id: number;
  title: string;
  img: any; 
  travelTime?: string;
}

// interface DaysData {
//   [key: string]: DayData[];
// }

interface RouteOptResponseDto {
  totalDistance: string;
  totalTime: string;
  totalFare: string;
  visitPlaces: {
    order: string;
    name: string;
    latitude: number;
    longitude: number;
  }[];
  paths: {
    coordinates: number[][];
    name: string;
  }[];
}

const RouteScreen = () => {
  const [selectedDay, setSelectedDay] = useState("1일차");
  const [selectedLocation, setSelectedLocation] = useState({ latitude: 37.54523875839218, longitude: 126.977613738705 });
  const [routeInfoByDay, setRouteInfoByDay] = useState<{ [day: string]: Omit<RouteOptResponseDto, 'paths'> }>({}); // 날짜별 경로 정보를 저장할 상태
  const [mapPathsByDay, setMapPathsByDay] = useState<{ [day: string]: RouteOptResponseDto['paths'] }>({}); // 날짜별 경로
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);


  // SelectionContext에서 값 가져오기
  const {
    selectedThemes,
    selectedDay: contextSelectedDay,
    selectedWithWho,
    selectedBudget,
    selectedVehicle
  } = useSelection();

  useEffect(() => {
    console.log('Selected Themes:', selectedThemes);
    console.log('Selected Day:', contextSelectedDay);
    console.log('Selected WithWho:', selectedWithWho);
    console.log('Selected Budget:', selectedBudget);
    console.log('Selected Vehicle:', selectedVehicle);
  }, [selectedThemes, contextSelectedDay, selectedWithWho, selectedBudget, selectedVehicle]);

  // const dayCount = Number(contextSelectedDay.at(-1)); // 며칠동안 여행을 가는지
    const dayCount = 1 // 일단 api 호출은 한번으로 고정

  // TODO 모델에서 장소 받기
  
  useEffect(() => {
    const fetchRouteDataForEachDay = async () => {
      try {
        const newRouteInfoByDay: { [day: string]: Omit<RouteOptResponseDto, 'paths'> } = {};
        const newMapPathsByDay: { [day: string]: RouteOptResponseDto['paths'] } = {};

        // 각 날짜에 대해 API 호출
        for (let i = 0; i < dayCount; i++) {
          const requestBody = {
            startName: "숭례문",  // 실제 값에 맞게 수정 필요 (ex. modelData[i]['startName'])
            startX: "126.975208",
            startY: "37.561004",
            startTime: "202408251200",
            endName: "운현궁",
            endX: "126.985512",
            endY: "37.574385",
            viaPoints: [
              { viaPointId: "test01", viaPointName: "경복궁", viaX: "126.976889", viaY: "37.579617" },
              { viaPointId: "test02", viaPointName: "창덕궁", viaX: "126.991898", viaY: "37.579620" },
              { viaPointId: "test03", viaPointName: "남산서울타워", viaX: "126.988205", viaY: "37.551169" }
            ]
          };

          const response = await axios.post('/api/tmap/optimize-route', requestBody);
          console.log(`Day ${i + 1} route data:`, response.data);
          const { totalDistance, totalTime, totalFare, visitPlaces, paths } = response.data;

          // 날짜별로 저장
          const dayKey = `${i + 1}일차`;

          // 상태 업데이트를 위한 새로운 객체 생성
          newRouteInfoByDay[dayKey] = { totalDistance, totalTime, totalFare, visitPlaces };
          newMapPathsByDay[dayKey] = paths;

          // 최종적으로 상태 업데이트
          setRouteInfoByDay(newRouteInfoByDay); // 경로 기초 정보 저장
          setMapPathsByDay(newMapPathsByDay);  // paths 저장
        }
      } catch (error) {
        console.error('Error fetching route data:', error);
      }
    };

    fetchRouteDataForEachDay();
  }, []); // useEffect 의존성 배열 추가

  // const data: DaysData = {
  //   '1일차': [
  //     { id: 1, title: "숭례문", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "106분" },
  //     { id: 2, title: "운현궁", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "18분" },
  //     { id: 3, title: "경복궁", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "17분" },
  //     { id: 4, title: "창덕궁", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "20분" },
  //     { id: 5, title: "남산서울타워", img: require('../../assets/images/route/recommend-place1.png') },
  //   ]
  // };

  const handleLocationPress = (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude });
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((camera) => {
      camera.zoom += 1; // 줌 인
      mapRef.current?.animateCamera(camera);
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((camera) => {
      camera.zoom -= 1; // 줌 아웃
      mapRef.current?.animateCamera(camera);
    });
  };

  const renderRoute = (routePaths: RouteOptResponseDto['paths'] | null) => {
    if (!routePaths || routePaths.length === 0) return null;

    return routePaths.map((path, index) => (
      <Polyline
        key={index}
        coordinates={path.coordinates.map(([latitude, longitude]) => ({
          latitude,
          longitude,
        }))}
        strokeColor="#0000FF"
        strokeWidth={4}
      />
    ));
  };

  const renderDayView = (dayKey: string) => (
    <ScrollView contentContainerStyle={styles.dayContainer}>
      {/* BottomSheet 상단에 totalDistance, totalTime, totalFare 정보 표시 */}
      <View style={styles.routeInfoContainer}>
        <Text>총 거리: {routeInfo.totalDistance} m</Text>
        <Text>총 시간: {routeInfo.totalTime} 초</Text>
        <Text>총 요금: {routeInfo.totalFare} 원</Text>
      </View>

      {/* 경로의 각 장소 렌더링 */}
      {Array.isArray(routeInfo.visitPlaces) && routeInfo.visitPlaces.map((place, index) => (
        <View key={index} style={styles.itemContainer}>
          <View style={styles.timeline}>
            <Text style={styles.timelineText}>{index + 1}</Text>
            {index < routeInfo.visitPlaces.length - 1 && (
              <>
                {/* selectedVehicle 값에 따라 아이콘 변경 */}
                <Image
                source={selectedVehicle === 0
                  ? require('../../assets/images/route/timeline-bus.png')
                  : require('../../assets/images/route/timeline-car.png')
                }
                style={styles.timelineIcon}
                />
                <Text style={styles.timelineText}>{place.travelTime}</Text>
              </>
            )}
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.itemTitle} onPress={() => handleLocationPress(place.latitude, place.longitude)}>
              {place.name}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderMarkers = () => {
    if (!Array.isArray(routeInfo.visitPlaces)) return null;

    // 마커 렌더링
    return routeInfo.visitPlaces.map((place, index) => (
      <Marker
        // key={index}
        coordinate={{
          latitude: place.latitude, // 위도
          longitude: place.longitude, // 경도
        }}
        title={place.viaPointName} // 장소 이름
        description={`${place.order + 1}번째 방문 장소`} // 방문 순서
        />
    ));
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {renderRoute(mapPaths)}  {/* 경로 그리기 */}
        {renderMarkers()}       {/* 마커 렌더링 */}
      </MapView>
      {/* 확대/축소 버튼 */}
      <View style={styles.zoomButtonsContainer}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={['10%', '50%', '85%']}>
        <View style={styles.bottomSheetHeader}>
          {Object.keys(routeInfo).map(day => (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(day)}
              style={[styles.dayButton, selectedDay === day && styles.selectedDayButton]}
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
    backgroundColor: '#0047A0',
  },
  selectedDayText: {
    fontSize: 16,
    color: '#fff',
  },
  dayContainer: {
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    marginLeft: 10,
    borderRadius: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  travelTime: {
    color: '#666',
    fontSize: 12,
  },
  timeline: {
    alignItems: 'center',
    marginRight: 10,
  },
  timelineText: {
    fontSize: 12,
    color: '#666',
  },
  timelineIcon: {
    width: 12,
    height: 12,
    marginVertical: 5,
  },
  locationDetails: {
    flex: 1,
  },
  zoomButtonsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    alignItems: 'center',
  },
  zoomButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 5, // 안드로이드 그림자 효과
    shadowColor: 'black', // iOS 그림자 효과
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { height: 1, width: 1 },
  },
  zoomButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  routeInfoContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default RouteScreen;