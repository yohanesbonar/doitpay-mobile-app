import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import library ini
import { useTheme } from '../../../../theme/ThemeProvider';

interface Props {
  usedAmount: number;
  maxAmount: number;
  percentage: number;
  amountReceived: number;
}

export const TransferLimitCard = ({ usedAmount, maxAmount, percentage, amountReceived }: Props) => {
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
        <Text style={styles.label}>Sudah terpakai</Text>

        <View style={styles.rowBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.amount}>Rp {usedAmount.toLocaleString()}</Text>
            <Text style={styles.percentageText}>({percentage.toFixed(1)}%)</Text>
          </View>

          <Text style={styles.limitText}>Rp {maxAmount.toLocaleString()}</Text>
        </View>

        <View style={styles.progressBg} onLayout={handleLayout}>
          <View style={[styles.progressFill, { width: fillWidth }]} />
        </View>

        <View style={{}}>
          <Text style={styles.label}>Uang diterima hari ini</Text>
          <Text style={styles.amount}>Rp {maxAmount.toLocaleString()}</Text>
        </View>
        {/* <View style={{ borderWidth: 0.5, borderColor: '#FFF', marginTop: 10 }} />
        <Text style={styles.labelReceived}>Uang diterima hari ini</Text>
        <Text style={styles.amountReceived}>Rp {amountReceived.toLocaleString()}</Text> */}
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
      fontSize: 15,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
      marginBottom: 4,
    },
    labelReceived: {
      color: colors.textWhite,
      fontSize: 16,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
      marginTop: 10,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    amount: {
      color: colors.textWhite,
      fontSize: 20,
      fontFamily: 'Switzer-Semibold',
      marginTop: 2,
    },
    amountReceived: {
      color: colors.textWhite,
      fontSize: 20,
      fontFamily: 'Switzer-Semibold',
      marginTop: 2,
    },
    percentageText: {
      color: colors.textWhite,
      fontSize: 14,
      fontFamily: 'Switzer-Regular',
    },
    progressBg: {
      height: 8,
      backgroundColor: 'rgba(255,255,255,0.2)',
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
  });
