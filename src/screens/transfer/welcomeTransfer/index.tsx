import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, CheckCircle2, Send, ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider';

const { height: screenHeight } = Dimensions.get('window');

const WelcomeTransferScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleStartTransfer = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      }),
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    hero: {
      minHeight: screenHeight * 0.58,
      backgroundColor: '#3981FF',
      paddingHorizontal: 24,
      paddingBottom: 105,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      marginBottom: -74,
    },
    heroBadge: {
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 7,
      borderColor: 'rgba(255,255,255,0.35)',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      marginBottom: 18,
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    title: {
      color: '#FFFFFF',
      fontSize: 28,
      fontFamily: 'Switzer-Semibold',
      textAlign: 'center',
    },
    subtitle: {
      color: '#FFFFFF',
      fontSize: 14,
      fontFamily: 'Switzer-Medium',
      textAlign: 'center',
      marginTop: 8,
      lineHeight: 20,
    },
    heroCurve: {
      position: 'absolute',
      left: -50,
      right: -50,
      bottom: -180,
      height: 320,
      backgroundColor: '#FFFFFF',
      borderTopLeftRadius: 290,
      borderTopRightRadius: 290,
      borderBottomLeftRadius: 230,
      borderBottomRightRadius: 230,
      transform: [{ scaleX: 1.3 }],
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingBottom: 24,
      justifyContent: 'space-between',
    },
    sectionTitle: {
      color: colors.black,
      fontSize: 20,
      fontFamily: 'Switzer-Semibold',
      marginBottom: 16,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#B7CCFF',
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 12,
      backgroundColor: '#FFFFFF',
      shadowColor: '#1D4ED8',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 2,
    },
    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: 8,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    cardTitle: {
      color: colors.black,
      fontSize: 16,
      fontFamily: 'Switzer-Medium',
      marginBottom: 3,
    },
    cardSubtitle: {
      color: '#000000',
      fontSize: 14,
      fontFamily: 'Switzer',
    },
    button: {
      backgroundColor: '#3981FF',
      borderRadius: 28,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#1D4ED8',
      shadowOpacity: 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      elevation: 3,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Switzer-Semibold',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Check size={50} color="#FFFFFF" strokeWidth={2.5} />
        </View>
        <Text style={styles.title}>{t('welcomeTransfer.title')}</Text>
        <Text style={styles.subtitle}>{t('welcomeTransfer.subtitle')}</Text>
        <View style={styles.heroCurve} />
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.sectionTitle}>{t('welcomeTransfer.sectionTitle')}</Text>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <Send size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t('welcomeTransfer.cardTransferTitle')}</Text>
              <Text style={styles.cardSubtitle}>{t('welcomeTransfer.cardTransferSubtitle')}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardIcon}>
              <ShieldCheck size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{t('welcomeTransfer.cardKycTitle')}</Text>
              <Text style={styles.cardSubtitle}>{t('welcomeTransfer.cardKycSubtitle')}</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.button} onPress={handleStartTransfer}>
          <Text style={styles.buttonText}>{t('welcomeTransfer.button')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeTransferScreen;
