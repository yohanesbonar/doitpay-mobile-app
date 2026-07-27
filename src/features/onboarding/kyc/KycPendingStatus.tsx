import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import IconPendingActivation from '@/assets/images/ic-pending-activation.svg';
import { useNavigation } from '@react-navigation/native';
import Button from '@/components/atoms/Button';
import { handleLogout } from '@/utils/Common';
import { SafeAreaView } from 'react-native-safe-area-context';

export const KycPendingStatus = () => {
  const navigation = useNavigation<any>();

  const handleChangeAccount = () => {
    handleLogout();
    navigation.reset({ index: 0, routes: [{ name: 'MainApp' }] });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.illustrationContainer}>
            <View style={styles.iconCircle}>
              <IconPendingActivation />
            </View>
          </View>

          <Text style={styles.title}>Verifikasi Akun Sedang{'\n'}Diproses</Text>
          <Text style={styles.subtitle}>
            Kami sedang meninjau data Anda. Proses verifikasi biasanya selesai dalam 1x24 jam. Kami
            akan mengirimkan notifikasi setelah akun berhasil diaktifkan.
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            type="regular"
            onPress={handleChangeAccount}
            title="Ganti Akun"
            color="#4A80F0"
            textColor="white"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  illustrationContainer: {
    marginBottom: 6,
    alignItems: 'center',
  },
  iconCircle: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Switzer-Semibold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});
