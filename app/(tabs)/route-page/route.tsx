import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Constants from 'expo-constants';

const RouteScreen = () => {
  const tMapApiKey = Constants.expoConfig?.extra?.tMapApiKey; // T-Map API 키 가져오기

  useEffect(() => {
    const fetchRouteOptimization = async () => {
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
            'accept': 'application/json',  // 원하는 응답 포맷 지정
          },
          body: JSON.stringify({
            reqCoordType: "WGS84GEO", // 요청 좌표 타입
            resCoordType: "WGS84GEO", // 응답 좌표 타입
            startName: encodeURIComponent("출발"),  // 출발지 명칭 (UTF-8 인코딩)
            startX: "126.977613738705",  // 출발지 경도
            startY: "37.56523875839218",  // 출발지 위도
            startTime: "202401011200", // 출발 시간 (YYYYMMDDHHMM 형식)
            endName: encodeURIComponent("도착"),  // 목적지 명칭 (UTF-8 인코딩)
            endX: "127.12668555134137",  // 목적지 경도
            endY: "37.42007356038663",  // 목적지 위도
            searchOption: "0",  // 경로 탐색 옵션 (기본값: 0: 교통최적+추천(기본값)
            carType: "1",  // 차량 종류 (1: 승용차)
            viaPoints: [
              { 
                viaPointId: "test01",
                viaPointName: "경유지1",
                viaX: "127.000", 
                viaY: "37.570"
              },
              { 
                viaPointId: "test02",
                viaPointName: "경유지2",
                viaX: "127.00221495976581", 
                viaY: "37.56568310756034"
              },
            ]
          }),
        });

        const data = await response.json();
        console.log('T-Map API 응답:', data);
      } catch (error) {
        console.error('T-Map API 호출 중 오류 발생:', error);
      }
    };

    fetchRouteOptimization();
  }, [tMapApiKey]);

  return (
    <View style={styles.container}>
      <Text>T-Map API 경유지 순서 최적화 중...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default RouteScreen;