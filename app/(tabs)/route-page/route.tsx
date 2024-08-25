import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { useRouter } from 'expo-router';

const RouteScreen = () => {
  const router = useRouter();


  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },

});

export default RouteScreen;
