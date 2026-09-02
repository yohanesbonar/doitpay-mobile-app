import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../../../../theme/ThemeProvider';
import { TransferQuota } from '../types';

const formatCurrency = (value: number): string => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

interface Props {
  freeTransferQuotaRemaining: number;
  freeTransferQuotaTotal: number;
  freeTransferQuotaUsed: number;
  transferFee: number;
  maxLimit: number;
  amountReceived?: number;
  isKycVerified?: boolean;
  freeQuotaResetType?: TransferQuota['freeQuotaResetType'];
}

export const TransferLimitCard = ({
  freeTransferQuotaTotal = 0,
  freeTransferQuotaUsed = 0,
  maxLimit = 0,
  amountReceived = 0,
  isKycVerified = false,
  freeQuotaResetType = 'DAILY',
}: Props) => {
  const percentage =
    freeTransferQuotaTotal > 0 ? (freeTransferQuotaUsed / freeTransferQuotaTotal) * 100 : 0;

  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [trackWidth, setTrackWidth] = useState(0);

  const handleLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const fillWidth = trackWidth * (Math.min(Math.max(percentage, 0), 100) / 100);

  return (
    <LinearGradient
      colors={['#0D1B3E', '#29339B', '#4C66D6']}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.card}>
      <View style={{ padding: 16 }}>
        <Text style={styles.labelBalance}>Balance Tersedia</Text>
        <Text style={styles.balanceAmount}>Rp {formatCurrency(amountReceived)}</Text>

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <View style={styles.column}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
                justifyContent: 'space-between',
              }}>
              <Text style={styles.label}>Kuota Transfer Gratis</Text>
              {/* TODO: unhide this once the KYC process is complete */}
              {/* {!isKycVerified && (
                <View
                  style={{
                    backgroundColor: '#E5E5E5',
                    paddingVertical: 5,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                  }}>
                  <Text style={{ color: '#737373', fontSize: 12 }}>Belum Verifikasi</Text>
                </View>
              )} */}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={styles.quotaAmount}>
                {freeTransferQuotaUsed}/{freeTransferQuotaTotal}
              </Text>
              {freeQuotaResetType === 'DAILY' && (
                <Text style={styles.percentageText}>per hari</Text>
              )}
            </View>

            <View style={styles.progressBg} onLayout={handleLayout}>
              <View style={[styles.progressFill, { width: fillWidth }]} />
            </View>
          </View>

          <View style={styles.column}>
            <Text style={styles.labelLimit}>Limit Harian</Text>
            <Text style={styles.amount}>Rp {formatCurrency(maxLimit)}</Text>
            {/* TODO: unhide this once the KYC process is complete */}
            {/* {!isKycVerified && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 5,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  marginTop: 8,
                  alignSelf: 'flex-start',
                }}>
                <Text style={{ color: '#0A0A0A', fontSize: 12 }}>Verifikasi KYC</Text>
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      borderRadius: 16,
      marginVertical: 10,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
    },
    label: {
      color: colors.textWhite,
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
    },
    labelBalance: {
      color: colors.textWhite,
      fontSize: 14,
      fontFamily: 'Switzer-Medium',
      opacity: 0.9,
    },
    labelReceived: {
      color: colors.textWhite,
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
      marginTop: 10,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    column: {
      flex: 1,
      paddingRight: 12,
    },
    quotaAmount: {
      color: colors.textWhite,
      fontSize: 18,
      fontFamily: 'Switzer-Medium',
    },
    amount: {
      color: colors.textWhite,
      fontSize: 18,
      fontFamily: 'Switzer-Medium',
    },
    labelLimit: {
      color: colors.textWhite,
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
      marginBottom: 4,
    },
    percentageText: {
      color: colors.textWhite,
      fontSize: 16,
      fontFamily: 'Switzer-Regular',
    },
    progressBg: {
      height: 5,
      backgroundColor: '#FFF',
      borderRadius: 4,
      marginTop: 12,
      marginBottom: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: 8,
      backgroundColor: '#A5C0FF',
      borderRadius: 4,
    },
    limitText: {
      color: colors.textWhite,
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
    },
    balanceAmount: {
      color: colors.textWhite,
      fontSize: 32,
      fontFamily: 'Switzer-Semibold',
      marginTop: 4,
    },
    divider: {
      height: 1,
      backgroundColor: '#FFF',
      marginVertical: 16,
    },
  });
