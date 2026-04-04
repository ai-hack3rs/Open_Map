import React from 'react';
import { render } from '@testing-library/react-native';
import { FloatingActionMenu } from './FloatingActionMenu';

// Mock the safe area context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, right: 0, bottom: 0, left: 0 }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    Navigation: () => <View testID="icon-navigation" />,
    Layers: () => <View testID="icon-layers" />,
    Settings: () => <View testID="icon-settings" />,
  };
});

describe('FloatingActionMenu', () => {
  it('renders correctly with safe area insets', () => {
    const { getByTestId, UNSAFE_root } = render(<FloatingActionMenu />);

    // Check that our mock icons are rendered
    expect(getByTestId('icon-navigation')).toBeTruthy();
    expect(getByTestId('icon-layers')).toBeTruthy();
    expect(getByTestId('icon-settings')).toBeTruthy();

    // Check that the top offset calculation logic is correct (insets.top + 100)
    // We mocked insets.top to be 40, so it should be 140
    // Access the rendered tree correctly
    const container = UNSAFE_root.children[0] as any;
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ top: 140 })
      ])
    );
  });
});
