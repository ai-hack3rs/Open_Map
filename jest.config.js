module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-native-community|expo|@expo|react-native-reanimated|react-native-worklets)/)'
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
};
