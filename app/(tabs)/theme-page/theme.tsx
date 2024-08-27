import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ScrollView, Dimensions, Platform, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import BottomSheet from '@gorhom/bottom-sheet';
import mapStyle from '@/components/MapStyle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface Place {
  id: number;
  name: string;
  description: string;
  address: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

function ThemeScreen() {
  const [location, setLocation] = useState<LocationType | undefined>();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(-1);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  const places: Place[] = [
    { id: 1, name: '경복궁', description: '서울의 대표 고궁', address: '서울시 종로구', coordinate: { latitude: 37.5796, longitude: 126.9794 } },
    { id: 2, name: '명동', description: '서울의 쇼핑 거리', address: '서울시 어딘가', coordinate: { latitude: 37.5636, longitude: 126.9858 } },
    { id: 3, name: '남산타워', description: '서울의 랜드마크', address: '서울시에 있겠지 용산구 그 어딘가 산 속에', coordinate: { latitude: 37.5512, longitude: 126.9882 } },
  ];

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('위치 접근 권한이 거부되었습니다.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    };

    getLocation();
  }, []);

  const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;
  const isGoogleMap = Platform.OS === 'android' || mapProvider === PROVIDER_GOOGLE;

  const handleFilterPress = (filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    bottomSheetRef.current?.expand(); 
  };

  const handleCloseBottomSheet = useCallback(() => {
    setSelectedPlace(null);
    bottomSheetRef.current?.close();
  }, []);

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
          provider={isGoogleMap ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          initialRegion={location}
          customMapStyle={isGoogleMap ? mapStyle : undefined}
          showsUserLocation={true}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              coordinate={place.coordinate}
              onPress={() => handleMarkerPress(place)}
            >
              <View style={styles.markerContainer}>
                <Image source={require('../../../assets/images/map/theme-marker.png')} style={styles.themeMarker}/>
              </View>
              <Text style={styles.markerPlace}>{place.name}</Text>
            </Marker>
          ))}
        </MapView>
      )}

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          contentContainerStyle={styles.filterScrollView}
          showsHorizontalScrollIndicator={false}
        >
          {['K-pop', '고궁', '템플스테이', '식도락', '레저스포츠', '등산코스', '테마시설', '문화시설', '호캉스', '카페', '공방'].map(filter => (
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
        <TouchableOpacity style={styles.buttonVisited} onPress={() => console.log('Visited 버튼 클릭됨')}>
          <Text style={styles.buttonText}>Visited</Text>
          <Image source={require('../../../assets/images/map/visited-active.png')} style={styles.buttonVisitedIcon}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonLikes} onPress={() => console.log('Likes 버튼 클릭됨')}>
          <Text style={styles.buttonText}>Likes</Text>
          <Image source={require('../../../assets/images/map/likes-active.png')} style={styles.buttonLikesIcon}/> 
        </TouchableOpacity>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={['80%', '30%']}
        enablePanDownToClose={true}
        onChange={handleBottomSheetChange}
      >
        {selectedPlace && (
          <View style={styles.bottomSheetContainer}>
            <View style={[
              styles.bottomSheetTitleContainer,
              bottomSheetIndex === 0 ? styles.bottomSheetTitleCentered : styles.bottomSheetTitleLeft,
            ]}>
              <Text style={[
                styles.bottomSheetTitle,
                bottomSheetIndex === 0 && styles.bottomSheetTitleCenteredText
              ]}>
                {selectedPlace.name}
              </Text>
              <View style={bottomSheetIndex === 0 && styles.bottomSheetButtonContainer}>
                <TouchableOpacity style={styles.bottomSheetButton}>
                  <Image source={require('../../../assets/images/map/likes-active.png')} style={styles.bottomSheetLikesButton}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomSheetButton}>
                  <Image source={require('../../../assets/images/map/visited-active.png')} style={styles.bottomSheetVisitedButton}/>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.bottomSheetAddressContainer}>
              <Text style={styles.bottomSheetAddress}>{selectedPlace.address}</Text>
            </View>

            <Text style={styles.bottomSheetDescription}>{selectedPlace.description}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseBottomSheet}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
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
    fontFamily: 'AggroL',
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
    fontFamily: 'AggroM',
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
    width: 100,
    height: 30,
    borderRadius: 10,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLikes: {
    backgroundColor: 'white',
    width: 80,
    height: 30,
    borderRadius: 10,
    marginLeft: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontFamily: 'AggroL',
  },
  buttonVisitedIcon: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
  buttonLikesIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 20,
  },
  bottomSheetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  bottomSheetTitleLeft: {
    justifyContent: 'flex-start',
  },
  bottomSheetTitleCentered: {
    justifyContent: 'center',
    alignItems: 'flex-start',

  },
  bottomSheetButtonContainer: {
    flexDirection: 'row',
  },
  bottomSheetTitle: {
    fontFamily: 'AggroM',
    fontSize: 24,
    flex: 1,
  },
  bottomSheetTitleCenteredText: {
    textAlign: 'center',
  },
  bottomSheetButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetLikesButton: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  bottomSheetVisitedButton: {
    width: 30,
    height: 30,
  },
  bottomSheetAddressContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  bottomSheetAddress: {
    fontFamily: 'AggroL',
    fontSize: 18,
  },
  bottomSheetDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#0047A0',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ThemeScreen;

