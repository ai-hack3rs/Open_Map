import React from 'react';
import { render } from '@testing-library/react-native';
import { FloatingSearch } from '../FloatingSearch';

// Mock dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
}));

jest.mock('../../hooks/useAntigravity', () => ({
  useAntigravity: () => ({ transform: [{ translateY: 0 }] }),
}));

jest.mock('lucide-react-native', () => {
  const React = require('react'); // eslint-disable-line @typescript-eslint/no-require-imports
  const { View } = require('react-native'); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    Search: () => <View testID="search-icon" />,
    User: () => <View testID="user-icon" />,
  };
});

jest.mock('../GlassPanel', () => {
  const React = require('react'); // eslint-disable-line @typescript-eslint/no-require-imports
  const { View } = require('react-native'); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    GlassPanel: ({ children, testID }: any) => <View testID={testID || "glass-panel"}>{children}</View>,
  };
});

describe('FloatingSearch', () => {
  it('renders correctly with correct placeholder', () => {
    const { getByPlaceholderText, getByTestId } = render(<FloatingSearch />);

    expect(getByPlaceholderText('Search regions, assets...')).toBeTruthy();
    expect(getByTestId('search-icon')).toBeTruthy();
    expect(getByTestId('user-icon')).toBeTruthy();
  });

  it('calculates top position correctly based on safe area insets', () => {
    // The test setup uses top: 40 for insets
    // Math.max(40, 20) + 10 = 50
    const { getByTestId } = render(<FloatingSearch />);

    const container = getByTestId('floating-search-container');

    // Style is typically an array with Animated.View, find the one with 'top'
    const flattenedStyle = Array.isArray(container.props.style)
      ? container.props.style.reduce((acc, current) => ({...acc, ...current}), {})
      : container.props.style;

    expect(flattenedStyle.top).toBe(50);
  });
});
