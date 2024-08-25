import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';  // .env 파일에서 API 키 가져오기

const RouteScreen = () => {
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    const getDirections = async () => {
      const origin = '37.78825,-122.4324'; // 출발지 위도, 경도
      const destination = '37.7749,-122.4194'; // 도착지 위도, 경도
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_MAPS_API_KEY}`;

      try {
        const response = await axios.get(url);
        const points = response.data.routes[0].overview_polyline.points;
        const routeCoords = decodePolyline(points);
        setRouteCoords(routeCoords);
      } catch (error) {
        console.error(error);
      }
    };

    getDirections();
  }, []);

  const decodePolyline = (t: string, e = 5) => {
    let points: { latitude: number; longitude: number }[] = [];
    for (let step = 0, lat = 0, lon = 0; step < t.length;) {
      let res = 1, shift = 0, dlat = 0, lngShift = 0, dlng = 0;
      do res |= (t.charCodeAt(step++) - 63) << shift, shift += 5;
      while (res >= 0x20);
      dlat += res & 1 ? ~(res >> 1) : res >> 1;
      lat += dlat;

      res = 1, shift = 0;
      do res |= (t.charCodeAt(step++) - 63) << shift, shift += 5;
      while (res >= 0x20);
      dlng += res & 1 ? ~(res >> 1) : res >> 1;
      lon += dlng;

      points.push({ latitude: lat / 1e5, longitude: lon / 1e5 });
    }
    return points;
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
      >
        <Marker coordinate={{ latitude: 37.78825, longitude: -122.4324 }} />
        <Marker coordinate={{ latitude: 37.7749, longitude: -122.4194 }} />
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default RouteScreen;