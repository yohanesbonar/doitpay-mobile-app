/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Handle background messages
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  // Jangan panggil fungsi UI di sini (seperti alert/toast), 
  // karena UI belum tentu render. Cukup update storage atau data saja.
});

AppRegistry.registerComponent(appName, () => App);
