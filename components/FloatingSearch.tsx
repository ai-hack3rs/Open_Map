import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { Search, User } from 'lucide-react-native';
import { GlassPanel } from './GlassPanel';
import { useAntigravity } from '../hooks/useAntigravity';
import { APP_THEME } from '../constants/mapConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const FloatingSearch = () => {
  // Using a smaller amplitude for the search bar so it bobs gently
  const floatingStyle = useAntigravity(4, 3000, 0);
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.container,
        { top: Math.max(insets.top, 20) + 10 },
        floatingStyle,
      ]}
    >
      <GlassPanel style={styles.glassContainer} intensity={40}>
        <View style={styles.innerContainer}>
          <Search color={APP_THEME.colors.textPrimary} size={20} style={styles.icon} />
          
          <TextInput
            style={styles.input}
            placeholder="Search regions, assets..."
            placeholderTextColor={APP_THEME.colors.textSecondary}
          />
          
          <View style={styles.avatarContainer}>
            <User color={APP_THEME.colors.primaryAccent} size={18} />
          </View>
        </View>
      </GlassPanel>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10,
  },
  glassContainer: {
    borderRadius: 30, // Pill shape
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    padding: 0, // Reset default padding
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
