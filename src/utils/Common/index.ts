
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