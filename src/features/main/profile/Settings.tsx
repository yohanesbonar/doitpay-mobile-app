import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Globe, Clock } from 'lucide-react-native';
import { SettingItem } from '@/components/molecules/SettingsItem';
import DeviceInfo from 'react-native-device-info';
import { TermsAndConditionContent } from './components/TermsAndConditionContent';
import { PrivacyAndPolicyContent } from './components/PrivacyAndPolicyContent';
import { useGetNotificationsPreferences } from '@/features/notification/hooks/useGetNotificationsPreferencesQuery';
import { useUpdateNotificationPreferenceMutation } from '@/features/notification/hooks/useUpdateNotificationPreferenceMutation';
import { NotifKey } from '@/features/notification/types';

export const Settings = ({ navigation }: any) => {
  const appVersion = DeviceInfo.getVersion();

  const [openTnc, setOpenTnc] = useState<boolean>(false);
  const [openPnp, setOpenPnp] = useState<boolean>(false);

  const { data: notificationsPreferences } = useGetNotificationsPreferences();
  const { mutate: updatePreference, isPending } = useUpdateNotificationPreferenceMutation('');

  const categories = notificationsPreferences?.data?.categories;

  const toggleSwitch = (key: NotifKey) => {
    if (!notificationsPreferences?.data) return;
    const {
      emailEnabled,
      locale,
      pushEnabled,
      categories: currentCategories,
    } = notificationsPreferences.data;
    updatePreference({
      emailEnabled,
      locale,
      pushEnabled,
      categories: { ...currentCategories, [key]: !currentCategories[key] },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!openTnc && !openPnp && (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={24} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pengaturan</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <Text style={styles.sectionTitle}>UMUM</Text>
            <SettingItem title="Bahasa" sub="Bahasa Indonesia" icon={Globe} />
            <SettingItem title="Zona Waktu" sub="WIB (GMT+7)" icon={Clock} />

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>NOTIFIKASI</Text>
            <SettingItem
              title="General Notification"
              sub="Notifikasi transfer & keamanan"
              type="switch"
              value={categories?.security ?? false}
              onPress={() => toggleSwitch('security')}
              disabled={isPending}
            />
            <SettingItem
              title="Notifikasi Pembayaran"
              sub="VA diterima & Transfer selesai"
              type="switch"
              value={categories?.transaction ?? false}
              onPress={() => toggleSwitch('transaction')}
              disabled={isPending}
            />
            <SettingItem
              title="Pengingat Transfer"
              sub="Reminder jika VA belum dibayar"
              type="switch"
              value={categories?.system ?? false}
              onPress={() => toggleSwitch('system')}
              disabled={isPending}
            />
            <SettingItem
              title="Tips & Promosi"
              sub="Tips penggunaan & penawaran"
              type="switch"
              value={categories?.marketing ?? false}
              onPress={() => toggleSwitch('marketing')}
              disabled={isPending}
            />

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>TENTANG</Text>
            <SettingItem onPress={() => setOpenTnc(true)} title="Syarat & Ketentuan" />
            <SettingItem onPress={() => setOpenPnp(true)} title="Kebijakan Privasi" />
            <SettingItem title="Versi Aplikasi" sub={appVersion} />
          </ScrollView>
        </>
      )}

      {openTnc && <TermsAndConditionContent onClose={() => setOpenTnc(false)} />}
      {openPnp && <PrivacyAndPolicyContent onClose={() => setOpenPnp(false)} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 12, fontFamily: 'Switzer-Medium', color: '#737373', marginBottom: 8 },
});
