import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, TextInput, Button, useColorScheme, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Font from 'expo-font';
import { HelloWave } from '@/components/HelloWave';

const LuggageScreen = () => {
    const router = useRouter();
  
    return (
        <>
        <Stack.Screen options={{ headerShown: false }} />
        <Text>뀨</Text>
        </>
    );
};

const styles = StyleSheet.create({
    
  });

export default LuggageScreen;
