import DeviceInfo from 'react-native-device-info';

let cachedDeviceId: string | null = null;

export const getDeviceFingerprint = async (): Promise<string> => {
  if (cachedDeviceId) return cachedDeviceId;

  try {
    // This returns the IDFV on iOS and Android ID on Android
    const uniqueId = await DeviceInfo.getUniqueId();
    cachedDeviceId = uniqueId;
    return uniqueId;
  } catch (error) {
    console.error("Failed to get device ID", error);
    return 'unknown-device';
  }
};