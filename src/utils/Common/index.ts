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

  setTimeout(() => {
    queryClient.clear();

    Toast.show({
      type: 'success',
      text1: 'Log Out Berhasil',
      position: 'top',
      visibilityTime: 3000,
    });
  }, 400);
};

export const formatNumber = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined || val === '') return '';

  const stringVal = typeof val === 'string' ? val : val.toString();

  const cleanNumber = stringVal.replace(/[^0-9]/g, '');
  if (cleanNumber === '') return '';

  return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Shortens amounts for quick-select chips, e.g. 10000 -> "10K", 1000000 -> "1000K".
export const formatShortAmount = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined || val === '') return '';

  const numericVal = Number(String(val).replace(/[^0-9]/g, ''));
  if (!numericVal || Number.isNaN(numericVal)) return '';

  if (numericVal >= 1_000) {
    const thousands = numericVal / 1_000;
    return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}K`;
  }

  return String(numericVal);
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
