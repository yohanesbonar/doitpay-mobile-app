export type QrisKycStatus = 'approved' | 'pending' | 'rejected';

export interface QrisActivationEligibility {
  hasNmid: boolean;
  kycStatus: QrisKycStatus;
  rejectionReason?: string;
}

export const qrisApi = {
  getActivationEligibilitySample: async (): Promise<QrisActivationEligibility> => {
    // Sample-only response. Change this value to test each case locally.
    const getSampleCase = (): QrisKycStatus => 'pending'; // Change this value to 'approved', 'pending', or 'rejected' to test different cases.
    const sampleCase = getSampleCase();

    await new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 250);
    });

    if (sampleCase === 'approved') {
      return {
        hasNmid: false,
        kycStatus: 'approved',
      };
    }

    if (sampleCase === 'rejected') {
      return {
        hasNmid: false,
        kycStatus: 'rejected',
        rejectionReason:
          'Pengajuan QRIS Anda belum dapat disetujui karena data usaha belum lengkap. Silakan ajukan ulang setelah memperbarui data.',
      };
    }

    return {
      hasNmid: false,
      kycStatus: 'pending',
    };
  },
};
