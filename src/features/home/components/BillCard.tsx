import { useTheme } from '../../../theme/ThemeProvider';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  accountInfo: string;
}

export const BillCard = ({ title, accountInfo }: Props) => {
  const { colors } = useTheme();

  const styles = createStyles(colors);

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.badge}>
        <View style={styles.dot} />
        <Text style={styles.badgeText}>Tagihan Bulanan</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{accountInfo}</Text>
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundCard || 'white',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border || '#F0F0F0',
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EBF5FF',
      alignSelf: 'flex-start',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 20,
      marginBottom: 8,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#3B82F6',
      marginRight: 4,
    },
    badgeText: {
      fontSize: 14,
      color: '#3B82F6',
      fontFamily: 'Switzer-Regular',
    },
    title: {
      fontSize: 16,
      fontFamily: 'Switzer-Medium',
      color: colors.text,
    },
    subtitle: {
      fontSize: 12,
      color: colors.text,
      marginTop: 6,
      fontFamily: 'Switzer-Regular',
    },
  });
