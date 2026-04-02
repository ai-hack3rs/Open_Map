import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { MapBase } from '../components/MapBase';
import { FloatingSearch } from '../components/FloatingSearch';
import { FloatingActionMenu } from '../components/FloatingActionMenu';
import { SaaSBottomSheet } from '../components/SaaSBottomSheet';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* 1. Base Map Layer */}
      <MapBase />

      {/* 2. Floating UI Overlays with Antigravity */}
      <FloatingSearch />
      <FloatingActionMenu />
      <SaaSBottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
