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
  address: String;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

function ThemeScreen() {
  const [location, setLocation] = useState<LocationType | undefined>();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const bottomSheetRef = React.useRef<BottomSheet>(null);

  // 미리 정의된 장소 목록
  const places: Place[] = [
    { id: 1, name: '경복궁', description: '서울의 대표 고궁', address: '서울시 종로구', coordinate: { latitude: 37.5796, longitude: 126.9794 } },
    { id: 2, name: '명동', description: '서울의 쇼핑 거리', address: '서울시 어딘가',coordinate: { latitude: 37.5636, longitude: 126.9858 } },
    { id: 3, name: '남산타워', description: '서울의 랜드마크',address: '서울시에 있겠지 용산구 그 어딘가 산 속에', coordinate: { latitude: 37.5512, longitude: 126.9882 } },
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

  const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined; // 구글 맵을 사용하는 경우
  const isGoogleMap = Platform.OS === 'android' || mapProvider === PROVIDER_GOOGLE;

  const handleFilterPress = (filter: string) => {
    setActiveFilter(prev => prev === filter ? null : filter);
  };

  const handleMarkerPress = (place: Place) => {
    setSelectedPlace(place);
    bottomSheetRef.current?.expand(); // 선택된 장소가 있을 때 바텀 시트를 열도록 설정
  };

  const handleCloseBottomSheet = useCallback(() => {
    setSelectedPlace(null); // 바텀 시트가 닫힐 때 선택된 장소를 null로 설정
    bottomSheetRef.current?.close();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      {location && (
        <MapView
          provider={isGoogleMap ? PROVIDER_GOOGLE : undefined} // 구글 맵을 사용하는 경우
          style={styles.map}
          initialRegion={location}
          customMapStyle={isGoogleMap ? mapStyle : undefined} // 구글 맵일 때만 스타일 적용
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
          <TouchableOpacity
            style={[styles.filterButton, activeFilter === 'K-pop' && styles.activeFilterButton]}
            onPress={() => handleFilterPress('K-pop')}
          >
            <Text style={[styles.filterText, activeFilter === 'K-pop' && styles.activeFilterText]}>K-pop</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilter === '고궁' && styles.activeFilterButton]}
            onPress={() => handleFilterPress('고궁')}
          >
            <Text style={[styles.filterText, activeFilter === '고궁' && styles.activeFilterText]}>고궁</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilter === '템플스테이' && styles.activeFilterButton]}
            onPress={() => handleFilterPress('템플스테이')}
          >
            <Text style={[styles.filterText, activeFilter === '템플스테이' && styles.activeFilterText]}>템플스테이</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilter === '식도락' && styles.activeFilterButton]}
            onPress={() => handleFilterPress('식도락')}
          >
            <Text style={[styles.filterText, activeFilter === '식도락' && styles.activeFilterText]}>식도락</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, activeFilter === '레저스포츠' && styles.activeFilterButton]}
            onPress={() => handleFilterPress('레저스포츠')}
          >
            <Text style={[styles.filterText, activeFilter === '레저스포츠' && styles.activeFilterText]}>레저스포츠</Text>
          </TouchableOpacity>
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
        ref={bottomSheetRef} // BottomSheet 참조를 설정합니다.
        index={-1} // 초기 상태가 닫힌 상태
        snapPoints={['80%', '25%']} // 유효한 snap points
        enablePanDownToClose={true} // 아래로 스와이프하여 닫기 가능
        onChange={(index) => {
          if (index === -1) {
            setSelectedPlace(null); // 바텀 시트가 닫힐 때 선택된 장소를 null로 설정
          }
        }}
      >
        {selectedPlace && (
          <View style={styles.bottomSheetContainer}>
            <View style={styles.bottomSheetTitleContainer}>
            <Text style={styles.bottomSheetTitle}>{selectedPlace.name}</Text>
              <TouchableOpacity>
              <Image source={require('../../../assets/images/map/likes-active.png')} style={styles.bottomSheetLikesButton}></Image>
              </TouchableOpacity>
              <TouchableOpacity>
              <Image source={require('../../../assets/images/map/visited-active.png')} style={styles.bottomSheetVisitedButton}></Image>
              </TouchableOpacity>
              <View style={styles.bottomSheetAddressContainer}>
              <Text style={styles.bottomSheetAddress}>{selectedPlace.address}</Text>
              </View>
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
  themeMarker: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  filterContainer: {
    position: 'absolute',
    top: 55,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  filterScrollView: {
    maxHeight: 50,
  },
  filterButton: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterButton: {
    borderBottomColor: '#0047A0',
  },
  filterText: {
    color: 'black',
    fontSize: 16,
  },
  activeFilterText: {
    color: '#0047A0',
    fontFamily: 'AggroM',
    fontSize: 15,
  },
  buttonContainer: {
    position: 'absolute',
    top: 100,
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

  bottomSheetTitleContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 15,
  },
  bottomSheetTitle: {
    fontFamily: 'AggroM',
    fontSize: 24,
  },
  bottomSheetLikesButton:{
    marginLeft: 10,
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  bottomSheetVisitedButton:{
    marginLeft: 10,
    width: 30,
    height: 30,
  },
  bottomSheetAddressContainer:{
    width: 200,
  },
  bottomSheetAddress: {
    fontFamily: 'AggroL',
    fontSize: 18,
    marginLeft: 20,
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
