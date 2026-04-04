import { renderHook } from '@testing-library/react-hooks';
import { useAntigravity } from './useAntigravity';
import { APP_THEME } from '../constants/mapConfig';
import {
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';

// The reanimated mock sets up spy functions for us automatically
// but we want to assert on them, so we mock them explicitly to make typescript happy
// or rather, just assert on the mock properties.

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Create mock functions that we can assert on
  const mockUseSharedValue = jest.fn((init) => ({ value: init }));
  const mockUseAnimatedStyle = jest.fn((cb) => cb());
  const mockWithRepeat = jest.fn((anim) => anim);
  const mockWithSequence = jest.fn((...anims) => anims);
  const mockWithTiming = jest.fn((val, config) => ({ val, config }));

  return {
    ...Reanimated,
    useSharedValue: mockUseSharedValue,
    useAnimatedStyle: mockUseAnimatedStyle,
    withRepeat: mockWithRepeat,
    withSequence: mockWithSequence,
    withTiming: mockWithTiming,
    Easing: {
      inOut: jest.fn(() => 'easing-inOut'),
      ease: 'easing-ease',
    },
  };
});

describe('useAntigravity', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should initialize correctly and start animation with default params', () => {
    const { result } = renderHook(() => useAntigravity());

    // Check initial state
    expect(result.current.transform[0].translateY).toBe(0);

    // Fast-forward past setTimeout
    jest.runAllTimers();

    // After timer, it should have called withRepeat
    expect(withRepeat).toHaveBeenCalled();
    expect(withSequence).toHaveBeenCalled();

    // It should have used default amplitudes
    expect(withTiming).toHaveBeenCalledWith(
      -APP_THEME.physics.bobAmplitude,
      expect.objectContaining({ duration: APP_THEME.physics.bobDuration / 2 })
    );
    expect(withTiming).toHaveBeenCalledWith(
      APP_THEME.physics.bobAmplitude,
      expect.objectContaining({ duration: APP_THEME.physics.bobDuration / 2 })
    );
  });

  it('should accept custom amplitude and duration', () => {
    renderHook(() => useAntigravity(50, 1000));

    jest.runAllTimers();

    expect(withTiming).toHaveBeenCalledWith(
      -50,
      expect.objectContaining({ duration: 500 })
    );
    expect(withTiming).toHaveBeenCalledWith(
      50,
      expect.objectContaining({ duration: 500 })
    );
  });

  it('should respect custom delay', () => {
    renderHook(() => useAntigravity(10, 1000, 500));

    // Advance timer slightly less than delay
    jest.advanceTimersByTime(499);
    expect(withRepeat).not.toHaveBeenCalled();

    // Advance past delay
    jest.advanceTimersByTime(1);
    expect(withRepeat).toHaveBeenCalled();
  });
});
