import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  onPress: () => void;
  isShow: boolean;
}

export const UnprotectedAccount = ({ onPress, isShow }: Props) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  if (!isShow) return null;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <Image
        source={require('../../../../assets/images/ic-warning-orange.png')}
        style={{ width: 40, height: 40, resizeMode: 'contain' }}
      />

      <View style={styles.textWrapper}>
        <Text style={styles.textTitle}>
          {t('home.unprotectedAccount')} <Text style={styles.textSub}>{t('home.verifyNow')}</Text>
        </Text>
      </View>

      <ChevronRight size={20} color="#1A1A1A" strokeWidth={2} />
    </TouchableOpacity>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#FEFCE8',
      borderRadius: 8,
      padding: 16,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      marginHorizontal: 24,
      marginTop: 14,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textWrapper: {
      flex: 1,
      marginLeft: 12,
    },
    textTitle: {
      color: '#CA8A04',
      fontFamily: 'Switzer-Bold',
      fontSize: 14,
      lineHeight: 20,
    },
    textSub: {
      fontFamily: 'Switzer-Regular',
      fontWeight: '400',
    },
  });
