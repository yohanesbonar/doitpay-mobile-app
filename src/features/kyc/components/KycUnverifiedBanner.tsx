import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CircleAlert } from 'lucide-react-native';
import { KycStatus } from '@/features/onboarding/kyc/types';

interface KycUnverifiedBannerProps {
  kycStatus?: KycStatus;
  style?: StyleProp<ViewStyle>;
}

// Top-of-screen nudge for users who have not submitted KYC yet. Pending / rejected / verified
// users have their own surfaces (badge, result screen), so it renders nothing for them.
export const KycUnverifiedBanner = ({ kycStatus, style }: KycUnverifiedBannerProps) => {
  const navigation = useNavigation<any>();

  if (kycStatus !== KycStatus.UNVERIFIED) return null;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <CircleAlert size={18} color="#FFFFFF" strokeWidth={2.4} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title} numberOfLines={1}>
          Akun belum terverifikasi.
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          Verifikasi KYC sekarang
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('KycIntro')}
        activeOpacity={0.85}>
        <Text style={styles.buttonText}>Verifikasi KYC</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF0FE',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4F7DF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontFamily: 'Switzer-Semibold',
    fontSize: 14,
    color: '#3B6FE0',
  },
  subtitle: {
    fontFamily: 'Switzer-Regular',
    fontSize: 13,
    color: '#3B6FE0',
    marginTop: 2,
  },
  button: {
    backgroundColor: '#4F7DF3',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  buttonText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 13,
    color: '#FFFFFF',
  },
});
