import React from 'react';
import { render } from '@testing-library/react-native';
import { SaaSBottomSheet } from '../SaaSBottomSheet';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 20, left: 0, right: 0 }),
}));

jest.mock('lucide-react-native', () => ({
  Truck: 'TruckIcon',
  DollarSign: 'DollarSignIcon',
  Clock: 'ClockIcon',
  ChevronRight: 'ChevronRightIcon',
}));

jest.mock('react-native-reanimated', () => {
  return require('react-native-reanimated/mock'); // eslint-disable-line @typescript-eslint/no-require-imports
});

describe('SaaSBottomSheet', () => {
  it('renders correctly', () => {
    const { getByText } = render(<SaaSBottomSheet />);
    expect(getByText('Fleet Overview')).toBeTruthy();
  });
});
