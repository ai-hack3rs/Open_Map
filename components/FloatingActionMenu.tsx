import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';
import { Navigation, Layers, Settings } from 'lucide-react-native';
import { GlassPanel } from './GlassPanel';
import { useAntigravity } from '../hooks/useAntigravity';
import { APP_THEME } from '../constants/mapConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FAB = ({ icon: Icon, delay, accessibilityLabel }: { icon: any; delay: number; accessibilityLabel: string }) => {
  // Stagger the bobbing effect for each button
  const floatingStyle = useAntigravity(5, 2000, delay);

  return (
    <Animated.View style={[styles.fabContainer, floatingStyle]}>
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        <GlassPanel style={styles.fabGlass} intensity={50}>
          <View style={styles.iconContainer}>
            <Icon color={APP_THEME.colors.textPrimary} size={22} />
          </View>
        </GlassPanel>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const FloatingActionMenu = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { top: insets.top + 100 }]}>
      <FAB icon={Navigation} delay={0} accessibilityLabel="Navigation" />
      <FAB icon={Layers} delay={300} accessibilityLabel="Map Layers" />
      <FAB icon={Settings} delay={600} accessibilityLabel="Settings" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    alignItems: 'center',
    gap: 16,
  },
  fabContainer: {
    marginBottom: 16,
  },
  fabGlass: {
    borderRadius: 28, // fully circular for a 56x56 button
  },
  iconContainer: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
