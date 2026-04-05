import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { APP_THEME } from '../constants/mapConfig';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | 'systemThickMaterialDark';
  testID?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  style,
  intensity = 30, // Moderate blur intensity
  tint = 'dark',
  testID,
}) => {
  return (
    <View style={[styles.shadowContainer, style]} testID={testID}>
      {/* 
        experimentalBlurMethod is supported in newer Expo versions (like the SDK 50+)
        to enable highly accurate glassmorphism on Android. Look for "dimezisBlurView".
      */}
      <BlurView
        intensity={intensity}
        tint={tint}
        experimentalBlurMethod="dimezisBlurView"
        style={styles.blurContainer}
      >
        <View style={styles.contentContainer}>{children}</View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    ...APP_THEME.shadows.floating,
    borderRadius: 24, // Consistent roundness
    overflow: 'visible', // Let the shadow leak out
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: APP_THEME.colors.glassBorder,
    backgroundColor: APP_THEME.colors.glassBackground, // fallback semi-transparent layer
  },
  contentContainer: {
    flexDirection: 'column',
  },
});
