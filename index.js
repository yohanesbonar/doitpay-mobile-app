/**
 * @format
 */

import {AppRegistry} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import perf from '@react-native-firebase/perf';
import App from './App';
import {name as appName} from './app.json';

crashlytics().setCrashlyticsCollectionEnabled(true);
perf().dataCollectionEnabled = true

AppRegistry.registerComponent(appName, () => App);
