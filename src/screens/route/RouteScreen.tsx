import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
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
  // const [selectedDay, setSelectedDay] = useState("1일차");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // 현재 선택된 일차 (0일차부터 시작)
  const [selectedLocation, setSelectedLocation] = useState({ latitude: 40.54523875839218, longitude: 126.977613738705 });
  const [routeInfoByDay, setRouteInfoByDay] = useState<{ [day: string]: Omit<RouteOptResponseDto, 'paths'> }>({});
  const [mapPathsByDay, setMapPathsByDay] = useState<{ [day: string]: RouteOptResponseDto['paths'] }>({});
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

  const dayCount = Number(contextSelectedDay.at(-1)); // 며칠동안 여행을 가는지
  // const dayCount = contextSelectedDay[contextSelectedDay.length - 1]; // 같은 표현 // 마지막 값으로 여행 일 수 계산
  console.log("여행일수는? ", dayCount);
  // const dayCount = 1; // 일단 api 호출은 한번으로 고정

  useEffect(() => {
    // let isMounted = true; // 컴포넌트 마운트 여부 추적

    const fetchRouteDataForEachDay = async () => {
      try {
        const newRouteInfoByDay: { [day: string]: Omit<RouteOptResponseDto, 'paths'> } = {};
        const newMapPathsByDay: { [day: string]: RouteOptResponseDto['paths'] } = {};

        // 각 날짜에 대해 API 호출
        for (let i = 0; i < dayCount; i++) {
          // TODO 데이터는 모델API에서 받아오는 걸로 나중에 수정
          // const requestBody = {
          //   startName: "숭례문", // ex. modelData[i][startName] 형태
          //   startX: "126.975208",
          //   startY: "37.561004",
          //   startTime: "202408251200",
          //   endName: "운현궁",
          //   endX: "126.985512",
          //   endY: "37.574385",
          //   viaPoints: [
          //     { viaPointId: "test01", viaPointName: "경복궁", viaX: "126.976889", viaY: "37.579617" },
          //     { viaPointId: "test02", viaPointName: "창덕궁", viaX: "126.991898", viaY: "37.579620" },
          //     { viaPointId: "test03", viaPointName: "남산서울타워", viaX: "126.988205", viaY: "37.551169" }
          //   ]
          // };

          // const response = await axios.post('http://10.0.2.2:8080/api/tmap/optimize-route', requestBody);

          const response = {
            "totalDistance": "5816",
            "totalTime": "1765",
            "totalFare": "0",
            "visitPlaces": [
              {
                "order": "0",
                "name": "숭례문",
                "latitude": 37.56100478,
                "longitude": 126.97520759
              },
              {
                "order": "1",
                "name": "운현궁",
                "latitude": 37.57438674,
                "longitude": 126.98551183
              },
              {
                "order": "2",
                "name": "경복궁",
                "latitude": 37.57961653,
                "longitude": 126.97688746
              }
            ],
            "paths": [
              {
                "coordinates": [
                  [
                    37.56085202,
                    126.97554923
                  ],
                  [
                    37.56085202,
                    126.97554923
                  ],
                  [
                    37.56076037,
                    126.97549646
                  ],
                  [
                    37.56071593,
                    126.97546313
                  ],
                  [
                    37.56067982,
                    126.97536314
                  ],
                  [
                    37.56063816,
                    126.97525482
                  ],
                  [
                    37.56062427,
                    126.97514927
                  ],
                  [
                    37.56060204,
                    126.97484652
                  ],
                  [
                    37.5606437,
                    126.9747132
                  ],
                  [
                    37.56071313,
                    126.97454099
                  ],
                  [
                    37.56103531,
                    126.97388271
                  ],
                  [
                    37.561863,
                    126.97453818
                  ],
                  [
                    37.56204076,
                    126.97467983
                  ],
                  [
                    37.56206298,
                    126.97469094
                  ],
                  [
                    37.5620852,
                    126.97469649
                  ],
                  [
                    37.5621102,
                    126.97469927
                  ],
                  [
                    37.5622574,
                    126.97469371
                  ],
                  [
                    37.56246293,
                    126.97466871
                  ],
                  [
                    37.56248793,
                    126.97465482
                  ],
                  [
                    37.56254348,
                    126.97460205
                  ],
                  [
                    37.56263791,
                    126.97449094
                  ],
                  [
                    37.56269901,
                    126.97441595
                  ],
                  [
                    37.56306841,
                    126.97416874
                  ],
                  [
                    37.56329617,
                    126.97473812
                  ],
                  [
                    37.5634045,
                    126.97501309
                  ],
                  [
                    37.56391557,
                    126.9763324
                  ],
                  [
                    37.56401834,
                    126.97662126
                  ],
                  [
                    37.56403501,
                    126.97668792
                  ],
                  [
                    37.56404056,
                    126.9767768
                  ],
                  [
                    37.56399891,
                    126.97702401
                  ],
                  [
                    37.56437664,
                    126.97715732
                  ],
                  [
                    37.56460717,
                    126.97723786
                  ],
                  [
                    37.56467939,
                    126.97725174
                  ],
                  [
                    37.56494325,
                    126.97730173
                  ],
                  [
                    37.56510989,
                    126.97732395
                  ],
                  [
                    37.56518766,
                    126.97733228
                  ],
                  [
                    37.56526821,
                    126.97733505
                  ],
                  [
                    37.56535987,
                    126.97733783
                  ],
                  [
                    37.56558484,
                    126.97732949
                  ],
                  [
                    37.56623754,
                    126.97727392
                  ],
                  [
                    37.56703745,
                    126.97725168
                  ],
                  [
                    37.5672402,
                    126.97724612
                  ],
                  [
                    37.56801233,
                    126.9772211
                  ],
                  [
                    37.5687928,
                    126.97722941
                  ],
                  [
                    37.56901499,
                    126.97723496
                  ],
                  [
                    37.56925941,
                    126.9772405
                  ],
                  [
                    37.56947883,
                    126.97724327
                  ],
                  [
                    37.56965381,
                    126.97724049
                  ],
                  [
                    37.56981212,
                    126.97723771
                  ],
                  [
                    37.56994544,
                    126.97724048
                  ],
                  [
                    37.57006487,
                    126.97724326
                  ],
                  [
                    37.57012042,
                    126.97724603
                  ],
                  [
                    37.57030096,
                    126.97724881
                  ],
                  [
                    37.57088978,
                    126.97727379
                  ],
                  [
                    37.57151471,
                    126.9772821
                  ],
                  [
                    37.57163414,
                    126.9772821
                  ],
                  [
                    37.57189799,
                    126.97727654
                  ],
                  [
                    37.57225906,
                    126.97727097
                  ],
                  [
                    37.5725868,
                    126.97725985
                  ],
                  [
                    37.57262013,
                    126.97725707
                  ],
                  [
                    37.57272845,
                    126.97724874
                  ],
                  [
                    37.57285066,
                    126.97723762
                  ],
                  [
                    37.57342559,
                    126.97722928
                  ],
                  [
                    37.57426438,
                    126.97721536
                  ],
                  [
                    37.57440326,
                    126.97721258
                  ],
                  [
                    37.57479766,
                    126.97720424
                  ],
                  [
                    37.57516983,
                    126.97719867
                  ],
                  [
                    37.57520039,
                    126.97725978
                  ],
                  [
                    37.57525038,
                    126.97736254
                  ],
                  [
                    37.57544759,
                    126.9776514
                  ],
                  [
                    37.57552258,
                    126.97780694
                  ],
                  [
                    37.57557258,
                    126.97797915
                  ],
                  [
                    37.57560869,
                    126.97833745
                  ],
                  [
                    37.57566147,
                    126.97886517
                  ],
                  [
                    37.57572814,
                    126.97924014
                  ],
                  [
                    37.57577258,
                    126.97945123
                  ],
                  [
                    37.57583925,
                    126.97987063
                  ],
                  [
                    37.57584203,
                    126.97996507
                  ],
                  [
                    37.57582815,
                    126.98019838
                  ],
                  [
                    37.57575316,
                    126.98081499
                  ],
                  [
                    37.57565874,
                    126.98146771
                  ],
                  [
                    37.57557265,
                    126.98201489
                  ],
                  [
                    37.57552266,
                    126.98242041
                  ],
                  [
                    37.57550045,
                    126.98270927
                  ],
                  [
                    37.5754949,
                    126.98283982
                  ],
                  [
                    37.57548934,
                    126.98293147
                  ],
                  [
                    37.57550323,
                    126.9830398
                  ],
                  [
                    37.57553379,
                    126.98319534
                  ],
                  [
                    37.57555879,
                    126.983287
                  ],
                  [
                    37.57557823,
                    126.98335366
                  ],
                  [
                    37.57563934,
                    126.98349809
                  ],
                  [
                    37.57572266,
                    126.98366751
                  ],
                  [
                    37.57590321,
                    126.98408969
                  ],
                  [
                    37.57598653,
                    126.98430078
                  ],
                  [
                    37.57606986,
                    126.98449798
                  ],
                  [
                    37.57623651,
                    126.9848535
                  ],
                  [
                    37.57651705,
                    126.985434
                  ],
                  [
                    37.57657815,
                    126.98557009
                  ],
                  [
                    37.57665315,
                    126.9857173
                  ],
                  [
                    37.5766837,
                    126.98590339
                  ],
                  [
                    37.57668926,
                    126.98600061
                  ],
                  [
                    37.57668926,
                    126.98605616
                  ],
                  [
                    37.57668093,
                    126.98609782
                  ],
                  [
                    37.5766726,
                    126.98613115
                  ],
                  [
                    37.57665593,
                    126.98616448
                  ],
                  [
                    37.57658928,
                    126.98624225
                  ],
                  [
                    37.5765615,
                    126.98625336
                  ],
                  [
                    37.57655039,
                    126.98625336
                  ],
                  [
                    37.57653928,
                    126.98625336
                  ],
                  [
                    37.57643096,
                    126.98623392
                  ],
                  [
                    37.57640041,
                    126.98623393
                  ],
                  [
                    37.57637541,
                    126.9862367
                  ],
                  [
                    37.57628376,
                    126.98626726
                  ],
                  [
                    37.57622543,
                    126.9862867
                  ],
                  [
                    37.5757616,
                    126.98644504
                  ],
                  [
                    37.57567272,
                    126.98647837
                  ],
                  [
                    37.57561995,
                    126.98649781
                  ],
                  [
                    37.57499503,
                    126.98674225
                  ],
                  [
                    37.57496447,
                    126.98675336
                  ],
                  [
                    37.5748756,
                    126.98679225
                  ],
                  [
                    37.57456175,
                    126.98693114
                  ],
                  [
                    37.57453397,
                    126.98679226
                  ],
                  [
                    37.57449508,
                    126.98659784
                  ],
                  [
                    37.57442008,
                    126.98623954
                  ],
                  [
                    37.5743812,
                    126.98604233
                  ],
                  [
                    37.5743562,
                    126.98593123
                  ],
                  [
                    37.57417288,
                    126.98557294
                  ],
                  [
                    37.57432564,
                    126.98543961
                  ]
                ],
                "name": "[0] 운현궁"
              },
              {
                "coordinates": [
                  [
                    37.57432564,
                    126.98543961
                  ],
                  [
                    37.57417288,
                    126.98557294
                  ],
                  [
                    37.5743562,
                    126.98593123
                  ],
                  [
                    37.5743812,
                    126.98604233
                  ],
                  [
                    37.57442008,
                    126.98623954
                  ],
                  [
                    37.57449508,
                    126.98659784
                  ],
                  [
                    37.57453397,
                    126.98679226
                  ],
                  [
                    37.57456175,
                    126.98693114
                  ],
                  [
                    37.5741618,
                    126.98714502
                  ],
                  [
                    37.57410347,
                    126.98717835
                  ],
                  [
                    37.57369241,
                    126.987445
                  ],
                  [
                    37.57355632,
                    126.98753111
                  ],
                  [
                    37.57348966,
                    126.98757
                  ],
                  [
                    37.57322858,
                    126.98767555
                  ],
                  [
                    37.57317303,
                    126.98769777
                  ],
                  [
                    37.57310082,
                    126.98770888
                  ],
                  [
                    37.57302305,
                    126.98772
                  ],
                  [
                    37.57284807,
                    126.98770334
                  ],
                  [
                    37.57260088,
                    126.98767835
                  ],
                  [
                    37.57250644,
                    126.98766446
                  ],
                  [
                    37.57190929,
                    126.98757004
                  ],
                  [
                    37.57175653,
                    126.98755338
                  ],
                  [
                    37.57156766,
                    126.98753394
                  ],
                  [
                    37.57114827,
                    126.98753951
                  ],
                  [
                    37.57093162,
                    126.98754229
                  ],
                  [
                    37.57062055,
                    126.98756452
                  ],
                  [
                    37.57055945,
                    126.9875673
                  ],
                  [
                    37.57027337,
                    126.98758398
                  ],
                  [
                    37.57027337,
                    126.98752009
                  ],
                  [
                    37.57027335,
                    126.98685904
                  ],
                  [
                    37.57026779,
                    126.98608411
                  ],
                  [
                    37.57026222,
                    126.98563415
                  ],
                  [
                    37.57026222,
                    126.98531474
                  ],
                  [
                    37.57025942,
                    126.98440927
                  ],
                  [
                    37.57025664,
                    126.98408152
                  ],
                  [
                    37.57025385,
                    126.98333436
                  ],
                  [
                    37.57025107,
                    126.98303995
                  ],
                  [
                    37.57025384,
                    126.98289829
                  ],
                  [
                    37.57026494,
                    126.98240945
                  ],
                  [
                    37.57025937,
                    126.98123733
                  ],
                  [
                    37.57026492,
                    126.98106235
                  ],
                  [
                    37.570276,
                    126.97971525
                  ],
                  [
                    37.57028155,
                    126.97929862
                  ],
                  [
                    37.57048153,
                    126.97930139
                  ],
                  [
                    37.57112034,
                    126.97930971
                  ],
                  [
                    37.57125922,
                    126.9793097
                  ],
                  [
                    37.57139809,
                    126.97930414
                  ],
                  [
                    37.57142309,
                    126.97930137
                  ],
                  [
                    37.57150919,
                    126.97929859
                  ],
                  [
                    37.57231187,
                    126.97926245
                  ],
                  [
                    37.5724563,
                    126.9792569
                  ],
                  [
                    37.57248129,
                    126.97895137
                  ],
                  [
                    37.57251184,
                    126.97883471
                  ],
                  [
                    37.5725785,
                    126.97869028
                  ],
                  [
                    37.57260905,
                    126.97865695
                  ],
                  [
                    37.5726646,
                    126.97859584
                  ],
                  [
                    37.57267571,
                    126.97859584
                  ],
                  [
                    37.57268404,
                    126.97859584
                  ],
                  [
                    37.57269515,
                    126.97859306
                  ],
                  [
                    37.57270626,
                    126.97859028
                  ],
                  [
                    37.57271737,
                    126.97858195
                  ],
                  [
                    37.57272848,
                    126.97857362
                  ],
                  [
                    37.57273959,
                    126.97856251
                  ],
                  [
                    37.57287846,
                    126.97855417
                  ],
                  [
                    37.5731201,
                    126.97854305
                  ],
                  [
                    37.57362282,
                    126.97852082
                  ],
                  [
                    37.57424774,
                    126.9784958
                  ],
                  [
                    37.57426163,
                    126.97850414
                  ],
                  [
                    37.57428663,
                    126.97851524
                  ],
                  [
                    37.57428941,
                    126.97853191
                  ],
                  [
                    37.57429218,
                    126.97854857
                  ],
                  [
                    37.57429774,
                    126.97856524
                  ],
                  [
                    37.57430329,
                    126.97857913
                  ],
                  [
                    37.57431163,
                    126.97859024
                  ],
                  [
                    37.57431718,
                    126.97859579
                  ],
                  [
                    37.57432551,
                    126.9786069
                  ],
                  [
                    37.57433662,
                    126.97861523
                  ],
                  [
                    37.57434773,
                    126.97862079
                  ],
                  [
                    37.5743644,
                    126.97862634
                  ],
                  [
                    37.57437551,
                    126.97862912
                  ],
                  [
                    37.57438662,
                    126.97862912
                  ],
                  [
                    37.57440328,
                    126.97862356
                  ],
                  [
                    37.57441717,
                    126.97861801
                  ],
                  [
                    37.57442828,
                    126.97861245
                  ],
                  [
                    37.57443939,
                    126.97860412
                  ],
                  [
                    37.5744505,
                    126.97859301
                  ],
                  [
                    37.57445883,
                    126.9785819
                  ],
                  [
                    37.57446439,
                    126.97856524
                  ],
                  [
                    37.57453382,
                    126.97854857
                  ],
                  [
                    37.57463103,
                    126.97857634
                  ],
                  [
                    37.57473658,
                    126.97862078
                  ],
                  [
                    37.57477546,
                    126.978643
                  ],
                  [
                    37.57497266,
                    126.97878742
                  ],
                  [
                    37.57501155,
                    126.97882353
                  ],
                  [
                    37.57503377,
                    126.97884575
                  ],
                  [
                    37.57530874,
                    126.97911794
                  ],
                  [
                    37.57538373,
                    126.97919848
                  ],
                  [
                    37.57551983,
                    126.97934847
                  ],
                  [
                    37.57567259,
                    126.97940957
                  ],
                  [
                    37.57577258,
                    126.97945123
                  ],
                  [
                    37.57591423,
                    126.97951233
                  ],
                  [
                    37.57605866,
                    126.97955399
                  ],
                  [
                    37.57616976,
                    126.97957065
                  ],
                  [
                    37.57639473,
                    126.97957064
                  ],
                  [
                    37.5767197,
                    126.97957341
                  ],
                  [
                    37.57675858,
                    126.97957341
                  ],
                  [
                    37.57679191,
                    126.97957341
                  ],
                  [
                    37.57713354,
                    126.97957896
                  ],
                  [
                    37.57786123,
                    126.97960116
                  ],
                  [
                    37.57793067,
                    126.97960393
                  ],
                  [
                    37.57823897,
                    126.97962614
                  ],
                  [
                    37.57876946,
                    126.9796539
                  ],
                  [
                    37.57908609,
                    126.97967334
                  ],
                  [
                    37.5792944,
                    126.97973166
                  ],
                  [
                    37.57969158,
                    126.97983997
                  ],
                  [
                    37.57989711,
                    126.97990663
                  ],
                  [
                    37.57991377,
                    126.97982052
                  ],
                  [
                    37.57950271,
                    126.97968443
                  ],
                  [
                    37.57909442,
                    126.97957612
                  ]
                ],
                "name": "[0] 경복궁"
              }
            ]
          }
          
          // if (!isMounted) return; // 컴포넌트가 언마운트된 경우 종료
          // console.log(`Day ${i + 1} route data:`, response.data);
          console.log(`Day ${i + 1} route data:`, response);

          const { totalDistance, totalTime, totalFare, visitPlaces, paths } = response;
          // const { totalDistance, totalTime, totalFare, visitPlaces, paths } = response;

          const dayKey = `Day ${i + 1}`;

          newRouteInfoByDay[dayKey] = { totalDistance, totalTime, totalFare, visitPlaces };
          newMapPathsByDay[dayKey] = paths;
        }

        setRouteInfoByDay(newRouteInfoByDay);
        setMapPathsByDay(newMapPathsByDay);
      } catch (error) {
        console.error('Error fetching route data:', error);
        Alert.alert('Error', '경로 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
      }
    };

    fetchRouteDataForEachDay();

    return () => {
      // isMounted = false; // 컴포넌트 언마운트 시 플래그 변경
    };
  }, []); // useEffect 의존성 배열 추가

  const handleLocationPress = (latitude: number, longitude: number) => {
    if (mapRef.current) { // ref가 있을 때만 실행
      mapRef.current.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) { // ref가 있을 때만 실행
      mapRef.current?.getCamera().then((camera) => {
        camera.zoom += 1; // 줌 인
        mapRef.current?.animateCamera(camera);
      });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) { // ref가 있을 때만 실행
      mapRef.current?.getCamera().then((camera) => {
        camera.zoom -= 1; // 줌 아웃
        mapRef.current?.animateCamera(camera);
      });
    }
  };

  const renderDayView = (dayKey: string) => {
    const routeInfo = routeInfoByDay[dayKey];
    if (!routeInfo) return null;

    return (
      <ScrollView contentContainerStyle={styles.dayContainer}>
        {Array.isArray(routeInfo.visitPlaces) && routeInfo.visitPlaces.map((place, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.timeline}>
              <Text style={styles.timelineText}>{index + 1}</Text>
              {index < routeInfo.visitPlaces.length - 1 && (
                <>
                  <Image
                    source={selectedVehicle === 0
                      ? require('../../assets/images/route/timeline-bus.png')
                      : require('../../assets/images/route/timeline-car.png')}
                    style={styles.timelineIcon}
                  />
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
  };

  // 날짜 계산 함수
  const getCalculatedDate = (baseDate: string, index: number): string => {
    // baseDate는 "24.10.1" 형식이므로, 이를 분리해서 계산
    const [year, month, day] = baseDate.split('.').map(Number);  // 숫자로 변환
    const newDay = day + index;  // index만큼 더한 날짜
    return `${year}.${month}.${newDay}`;  // 새로운 날짜 반환
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
      >

        {/* 장소 마커 찍기 */}
        {routeInfoByDay[`Day ${selectedDayIndex + 1}`]?.visitPlaces?.map((place, index) => {
          // 장소 번호와 현재 일수에 따라 미리 로드된 이미지 경로 설정
          let markerImage;
          
          switch (selectedDayIndex) {
            case 0: // Day 1
              if (index === 0) markerImage = require('../../assets/images/route/marker/1_r.png');
              else if (index === 1) markerImage = require('../../assets/images/route/marker/2_r.png');
              else if (index === 2) markerImage = require('../../assets/images/route/marker/3_r.png');
              else if (index === 3) markerImage = require('../../assets/images/route/marker/4_r.png');
              else if (index === 4) markerImage = require('../../assets/images/route/marker/5_r.png');
              else if (index === 5) markerImage = require('../../assets/images/route/marker/6_r.png');
              break;
            case 1: // Day 2
              if (index === 0) markerImage = require('../../assets/images/route/marker/1_o.png');
              else if (index === 1) markerImage = require('../../assets/images/route/marker/2_o.png');
              else if (index === 2) markerImage = require('../../assets/images/route/marker/3_o.png');
              else if (index === 3) markerImage = require('../../assets/images/route/marker/4_o.png');
              else if (index === 4) markerImage = require('../../assets/images/route/marker/5_o.png');
              else if (index === 5) markerImage = require('../../assets/images/route/marker/6_r.png');
              break;
            case 2: // Day 3
            default:
              if (index === 0) markerImage = require('../../assets/images/route/marker/1_y.png');
              else if (index === 1) markerImage = require('../../assets/images/route/marker/2_y.png');
              else if (index === 2) markerImage = require('../../assets/images/route/marker/3_y.png');
              else if (index === 3) markerImage = require('../../assets/images/route/marker/4_y.png');
              else if (index === 4) markerImage = require('../../assets/images/route/marker/5_y.png');
              else if (index === 5) markerImage = require('../../assets/images/route/marker/6_r.png');
              break;
          }
          
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(place.latitude.toString()) || 0,
                longitude: parseFloat(place.longitude.toString()) || 0
              }}
              title={`${index + 1}. ${place.name}`} // 순서와 장소명 함께 표시
              image={markerImage} // 마커 이미지 설정
            >
              <Callout>
                <Text>{place.name || "Unnamed Place"}</Text>
              </Callout>
            </Marker>
          );
        })}

        {/* 경로 그리기 */}
        {mapPathsByDay[`Day ${selectedDayIndex + 1}`]?.map((path, index) => (
          <Polyline
            key={index}
            coordinates={path.coordinates.map(([latitude, longitude]) => ({
              latitude,
              longitude,
            }))}
            
            strokeColor="#000000"  // 경로 색상
            strokeWidth={4}  // 경로 두께
            />
          ))}
      </MapView>

      <View style={styles.zoomButtonsContainer}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Text style={styles.zoomButtonText}>-</Text>
        </TouchableOpacity>
      </View>

      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={['10%', '50%', '90%']}>
        <View style={styles.bottomSheetHeader}>
          {Array.from({ length: dayCount }).map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedDayIndex(index)}
              style={[styles.dayButton, selectedDayIndex === index && styles.selectedDayButton]}
            >
              <Text style={selectedDayIndex === index ? styles.selectedDayText : styles.dayButtonText}>
                {`Day ${index + 1}`}  
              </Text>
            </TouchableOpacity>
          ))}
        </View>
          {renderDayView(`Day ${selectedDayIndex + 1}`)}

          {/* 선택된 날짜를 우측 하단에 표시 */}
          <View style={{ position: 'absolute', bottom: 650, right: 50 }}>
            {typeof contextSelectedDay[0] === 'string' && (
              <Text>{getCalculatedDate(contextSelectedDay[0] as string, selectedDayIndex)}</Text>
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
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
    elevation: 5,
    shadowColor: 'black',
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
