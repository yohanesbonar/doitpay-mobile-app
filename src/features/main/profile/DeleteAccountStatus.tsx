import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2, XCircle } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useQueryClient } from '@tanstack/react-query';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import { useCancelAccountDeletion } from '@/hooks/useAuthMutation';
import FastImage from 'react-native-fast-image';
import { useAuthStore } from '@/storage/useAuthStore';

const DISABLED_FEATURES = ['Transfer', 'Terima Pembayaran', 'Rekening Bank'];
const ALLOWED_FEATURES = ['Login', 'Membatalkan Penghapusan'];

export const DeleteAccountStatus = () => {
  const navigation = useNavigation<any>();
  const queryClient = useQueryClient();
  const { mutate: cancelDeletion, isPending } = useCancelAccountDeletion();
  const logout = useAuthStore((state) => state.logout);
  const canGoBack = navigation.canGoBack();

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah kamu yakin ingin keluar?', [
      { text: 'Tidak', style: 'cancel' },
      {
        text: 'Ya, Keluar',
        style: 'destructive',
        onPress: () => {
          queryClient.clear();
          logout();
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('Batalkan Penghapusan', 'Apakah kamu yakin ingin membatalkan penghapusan akun?', [
      { text: 'Tidak', style: 'cancel' },
      {
        text: 'Ya, Batalkan',
        style: 'destructive',
        onPress: () => {
          cancelDeletion(undefined, {
            onSuccess: () => {
              queryClient.setQueryData(['profile-me'], (old: any) => ({
                ...old,
                data: { ...old?.data, isRequestDeleteAccount: false },
              }));
              queryClient.invalidateQueries({ queryKey: ['profile-me'] });
              Toast.show({ type: 'success', text1: 'Penghapusan akun berhasil dibatalkan' });
              if (canGoBack) {
                navigation.goBack();
              }
            },
            onError: (err: any) => {
              Toast.show({
                type: 'error',
                text1: err?.message || 'Gagal membatalkan penghapusan',
              });
            },
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Hapus Akun"
        onPressBack={canGoBack ? () => navigation.goBack() : undefined}
        titlePosition="left"
        titleStyle="regular"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.illustrationContainer}>
          <FastImage
            source={require('../../../assets/images/ic-account-deletion-pending.png')}
            style={{
              width: 220,
              height: 220,
            }}
          />
        </View>

        <Text style={styles.title}>Penghapusan Akun sedang{'\n'}Diproses</Text>
        <Text style={styles.subtitle}>
          Akun aka dihapus permanen pada 30 hari setelah pengajuan
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Fitur yang dinonaktifkan</Text>
          {DISABLED_FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <XCircle size={20} color="#E25C5C" strokeWidth={2} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, styles.cardGreen]}>
          <Text style={[styles.cardTitle, styles.cardTitleGreen]}>Kamu masih dapat</Text>
          {ALLOWED_FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <CheckCircle2 size={20} color="#16A34A" strokeWidth={2} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          type="regular"
          onPress={handleCancel}
          loading={isPending}
          title="Batalkan Penghapusan"
          color="#4A80F0"
          textColor="white"
        />
        {!canGoBack && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
  },
  illustrationContainer: {
    marginTop: 24,
    marginBottom: 20,
    alignItems: 'center',
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
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
  },
  cardGreen: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FFF4',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Switzer-Semibold',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  cardTitleGreen: {
    color: '#15803D',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#1A1A1A',
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
  logoutButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Switzer-Semibold',
    color: '#E25C5C',
  },
});
