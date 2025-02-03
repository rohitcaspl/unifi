module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Resolve module aliases (adjust these paths as needed)
    [
      'babel-plugin-module-resolver',
      {
        root: ['./src'],
        alias: {
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@features': './src/features',
          '@screens': './src/screens',
          '@shared': './src/shared',
          '@storage': './src/storage',
          '@hooks': './src/hooks',
          '@assets': './src/assets',
          '@api': './src/api',
          '@theme': './src/theme',
          '@config': './src/config',
        },
      },
    ],
    // Load environment variables from .env files
    'module:react-native-dotenv',
    // Enable worklets for modules that require running code on a separate thread
    ['react-native-worklets-core/plugin'],
    // Finally, include the Reanimated plugin (with processNestedWorklets enabled) last
    ['react-native-reanimated/plugin', { processNestedWorklets: true }],
  ],
};
