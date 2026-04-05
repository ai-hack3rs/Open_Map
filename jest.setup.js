// Polyfill for WinterCG imports in expo modules
global.__ExpoImportMetaRegistry = {};
global.structuredClone = (val) => JSON.parse(JSON.stringify(val));

jest.mock('expo-blur', () => ({ BlurView: 'BlurView' }));
