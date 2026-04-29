import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../storage/useAuthStore';

export const formatOTPTimer = (seconds: number): string => {
  if (seconds <= 0) return '0s';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    if (remainingSeconds === 0) {
      return `${minutes} menit`;
    }

    return `${minutes} menit ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
};

export const handleLogout = () => {
  const logout = useAuthStore.getState().logout;
  logout();
  Toast.show({
    type: 'success',
    text1: 'Log Out Berhasil',
    position: 'top',
    visibilityTime: 3000,
  });
};
