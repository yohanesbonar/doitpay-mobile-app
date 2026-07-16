/**
 * @format
 */

import { AppRegistry } from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import App from './App';
import { name as appName } from './app.json';
import { startNetworkLogging } from 'react-native-network-logger';

import Config from 'react-native-config';

const shouldEnableLogger =
  Config.ENABLE_NETWORK_LOGGER === 'true' || Config.ENABLE_NETWORK_LOGGER === true;

crashlytics().setCrashlyticsCollectionEnabled(true);
perf().dataCollectionEnabled = true;

if (shouldEnableLogger) {
  startNetworkLogging();
}

AppRegistry.registerComponent(appName, () => App);
