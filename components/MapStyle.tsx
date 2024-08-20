import { MapStyleElement } from 'react-native-maps';

const mapStyle: MapStyleElement[] = [
  {
    elementType: 'geometry.fill',
    stylers: [{ color: '#DDDDDD' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#000000' }],
  },
  {
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ffffff' }],
  },
  // 추가적인 스타일 설정
];

export default mapStyle;
