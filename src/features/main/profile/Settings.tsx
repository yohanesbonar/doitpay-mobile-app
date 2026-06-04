import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Globe, Clock, Trash2 } from 'lucide-react-native';
import { SettingItem } from '@/components/molecules/SettingsItem';
import DeviceInfo from 'react-native-device-info';
import { TermsAndConditionContent } from './components/TermsAndConditionContent';
import { PrivacyAndPolicyContent } from './components/PrivacyAndPolicyContent';
import { useGetNotificationsPreferences } from '@/features/notification/hooks/useGetNotificationsPreferencesQuery';
import { useUpdateNotificationPreferenceMutation } from '@/features/notification/hooks/useUpdateNotificationPreferenceMutation';
import { NotifKey, NotificationPreference } from '@/features/notification/types';

export const Settings = ({ navigation }: any) => {
  const appVersion = DeviceInfo.getVersion();

  const [openTnc, setOpenTnc] = useState<boolean>(false);
  const [openPnp, setOpenPnp] = useState<boolean>(false);

  const { data: notificationsPreferences } = useGetNotificationsPreferences();

  const serverCategories = notificationsPreferences?.data?.categories;
  const [optimisticCategories, setOptimisticCategories] = useState<
    NotificationPreference['categories'] | undefined
  >(undefined);

  const categories = optimisticCategories ?? serverCategories;

  const { mutate: updatePreference, isPending } = useUpdateNotificationPreferenceMutation('', {
    onError: () => setOptimisticCategories(undefined),
  });

  const toggleSwitch = (key: NotifKey) => {
    if (!notificationsPreferences?.data) return;
    const {
      emailEnabled,
      locale,
      pushEnabled,
      categories: currentCategories,
    } = notificationsPreferences.data;
    const newCategories = { ...currentCategories, [key]: !currentCategories[key] };
    setOptimisticCategories(newCategories);
    updatePreference({
      emailEnabled,
      locale,
      pushEnabled,
      categories: newCategories,
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.content, { paddingBottom: 40 }]}>
            <Text style={styles.sectionTitle}>UMUM</Text>
            <SettingItem title="Bahasa" sub="Bahasa Indonesia" icon={Globe} />
            <SettingItem title="Zona Waktu" sub="WIB (GMT+7)" icon={Clock} />

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>NOTIFIKASI</Text>
            <SettingItem
              title="General Notification"
              sub="Notifikasi transfer & keamanan"
              type="switch"
              value={categories?.general ?? false}
              onPress={() => toggleSwitch('general')}
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
              value={categories?.reminder ?? false}
              onPress={() => toggleSwitch('reminder')}
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

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>AKUN</Text>
            <TouchableOpacity
              style={styles.deleteItem}
              onPress={() => navigation.navigate('DeleteAccount')}
              activeOpacity={0.7}>
              <View style={styles.deleteItemLeft}>
                <Trash2 size={22} color="#E25C5C" strokeWidth={1.5} />
                <View>
                  <Text style={styles.deleteItemTitle}>Hapus Akun</Text>
                  <Text style={styles.deleteItemSub}>Hapus akun dan data secara permanen</Text>
                </View>
              </View>
              <ChevronLeft
                size={20}
                color="#E25C5C"
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </TouchableOpacity>
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
  deleteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  deleteItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deleteItemTitle: {
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
    color: '#E25C5C',
  },
  deleteItemSub: {
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    color: '#E25C5C',
    marginTop: 2,
    opacity: 0.7,
  },
});
