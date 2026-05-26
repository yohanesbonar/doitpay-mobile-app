import React, { useState } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import library ini
import { useTheme } from '../../../../theme/ThemeProvider';

interface Props {
  usedAmount: number;
  maxAmount: number;
  percentage: number;
}

export const TransferLimitCard = ({ usedAmount, maxAmount, percentage }: Props) => {
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
          <Text style={styles.amount}>Rp {usedAmount.toLocaleString()}</Text>
          <Text style={styles.percentageText}>{percentage.toFixed(2)}%</Text>
        </View>

        <View style={styles.progressBg} onLayout={handleLayout}>
          <View style={[styles.progressFill, { width: fillWidth }]} />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.limitText}>Rp 0</Text>
          <Text style={styles.limitText}>Rp {maxAmount.toLocaleString()}</Text>
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
      fontSize: 18,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
      marginTop: 6,
    },
    rowBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
    amount: {
      color: colors.textWhite,
      fontSize: 28,
      fontFamily: 'Switzer-Semibold',
      marginTop: 2,
    },
    percentageText: {
      color: colors.textWhite,
      fontSize: 20,
      fontFamily: 'Switzer-Semibold',
      marginBottom: 4,
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
      fontSize: 16,
      fontFamily: 'Switzer-Regular',
      opacity: 0.9,
    },
  });
