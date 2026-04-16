import axios from 'axios';
import Config from 'react-native-config';
import { getDeviceFingerprint } from '../utils/Device/Device.ts';

const apiClient = axios.create({
  baseURL: Config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(async (config) => {

  const deviceId = await getDeviceFingerprint();
  config.headers['X-Device-ID'] = deviceId;

 
  if (__DEV__) {
    console.log('--- 🛫 API REQUEST ---');
    console.log(`URL: ${config.baseURL}${config.url}`);
    console.log(`Method: ${config.method?.toUpperCase()}`);
    console.log('Headers:', JSON.stringify(config.headers, null, 2));
    if (config.data) {
      console.log('Body:', JSON.stringify(config.data, null, 2));
    }
    console.log('----------------------');
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});


apiClient.interceptors.response.use((response) => {
  if (__DEV__) {
    console.log('--- ✅ API RESPONSE ---');
    console.log(`Status: ${response.status}`);
    console.log('Data:', JSON.stringify(response.data, null, 2));
    console.log('-----------------------');
  }
  return response;
}, (error) => {
  if (__DEV__) {
    console.log('--- ❌ API ERROR ---');
    console.log(`Status: ${error.response?.status}`);
    console.log('Message:', error.message);
    console.log('Error Data:', JSON.stringify(error.response?.data, null, 2));
    console.log('---------------------');
  }
  return Promise.reject(error);
});

export default apiClient;