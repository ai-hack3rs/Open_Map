import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { APP_THEME } from '../constants/mapConfig';

export const useAntigravity = (
  amplitude = APP_THEME.physics.bobAmplitude,
  duration = APP_THEME.physics.bobDuration,
  delay = 0
) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Start animation loop with a slight delay if specified (useful for staggering)
    setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-amplitude, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(amplitude, {
            duration: duration / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    }, delay);
  }, [amplitude, duration, delay, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return animatedStyle;
};
