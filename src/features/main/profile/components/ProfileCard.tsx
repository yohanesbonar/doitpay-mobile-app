import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { createStyles } from '../styles';
import { colors } from '@/theme/colors';
import { User } from '@/features/user/types';
import { KycStatus } from '@/features/onboarding/kyc/types';

interface ProfileCardProps extends Pick<User, 'fullName' | 'phoneNumber' | 'kycStatus'> {}

export const ProfileCard: FC<ProfileCardProps> = ({ fullName, phoneNumber, kycStatus }) => {
  const styles = createStyles(colors);

  const isKycVerified = kycStatus === KycStatus.VERIFIED;

  const initials = fullName
    ? fullName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join('')
    : '?';

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
      <View style={isKycVerified ? styles.verifiedBadge : styles.unverifiedBadge}>
        <Text
          style={isKycVerified ? styles.verifiedText : styles.unverifiedText}
          numberOfLines={1}
          ellipsizeMode="tail">
          {isKycVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
        </Text>
      </View>
    </View>
  );
};
