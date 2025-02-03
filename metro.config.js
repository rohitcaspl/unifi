const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const customConfig = {
  transformer: {
    // Apply custom transformation options.
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
    // Use the react-native-svg-transformer for SVG files.
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    // Exclude 'svg' from assetExts so that it is handled as a source file.
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    // Add 'svg' to the list of source extensions.
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, customConfig);
