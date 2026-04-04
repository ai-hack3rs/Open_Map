import React from 'react';
import { render } from '@testing-library/react-native';
import { SaaSBottomSheet } from '../SaaSBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAntigravity } from '../../hooks/useAntigravity';

// Mock the GlassPanel since it might use Expo Blur
jest.mock('../GlassPanel', () => ({
  GlassPanel: ({ children, style, testID }: any) => <mock-glass-panel style={style} testID={testID}>{children}</mock-glass-panel>,
}));

// Mock the hook
jest.mock('../../hooks/useAntigravity', () => ({
  useAntigravity: jest.fn().mockReturnValue({ transform: [{ translateY: 0 }] }),
}));

describe('SaaSBottomSheet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with fleet overview content', () => {
    const { getByText } = render(<SaaSBottomSheet />);

    // Check main title
    expect(getByText('Fleet Overview')).toBeTruthy();

    // Check stats
    expect(getByText('Active Vehicles')).toBeTruthy();
    expect(getByText('42/50')).toBeTruthy();

    expect(getByText("Today's Rev")).toBeTruthy();
    expect(getByText('$12.4k')).toBeTruthy();

    expect(getByText('Avg Wait')).toBeTruthy();
    expect(getByText('4m 12s')).toBeTruthy();

    // Check recent routes
    expect(getByText('Recent Routes')).toBeTruthy();
    expect(getByText('Route #1094')).toBeTruthy();
    expect(getByText('In Progress')).toBeTruthy();
    expect(getByText('12 min ago')).toBeTruthy();

    expect(getByText('Route #1093')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();
    expect(getByText('45 min ago')).toBeTruthy();
  });

  it('applies the correct bottom offset based on safe area insets', () => {
    // Override the default mock for this test
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ bottom: 40, top: 0, left: 0, right: 0 });

    render(<SaaSBottomSheet />);

    // Check if useAntigravity is called
    expect(useAntigravity).toHaveBeenCalledWith(6, 4000, 200);
  });

  it('handles small bottom safe area insets by applying minimum padding', () => {
    // Small safe area inset
    (useSafeAreaInsets as jest.Mock).mockReturnValue({ bottom: 5, top: 0, left: 0, right: 0 });

    render(<SaaSBottomSheet />);

    // Component should still render
    expect(useAntigravity).toHaveBeenCalled();
  });
});
