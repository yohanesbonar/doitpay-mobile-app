import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/atoms/Button';
import { useTheme } from '@/theme/ThemeProvider';
import ChangePinSuccessIllustration from '@/assets/icons/ic-change-pin.svg';

export const ChangePinSuccess = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  const handleGoHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={[styles.illustrationCircle, { backgroundColor: colors.pageBackground }]}>
          <ChangePinSuccessIllustration />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>PIN Berhasil Diperbarui</Text>
        <Text style={[styles.subtitle, { color: colors.description }]}>
          PIN baru kamu sudah aktif dan siap digunakan
        </Text>
      </View>

      <View style={styles.footer}>
        <Button
          type="regular"
          onPress={handleGoHome}
          title="Kembali ke Home"
          color={colors.buttonBlue}
          textColor="white"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  illustrationCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Switzer-Semibold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});
