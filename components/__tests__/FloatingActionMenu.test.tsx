import React from 'react';
import { render } from '@testing-library/react-native';
import { FloatingActionMenu } from '../FloatingActionMenu';
import { useAntigravity } from '../../hooks/useAntigravity';

// Mock the dependencies
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../hooks/useAntigravity', () => ({
  useAntigravity: jest.fn(() => ({ transform: [{ translateY: 0 }] })),
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView'
}));

// Mock Lucide icons as React components that render text with their name
jest.mock('lucide-react-native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ReactNativeMock = require('react-native');
  return {
    Navigation: () => <ReactNativeMock.Text testID="NavigationIcon">NavigationIcon</ReactNativeMock.Text>,
    Layers: () => <ReactNativeMock.Text testID="LayersIcon">LayersIcon</ReactNativeMock.Text>,
    Settings: () => <ReactNativeMock.Text testID="SettingsIcon">SettingsIcon</ReactNativeMock.Text>,
  };
});

describe('FloatingActionMenu', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and displays all three FAB icons', () => {
    const { getByTestId } = render(<FloatingActionMenu />);

    expect(getByTestId('NavigationIcon')).toBeTruthy();
    expect(getByTestId('LayersIcon')).toBeTruthy();
    expect(getByTestId('SettingsIcon')).toBeTruthy();
  });

  it('calls useAntigravity with staggered delays for each FAB', () => {
    render(<FloatingActionMenu />);

    // FloatingActionMenu renders 3 FAB components with specific delays:
    // <FAB icon={Navigation} delay={0} />
    // <FAB icon={Layers} delay={300} />
    // <FAB icon={Settings} delay={600} />

    // useAntigravity is called with (amplitude, duration, delay)
    // The default values are amplitude=5, duration=2000

    expect(useAntigravity).toHaveBeenCalledTimes(3);

    // Check first call (Navigation)
    expect(useAntigravity).toHaveBeenNthCalledWith(1, 5, 2000, 0);

    // Check second call (Layers)
    expect(useAntigravity).toHaveBeenNthCalledWith(2, 5, 2000, 300);

    // Check third call (Settings)
    expect(useAntigravity).toHaveBeenNthCalledWith(3, 5, 2000, 600);
  });
});
