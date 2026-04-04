global.__ExpoImportMetaRegistry = {};
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

jest.mock('expo-blur', () => {
  const { View } = require('react-native');
  return { BlurView: View };
});

jest.mock('lucide-react-native', () => {
  const { View } = require('react-native');
  return {
    Navigation: () => <View testID="icon-navigation" />,
    Layers: () => <View testID="icon-layers" />,
    Settings: () => <View testID="icon-settings" />,
  };
});
