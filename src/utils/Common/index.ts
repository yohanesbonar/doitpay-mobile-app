import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../storage/useAuthStore';
import { queryClient } from '../../api/queryClient';
import { authApi } from '../../api/auth';

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
  const { logout, accessToken } = useAuthStore.getState();
  if (accessToken) {
    authApi.logout(accessToken).catch(() => {});
  }
  logout();
  queryClient.clear();
  Toast.show({
    type: 'success',
    text1: 'Log Out Berhasil',
    position: 'top',
    visibilityTime: 3000,
  });
};

export const formatNumber = (val: string | number | null | undefined) => {
  if (typeof val !== 'string') {
    val = val?.toString();
  }
  const cleanNumber = val.replace(/[^0-9]/g, '');
  if (cleanNumber === '') return '';

  return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatApiDateToLocal = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  
  const day = date.getDate();
  const month = date.getMonth() + 1; 
  const year = date.getFullYear();
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');


  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
};
