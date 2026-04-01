import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated from 'react-native-reanimated';

interface GlassPanelProps {
  children: React.ReactNode;
  style?: ViewStyle | any;
  intensity?: number;
  animatedStyle?: any;
}

const GlassPanel: React.FC<GlassPanelProps> = ({ children, style, intensity = 40, animatedStyle }) => {
  const Container = animatedStyle ? Animated.View : View;

  return (
    <Container style={[styles.outerContainer, animatedStyle]}>
      <BlurView
        intensity={intensity}
        tint="dark"
        experimentalBlurMethod="dimezisBlurView" // Better performance/quality on Android
        style={[styles.blurContainer, style]}
      >
        {children}
      </BlurView>
    </Container>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    borderRadius: 24,
    // Antigravity Shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
      },
      android: {
        elevation: 15,
      },
    }),
    overflow: 'hidden',
  },
  blurContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    padding: 16,
  },
});

export default GlassPanel;
