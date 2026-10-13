module.exports = {
  presets: [
    ['@react-native/babel-preset', { unstable_transformProfile: 'hermes-stable' }],
    'nativewind/babel',
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          'tailwind.config': './tailwind.config.js',
        },
      },
    ],
    'react-native-worklets/plugin',
  ],
};
