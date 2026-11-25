/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {
  getCrashlytics,
  setCrashlyticsCollectionEnabled,
} from '@react-native-firebase/crashlytics';
import { getPerformance } from '@react-native-firebase/perf';
import App from './App';
import {name as appName} from './app.json';
import { startNetworkLogging } from 'react-native-network-logger';

import Config from 'react-native-config';

const shouldEnableLogger = Config.ENABLE_NETWORK_LOGGER === 'true' || Config.ENABLE_NETWORK_LOGGER === true;

setCrashlyticsCollectionEnabled(getCrashlytics(), true);
getPerformance().dataCollectionEnabled = true;

if (shouldEnableLogger) {
  startNetworkLogging();
}

AppRegistry.registerComponent(appName, () => App);
