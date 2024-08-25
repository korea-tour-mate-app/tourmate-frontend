import 'dotenv/config';

export default {
  expo: {
    name: "Tourmate",
    version: "1.0.0",
    userInterfaceStyle: "light",
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      tMapApiKey: process.env.T_MAP_API_KEY,  // T-Map API 키 추가
    },
    // 나머지 기존 설정 유지
  },
};
