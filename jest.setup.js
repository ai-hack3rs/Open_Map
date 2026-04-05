global.__ExpoImportMetaRegistry = {};
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock'); // eslint-disable-line @typescript-eslint/no-require-imports
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-blur', () => ({ BlurView: 'BlurView' }));