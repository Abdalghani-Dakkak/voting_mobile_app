const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { withWeb3Auth } = require('@web3auth/react-native-sdk/metro-config');

const config = withWeb3Auth(getDefaultConfig(__dirname));

module.exports = withNativeWind(config, { input: './global.css' });
