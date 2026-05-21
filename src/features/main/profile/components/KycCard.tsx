import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { createStyles } from '../styles';
import { colors } from '@/theme/colors';
import { KycStatus } from '@/features/onboarding/kyc/types';
import { toRupiah } from '@/utils/formatting';

interface KycCardProps {
  kycStatus: KycStatus;
  limitAmount: number;
}

export const KycCard: FC<KycCardProps> = ({ kycStatus, limitAmount }) => {
  const styles = createStyles(colors);

  const isKycVerified = kycStatus === KycStatus.VERIFIED;

  return (
    <View style={styles.tierCard}>
      <View style={styles.tierHeader}>
        <Text style={styles.tierLabel}>Level Akun</Text>
        <Text style={styles.tierLabel}>Limit Harian</Text>
      </View>
      <View style={styles.tierHeader}>
        <Text style={styles.tierValue}>
          {isKycVerified ? 'KYC Terverifikasi' : 'Belum Verifikasi Identitas'}
        </Text>
        <Text style={styles.limitValue}>{toRupiah(limitAmount)}</Text>
      </View>
    </View>
  );
};
