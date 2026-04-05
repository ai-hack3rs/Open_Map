import React from 'react';
import { render } from '@testing-library/react-native';
import { MapBase } from '../MapBase';

jest.mock('@maplibre/maplibre-react-native', () => {
  const { View } = require('react-native'); // eslint-disable-line @typescript-eslint/no-require-imports
  return {
    MapView: (props: any) => <View testID="map-view" {...props} />,
    Camera: (props: any) => <View testID="map-camera" {...props} />,
    UserLocation: (props: any) => <View testID="user-location" {...props} />,
    UserLocationRenderMode: { Normal: 'Normal' },
    setAccessToken: jest.fn(),
  };
});

describe('MapBase', () => {
  it('renders MapLibreGL.MapView and Camera components correctly', () => {
    const { getByTestId } = render(<MapBase />);

    expect(getByTestId('map-view')).toBeTruthy();
    expect(getByTestId('map-camera')).toBeTruthy();
    expect(getByTestId('user-location')).toBeTruthy();
  });
});
