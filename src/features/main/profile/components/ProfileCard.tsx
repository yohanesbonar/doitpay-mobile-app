import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from '../styles';
import { colors } from '@/theme/colors';
import { User } from '@/features/user/types';
import { KycStatus } from '@/features/onboarding/kyc/types';

interface ProfileCardProps extends Pick<User, 'fullName' | 'phoneNumber' | 'kycStatus'> {
  // Opens the rejection details; only used when kycStatus is REJECTED.
  onPressRejectedKyc?: () => void;
}

export const ProfileCard: FC<ProfileCardProps> = ({
  fullName,
  phoneNumber,
  kycStatus,
  onPressRejectedKyc,
}) => {
  const styles = createStyles(colors);

  const isKycVerified = kycStatus === KycStatus.VERIFIED;
  const isKycPending = kycStatus === KycStatus.PENDING;
  const isKycRejected = kycStatus === KycStatus.REJECTED;

  const initials = fullName
    ? fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('')
    : '?';

  const badgeStyle = isKycVerified
    ? styles.verifiedBadge
    : isKycPending
      ? styles.pendingBadge
      : isKycRejected
        ? styles.rejectedBadge
        : styles.unverifiedBadge;
  const badgeTextStyle = isKycVerified
    ? styles.verifiedText
    : isKycPending
      ? styles.pendingText
      : isKycRejected
        ? styles.rejectedText
        : styles.unverifiedText;
  const badgeLabel = isKycVerified
    ? 'Terverifikasi'
    : isKycPending
      ? 'Sedang Diverifikasi'
      : isKycRejected
        ? 'Verifikasi Gagal'
        : 'Belum Verifikasi';

  return (
    <View style={styles.userCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{fullName || '-'}</Text>
        <Text
          style={styles.userPhone}
          numberOfLines={1}
          ellipsizeMode="tail">{`+${phoneNumber}`}</Text>
      </View>
      <TouchableOpacity
        style={badgeStyle}
        onPress={onPressRejectedKyc}
        disabled={!isKycRejected || !onPressRejectedKyc}
        activeOpacity={0.7}>
        <Text style={badgeTextStyle} numberOfLines={1} ellipsizeMode="tail">
          {badgeLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
