import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppBottomSheet } from '@/components/molecules/AppBottomSheet';
import { KycStatus } from '@/features/onboarding/kyc/types';

type GateContent = {
  image: ImageSourcePropType;
  title: string;
  description: string;
  ctaLabel: string;
  // UNVERIFIED starts KYC; PENDING / REJECTED open the result screen (status, reason, cooldown).
  ctaRoute: 'KycIntro' | 'KycResult';
};

const CONTENT: Partial<Record<KycStatus, GateContent>> = {
  [KycStatus.PENDING]: {
    image: require('../../../assets/images/kyc-pending.png'),
    title: 'Verifikasi sedang ditinjau',
    description:
      'Data kamu sedang kami periksa. Kamu bisa mulai transfer dan menggunakan fitur Doitpay setelah verifikasi disetujui.',
    ctaLabel: 'Lihat Status',
    ctaRoute: 'KycResult',
  },
  [KycStatus.REJECTED]: {
    image: require('../../../assets/images/kyc-reject.png'),
    title: 'Verifikasi belum berhasil',
    description:
      'Verifikasi identitasmu belum disetujui. Lihat alasannya lalu ajukan ulang agar kamu bisa mulai transfer.',
    ctaLabel: 'Lihat Detail',
    ctaRoute: 'KycResult',
  },
};

// Anything not pending/rejected (UNVERIFIED or unknown) is asked to start KYC.
const UNVERIFIED_CONTENT: GateContent = {
  image: require('../../../assets/images/kyc-unapproved.png'),
  title: 'Verifikasi akunmu dulu, yuk!',
  description:
    'Selesaikan verifikasi identitas agar kamu bisa mulai transfer dan menggunakan fitur Doitpay.',
  ctaLabel: 'Verifikasi KYC',
  ctaRoute: 'KycIntro',
};

interface KycRequiredSheetProps {
  status: KycStatus | null;
  onClose: () => void;
  onNavigate: (route: GateContent['ctaRoute']) => void;
}

export const KycRequiredSheet = ({ status, onClose, onNavigate }: KycRequiredSheetProps) => {
  const content = (status && CONTENT[status]) || UNVERIFIED_CONTENT;

  return (
    <AppBottomSheet isVisible={!!status} onClose={onClose}>
      <View style={styles.container}>
        <Image source={content.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.title}>{content.title}</Text>
        <Text style={styles.description}>{content.description}</Text>

        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => onNavigate(content.ctaRoute)}
          activeOpacity={0.85}>
          <Text style={styles.buttonPrimaryText}>{content.ctaLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonText} onPress={onClose} activeOpacity={0.7}>
          <Text style={styles.buttonTextLabel}>Nanti Saja</Text>
        </TouchableOpacity>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,

    paddingTop: 16,
    paddingBottom: 4,
    alignItems: 'center',
  },
  // Fixed size (source is 3:2): a percentage width grows with the screen and pushed the sheet
  // close to full height on large phones.
  image: {
    width: 210,
    height: 140,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Switzer-Semibold',
    fontSize: 22,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  description: {
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
    lineHeight: 21,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonPrimary: {
    alignSelf: 'stretch',
    backgroundColor: '#3981FF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPrimaryText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonText: {
    alignSelf: 'stretch',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonTextLabel: {
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
    color: '#111827',
  },
});
