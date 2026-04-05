import React from 'react';
import { render } from '@testing-library/react-native';
import { FloatingActionMenu } from '../FloatingActionMenu';

// Mock dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
}));

jest.mock('react-native-reanimated/mock', () => ({
  useSharedValue: jest.fn(),
  withTiming: jest.fn(),
  withRepeat: jest.fn(),
  withSequence: jest.fn(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock'); // eslint-disable-line @typescript-eslint/no-require-imports
  const { View } = require('react-native'); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    __esModule: true,
    ...Reanimated,
    default: {
      ...Reanimated.default,
      View: View,
    },
  };
});

jest.mock('lucide-react-native', () => {
  const { Text } = require('react-native'); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    Navigation: () => <Text testID="icon-navigation">Navigation</Text>,
    Layers: () => <Text testID="icon-layers">Layers</Text>,
    Settings: () => <Text testID="icon-settings">Settings</Text>,
  };
});

jest.mock('../../hooks/useAntigravity', () => ({
  useAntigravity: () => ({ transform: [{ translateY: 0 }] }),
}));

// Mock GlassPanel as a simple view to avoid complex rendering
jest.mock('../GlassPanel', () => {
  const { View } = require('react-native'); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    GlassPanel: ({ children, style }: any) => <View style={style}>{children}</View>,
  };
});

describe('FloatingActionMenu', () => {
  it('renders all three FABs', () => {
    const { getByTestId } = render(<FloatingActionMenu />);

    expect(getByTestId('icon-navigation')).toBeTruthy();
    expect(getByTestId('icon-layers')).toBeTruthy();
    expect(getByTestId('icon-settings')).toBeTruthy();
  });

  it('calculates the correct top inset', () => {
    const { UNSAFE_root } = render(<FloatingActionMenu />);

    // The FloatingActionMenu renders a single View container
    const view = UNSAFE_root.children[0];

    // In our mock, insets.top is 40. The component adds 100.
    expect(view.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ top: 140 })
      ])
    );
  });
});
