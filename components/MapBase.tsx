import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import { CARTO_DARK_STYLE_URL } from '../constants/mapConfig';

// Suppress the default MapLibre telemetry opt-in prompt
MapLibreGL.setAccessToken(null);

export const MapBase = () => {
  return (
    <View style={styles.container}>
      <MapLibreGL.MapView
        style={styles.map}
        mapStyle={CARTO_DARK_STYLE_URL}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
      >
        <MapLibreGL.Camera
          defaultSettings={{
            centerCoordinate: [-122.4324, 37.78825],
            zoomLevel: 12,
          }}
        />
        <MapLibreGL.UserLocation
          visible={true}
          animated={true}
          renderMode={MapLibreGL.UserLocationRenderMode.Normal}
        />
      </MapLibreGL.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
