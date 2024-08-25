import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import Constants from 'expo-constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useLocalSearchParams } from 'expo-router';

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
  img: any; 
  travelTime?: string; // 이동 시간 추가
}

interface DaysData {
  [key: string]: DayData[];
}

const RouteScreen = () => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [selectedDay, setSelectedDay] = useState("1일차");
  const [selectedLocation, setSelectedLocation] = useState({ latitude: 37.54523875839218, longitude: 126.977613738705 });
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);
  const { totalDays = 1, startDate, endDate } = useLocalSearchParams();
  const tMapApiKey = Constants.expoConfig?.extra?.tMapApiKey;

  const data: DaysData = {};
  const daysCount = Number(totalDays) || 1;

  for (let i = 1; i <= daysCount; i++) {
    data[`${i}일차`] = [
      { id: 1, title: "숭례문", img: require('@/assets/images/recommend/recommend-place.png'), travelTime: "106분" },
      { id: 2, title: "운현궁", img: require('@/assets/images/recommend/recommend-place.png'), travelTime: "18분" },
      { id: 3, title: "경복궁", img: require('@/assets/images/recommend/recommend-place.png'), travelTime: "17분" },
      { id: 4, title: "창덕궁", img: require('@/assets/images/recommend/recommend-place.png'), travelTime: "20분" },
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
            reqCoordType: "WGS84GEO",
            resCoordType: "WGS84GEO",
            startName: "숭례문",
            startX: "126.975208",
            startY: "37.561004",
            startTime: "202408251200",
            endName: "운현궁",
            endX: "126.985512",
            endY: "37.574385",
            searchOption: "0",
            carType: "4",
            viaPoints: [
              { viaPointId: "test01", viaPointName: "경복궁", viaX: "126.976889", viaY: "37.579617" },
              { viaPointId: "test02", viaPointName: "창덕궁", viaX: "126.991898", viaY: "37.579620" },
              { viaPointId: "test03", viaPointName: "남산서울타워", viaX: "126.988205", viaY: "37.551169" },
            ]
          }),
        });

        if (response.ok) {
          const data: RouteData = await response.json();
          setRouteData(data);
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
            latitude: parseFloat(feature.geometry.coordinates[1].toString()),
            longitude: parseFloat(feature.geometry.coordinates[0].toString()),
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
          latitude: parseFloat(coord[1].toString()),
          longitude: parseFloat(coord[0].toString()),
        }))
      );

    return (
      <>
        {markers}
        <Polyline coordinates={polylineCoords} strokeColor="#0000FF" strokeWidth={3} />
      </>
    );
  };

  const handleLocationPress = (latitude: number, longitude: number) => {
    setSelectedLocation({ latitude, longitude });
    mapRef.current?.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const renderDayView = (dayKey: string) => (
    <ScrollView contentContainerStyle={styles.dayContainer}>
      {(data[dayKey as keyof typeof data] as DayData[]).map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.timeline}>
            <Text style={styles.timelineText}>{index + 1}</Text>
            {index < data[dayKey as keyof typeof data].length - 1 && (
              <>
                <Image source={require('@/assets/images/timeline-bus.png')} style={styles.timelineIcon} />
                <Text style={styles.timelineText}>{item.travelTime}</Text>
              </>
            )}
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.itemTitle} onPress={() => handleLocationPress(selectedLocation.latitude, selectedLocation.longitude)}>
              {item.title}
            </Text>
            <Text style={styles.travelTime}>{item.travelTime}</Text>
          </View>
          <Image source={item.img} style={styles.itemImage} />
        </View>
      ))}
    </ScrollView>
  );

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
      >
        {renderRoute()}
      </MapView>

      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={['10%', '50%', '85%']}>
        <View style={styles.bottomSheetHeader}>
          {Object.keys(data).slice(0, daysCount).map(day => (
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
});

export default RouteScreen;
