import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { LanguageProvider } from '@/components/LanguageProvider';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <LanguageProvider>
        <Stack>
          <Stack.Screen 
            name="Splash"
            options={{ headerShown: false }}
            />
          <Stack.Screen
            name="(tabs)/user/login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)/user/sign-up"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/home"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/favorites-page/favorites"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/theme-page/theme"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/theme-page/day"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/theme-page/withWho"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/theme-page/budget"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/luggage-page/luggage"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/my-page/mypage"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/my-page/passwordChange"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="(tabs)/my-page/language"
            options={{ headerShown: false }} 
          />
          <Stack.Screen
            name="@/components/bottomTabNavigator"
            options={{ headerShown: false }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      </LanguageProvider>
    </ThemeProvider>

  );
}
