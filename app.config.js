import 'dotenv/config';

export default {
  expo: {
    name: "Tourmate",
    version: "1.0.0",
    userInterfaceStyle: "light",
    extra: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: "96d12d73-2170-4263-b8ff-e93b3257923c"
      }
    },
    // 나머지 기존 설정 유지
  },
};
