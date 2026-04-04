import { render } from '@testing-library/react-native';
import React from 'react';

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView'
}));

const mockSafeAreaInsets = { top: 40, bottom: 20, left: 0, right: 0 };
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => mockSafeAreaInsets,
}));

jest.mock('../../hooks/useAntigravity', () => ({
  useAntigravity: () => ({ transform: [{ translateY: 0 }] }),
}));

// Provide proper mock components for icons that we can test for
jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    Navigation: (props: any) => <View testID="icon-navigation" {...props} />,
    Layers: (props: any) => <View testID="icon-layers" {...props} />,
    Settings: (props: any) => <View testID="icon-settings" {...props} />,
  };
});

import { FloatingActionMenu } from '../FloatingActionMenu';

describe('FloatingActionMenu', () => {
  it('renders correctly', () => {
    const { toJSON } = render(<FloatingActionMenu />);
    expect(toJSON()).toBeDefined();
  });

  it('applies correct top margin based on safe area insets', () => {
    // The FloatingActionMenu has a View root component with a style
    // containing top: insets.top + 100
    const { toJSON } = render(<FloatingActionMenu />);
    const json = toJSON() as any;

    // Test that the container's top style is insets.top + 100
    const expectedTop = mockSafeAreaInsets.top + 100;

    const viewStyle = json.props.style;

    // Check if the style array contains the expected top value
    const hasCorrectTop = Array.isArray(viewStyle)
      ? viewStyle.some((style: any) => style && style.top === expectedTop)
      : viewStyle && viewStyle.top === expectedTop;

    expect(hasCorrectTop).toBe(true);
  });

  it('renders three floating action buttons with correct icons', () => {
    const { getByTestId } = render(<FloatingActionMenu />);

    // Verify each expected icon is rendered
    expect(getByTestId('icon-navigation')).toBeTruthy();
    expect(getByTestId('icon-layers')).toBeTruthy();
    expect(getByTestId('icon-settings')).toBeTruthy();
  });
});
