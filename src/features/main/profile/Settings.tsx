import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Globe, Clock } from 'lucide-react-native';
import { SettingItem } from '@/components/molecules/SettingsItem';

export const Settings = ({ navigation }: any) => {
  const [notifStates, setNotifStates] = useState({
    general: true,
    payment: true,
    transfer: true,
    promo: true,
  });

  const toggleSwitch = (key: keyof typeof notifStates) => {
    setNotifStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          value={notifStates.general}
          onPress={() => toggleSwitch('general')}
        />
        <SettingItem
          title="Notifikasi Pembayaran"
          sub="VA diterima & Transfer selesai"
          type="switch"
          value={notifStates.payment}
          onPress={() => toggleSwitch('payment')}
        />
        <SettingItem
          title="Pengingat Transfer"
          sub="Reminder jika VA belum dibayar"
          type="switch"
          value={notifStates.transfer}
          onPress={() => toggleSwitch('transfer')}
        />
        <SettingItem
          title="Tips & Promosi"
          sub="Tips penggunaan & penawaran"
          type="switch"
          value={notifStates.promo}
          onPress={() => toggleSwitch('promo')}
        />

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>TENTANG</Text>
        <SettingItem title="Syarat & Ketentuan" />
        <SettingItem title="Kebijakan Privasi" />
        <SettingItem title="Versi Aplikasi" sub="1.0" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 12, fontFamily: 'Switzer-Medium', color: '#737373', marginBottom: 8 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemTitle: { fontSize: 16, fontFamily: 'Switzer-Medium', color: '#1A1A1A' },
  itemSub: { fontSize: 12, fontFamily: 'Switzer-Regular', color: '#737373', marginTop: 2 },
});
