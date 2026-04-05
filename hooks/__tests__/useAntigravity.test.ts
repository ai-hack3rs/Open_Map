import { renderHook, act } from '@testing-library/react-native';
import { useAntigravity } from '../useAntigravity';
import { APP_THEME } from '../../constants/mapConfig';
import {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const actualReanimated = jest.requireActual('react-native-reanimated/mock');
  const mockSharedValue = { value: 0 };

  return {
    ...actualReanimated,
    useSharedValue: jest.fn(() => mockSharedValue),
    useAnimatedStyle: jest.fn((cb) => cb()),
    withRepeat: jest.fn((animation) => animation),
    withSequence: jest.fn((...animations) => animations),
    withTiming: jest.fn((toValue, config) => ({ toValue, config })),
    Easing: {
      inOut: jest.fn((easing) => easing),
      ease: 'ease',
    },
  };
});

describe('useAntigravity', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should initialize with default parameters and start animation', () => {
    const { result } = renderHook(() => useAntigravity());

    // Check shared value initialization
    expect(useSharedValue).toHaveBeenCalledWith(0);

    // Initial state before timer fires
    expect(withRepeat).not.toHaveBeenCalled();

    // Fast-forward timers to trigger the setTimeout
    act(() => {
      jest.runAllTimers();
    });

    // Check animation setup
    expect(withTiming).toHaveBeenCalledTimes(2);

    // First part of the sequence: move up
    expect(withTiming).toHaveBeenNthCalledWith(1, -APP_THEME.physics.bobAmplitude, {
      duration: APP_THEME.physics.bobDuration / 2,
      easing: 'ease',
    });

    // Second part of the sequence: move down
    expect(withTiming).toHaveBeenNthCalledWith(2, APP_THEME.physics.bobAmplitude, {
      duration: APP_THEME.physics.bobDuration / 2,
      easing: 'ease',
    });

    // Sequence wrap
    expect(withSequence).toHaveBeenCalledTimes(1);

    // Repeat setup
    expect(withRepeat).toHaveBeenCalledTimes(1);
    expect(withRepeat).toHaveBeenCalledWith(
      expect.anything(),
      -1, // Infinite repeat
      true // Reverse
    );

    // Check returned style
    expect(result.current).toEqual({
      transform: [{ translateY: 0 }],
    });
  });

  it('should respect custom parameters', () => {
    const customAmplitude = 20;
    const customDuration = 1000;
    const customDelay = 500;

    renderHook(() =>
      useAntigravity(customAmplitude, customDuration, customDelay)
    );

    // Fast-forward exact delay amount
    act(() => {
      jest.advanceTimersByTime(customDelay);
    });

    // Check custom animation setup
    expect(withTiming).toHaveBeenNthCalledWith(1, -customAmplitude, {
      duration: customDuration / 2,
      easing: 'ease',
    });

    expect(withTiming).toHaveBeenNthCalledWith(2, customAmplitude, {
      duration: customDuration / 2,
      easing: 'ease',
    });
  });

  it('should update translation value when animated', () => {
    // Reset mock for this specific test
    const mockSharedValue = { value: 0 };
    (useSharedValue as jest.Mock).mockReturnValue(mockSharedValue);

    // Mock withRepeat to simulate returning a value
    (withRepeat as jest.Mock).mockReturnValue('mocked-animation-value');

    renderHook(() => useAntigravity());

    act(() => {
      jest.runAllTimers();
    });

    // Verify that the shared value was updated with the animation
    expect(mockSharedValue.value).toBe('mocked-animation-value');
  });
});
