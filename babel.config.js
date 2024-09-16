module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-transform-class-properties', { loose: false }],
    ['@babel/plugin-transform-private-property-in-object', { loose: false }],
    ['@babel/plugin-proposal-class-properties'],
    'react-native-reanimated/plugin',
    ['module:react-native-dotenv', {
      "moduleName": "@env",
      "path": ".env",
      "blocklist": null,
      "allowlist": null,
      "safe": false,
      "allowUndefined": true
    }]
  ],
};
