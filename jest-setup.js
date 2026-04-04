import '@testing-library/react-native';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // The mock for `useSharedValue`
  Reanimated.useSharedValue = jest.fn((init) => ({ value: init }));

  // The mock for `useAnimatedStyle`
  Reanimated.useAnimatedStyle = jest.fn((cb) => cb());

  return Reanimated;
});

// Mock hooks
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn().mockReturnValue({ top: 10, bottom: 20, left: 0, right: 0 }),
}));
