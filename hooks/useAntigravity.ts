import { useEffect } from 'react';
import { useSharedValue, withRepeat, withTiming, withSequence, useAnimatedStyle, withDelay } from 'react-native-reanimated';

export const useAntigravity = (delay = 0, magnitude = 8, duration = 3000) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-magnitude, { duration }),
          withTiming(magnitude, { duration })
        ),
        -1, // Infinite
        true // Reverse
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
};
