import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { StatCard } from '../SaaSBottomSheet';

// Mock Icon component
const MockIcon = ({ color, size }: { color: string; size: number }) => (
  <Text testID="mock-icon">{`Icon-color:${color}-size:${size}`}</Text>
);

describe('StatCard', () => {
  it('renders correctly with label, value, and color', () => {
    const { getByText, getByTestId } = render(
      <StatCard
        icon={MockIcon}
        label="Total Orders"
        value="1,234"
        color="#ff0000"
      />
    );

    // Verify value and label are rendered
    expect(getByText('1,234')).toBeTruthy();
    expect(getByText('Total Orders')).toBeTruthy();

    // Verify icon is rendered with correct color
    const iconNode = getByTestId('mock-icon');
    expect(iconNode).toBeTruthy();
    expect(iconNode.props.children).toBe('Icon-color:#ff0000-size:20');
  });
});
