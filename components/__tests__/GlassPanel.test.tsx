import React from 'react';
import { Text, ViewStyle } from 'react-native';
import { render } from '@testing-library/react-native';
import { GlassPanel } from '../GlassPanel';

// Mock expo-blur's BlurView
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView'
}));

describe('GlassPanel', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <GlassPanel>
        <Text>Test Child</Text>
      </GlassPanel>
    );

    expect(getByText('Test Child')).toBeTruthy();
  });

  it('passes default intensity and tint to BlurView', () => {
    const { UNSAFE_getByType } = render(
      <GlassPanel>
        <Text>Child</Text>
      </GlassPanel>
    );

    const blurView = UNSAFE_getByType('BlurView' as any);
    expect(blurView.props.intensity).toBe(30);
    expect(blurView.props.tint).toBe('dark');
  });

  it('passes custom intensity and tint to BlurView', () => {
    const { UNSAFE_getByType } = render(
      <GlassPanel intensity={50} tint="light">
        <Text>Child</Text>
      </GlassPanel>
    );

    const blurView = UNSAFE_getByType('BlurView' as any);
    expect(blurView.props.intensity).toBe(50);
    expect(blurView.props.tint).toBe('light');
  });

  it('merges custom style with default shadowContainer styles', () => {
    const customStyle: ViewStyle = { marginTop: 10, padding: 20 };
    const { getByTestId } = render(
      <GlassPanel style={customStyle} testID="glass-panel-wrapper">
        <Text>Child</Text>
      </GlassPanel>
    );

    const container = getByTestId('glass-panel-wrapper');
    expect(container.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: 24, overflow: 'visible' }),
        customStyle
      ])
    );
  });
});
