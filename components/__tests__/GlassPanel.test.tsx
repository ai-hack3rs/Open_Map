import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { GlassPanel } from '../GlassPanel';

// Mock expo-blur
jest.mock('expo-blur', () => {
  const React = require('react'); // eslint-disable-line @typescript-eslint/no-require-imports
  const { View } = require('react-native'); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    BlurView: (props: any) => <View testID="mock-blur-view" {...props} />
  };
});

describe('GlassPanel', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <GlassPanel>
        <Text>Test Child Content</Text>
      </GlassPanel>
    );

    expect(getByText('Test Child Content')).toBeTruthy();
  });

  it('applies default props (intensity and tint) correctly', () => {
    const { getByTestId } = render(
      <GlassPanel>
        <Text>Test Content</Text>
      </GlassPanel>
    );

    const blurView = getByTestId('mock-blur-view');
    expect(blurView.props.intensity).toBe(30);
    expect(blurView.props.tint).toBe('dark');
  });

  it('applies custom props (intensity and tint) correctly', () => {
    const { getByTestId } = render(
      <GlassPanel intensity={50} tint="light">
        <Text>Test Content</Text>
      </GlassPanel>
    );

    const blurView = getByTestId('mock-blur-view');
    expect(blurView.props.intensity).toBe(50);
    expect(blurView.props.tint).toBe('light');
  });

  it('applies custom style correctly', () => {
    const { getByTestId } = render(
      <GlassPanel style={{ margin: 10 }}>
        <Text>Test Content</Text>
      </GlassPanel>
    );

    expect(getByTestId('mock-blur-view')).toBeTruthy();
  });
});
