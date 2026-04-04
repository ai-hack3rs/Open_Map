import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { GlassPanel } from '../GlassPanel';

describe('GlassPanel', () => {
  it('renders correctly with default props', () => {
    const { getByText, toJSON } = render(
      <GlassPanel>
        <Text>Test Content</Text>
      </GlassPanel>
    );

    expect(getByText('Test Content')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('applies custom intensity and tint', () => {
    const { toJSON } = render(
      <GlassPanel intensity={50} tint="light">
        <Text>Custom Props</Text>
      </GlassPanel>
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('applies custom style', () => {
    const customStyle = { margin: 10 };
    const { toJSON } = render(
      <GlassPanel style={customStyle}>
        <Text>Styled Content</Text>
      </GlassPanel>
    );

    // Check if the output contains the custom style
    const tree = toJSON();
    expect(tree).toMatchSnapshot();
    // Assuming root view is an array of styles, check if custom style is there
    expect(tree?.props?.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ margin: 10 })])
    );
  });
});
