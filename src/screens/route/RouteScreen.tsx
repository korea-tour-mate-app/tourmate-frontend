import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { useSelection } from '../../components/SelectionContext';

interface DayData {
  id: number;
  title: string;
  img: any; 
  travelTime?: string;
}

interface DaysData {
  [key: string]: DayData[];
}

const RouteScreen = () => {
  const [selectedDay, setSelectedDay] = useState("1일차");
  const [selectedLocation, setSelectedLocation] = useState({ latitude: 37.54523875839218, longitude: 126.977613738705 });
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

  const data: DaysData = {
    '1일차': [
      { id: 1, title: "숭례문", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "106분" },
      { id: 2, title: "운현궁", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "18분" },
      { id: 3, title: "경복궁", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "17분" },
      { id: 4, title: "창덕궁", img: require('../../assets/images/route/recommend-place1.png'), travelTime: "20분" },
      { id: 5, title: "남산서울타워", img: require('../../assets/images/route/recommend-place1.png') },
    ]
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

  const renderDayView = (dayKey: string) => (
    <ScrollView contentContainerStyle={styles.dayContainer}>
      {(data[dayKey as keyof typeof data] as DayData[]).map((item, index) => (
        <View key={item.id} style={styles.itemContainer}>
          <View style={styles.timeline}>
            <Text style={styles.timelineText}>{index + 1}</Text>
            {index < data[dayKey as keyof typeof data].length - 1 && (
              <>
                <Image source={require('../../assets/images/route/timeline-bus.png')} style={styles.timelineIcon} />
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
        showsUserLocation={true}
      />

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
          {Object.keys(data).map(day => (
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
});

export default RouteScreen;