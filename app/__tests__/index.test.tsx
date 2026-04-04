import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../index';
import { StatusBar, View } from 'react-native';

// Mock the child components to simplify testing
jest.mock('../../components/MapBase', () => {
  const { View } = require('react-native');
  return {
    MapBase: () => <View testID="MapBase" />
  };
});

jest.mock('../../components/FloatingSearch', () => {
  const { View } = require('react-native');
  return {
    FloatingSearch: () => <View testID="FloatingSearch" />
  };
});

jest.mock('../../components/FloatingActionMenu', () => {
  const { View } = require('react-native');
  return {
    FloatingActionMenu: () => <View testID="FloatingActionMenu" />
  };
});

jest.mock('../../components/SaaSBottomSheet', () => {
  const { View } = require('react-native');
  return {
    SaaSBottomSheet: () => <View testID="SaaSBottomSheet" />
  };
});

describe('App', () => {
  it('renders correctly with all main layout components', () => {
    const { getByTestId, UNSAFE_root } = render(<App />);

    // Verify all child components are rendered
    expect(getByTestId('MapBase')).toBeTruthy();
    expect(getByTestId('FloatingSearch')).toBeTruthy();
    expect(getByTestId('FloatingActionMenu')).toBeTruthy();
    expect(getByTestId('SaaSBottomSheet')).toBeTruthy();

    // Verify StatusBar is configured correctly
    const statusBar = UNSAFE_root.findByType(StatusBar);
    expect(statusBar.props.translucent).toBe(true);
    expect(statusBar.props.backgroundColor).toBe('transparent');
    expect(statusBar.props.barStyle).toBe('light-content');
  });
});
