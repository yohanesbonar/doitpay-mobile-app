import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Trash2, Edit3, Plus, AlertCircle } from 'lucide-react-native';

export const BankAccounts = ({ navigation }: any) => {
  const BankCard = ({ bank, name, accNo, isVerified, isActive, type }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.bankInfo}>
          <View style={styles.bankLogoPlaceholder} />
          <View>
            <Text style={styles.bankName}>{bank}</Text>
            <Text style={styles.accName}>{name}</Text>
            <Text style={styles.accName}>{accNo}</Text>
          </View>
        </View>
        {isVerified && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Terverifikasi</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnSecondary}>
          <Trash2 size={16} color="#E25C5C" />
          <Text style={[styles.btnText, { color: '#E25C5C' }]}>Hapus</Text>
        </TouchableOpacity>

        {type === 'settlement' ? (
          <TouchableOpacity style={styles.btnSecondary}>
            <Edit3 size={16} color="#1A1A1A" />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnPrimary}>
            <Text style={styles.btnTextWhite}>Jadikan Aktif</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rekening Bank</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Rekening Settlement Aktif</Text>
        <BankCard
          bank="Bank BCA"
          name="Prabu Suwito"
          accNo="0498374820"
          isVerified
          type="settlement"
        />

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Rekening Lainnya</Text>
        <BankCard bank="Bank BRI" name="Prabu Suwito" accNo="0498374820" />

        <TouchableOpacity style={styles.btnAdd}>
          <Plus size={20} color="#1A1A1A" />
          <Text style={styles.btnAddText}>Tambah Rekening Baru</Text>
        </TouchableOpacity>

        <View style={styles.alertBox}>
          <AlertCircle size={20} color="#D4A017" />
          <Text style={styles.alertText}>
            Rekening harus atas nama yang sama dengan akun Doitpay{' '}
            <Text style={{ fontFamily: 'Switzer-Bold' }}>(Prabu Suwito)</Text>. Rekening atas nama
            berbeda tidak bisa ditambahkan.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: { paddingHorizontal: 20 },
  sectionLabel: { fontSize: 14, fontFamily: 'Switzer-Medium', color: '#1A1A1A', marginBottom: 12 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bankInfo: { flexDirection: 'row', gap: 12 },
  bankLogoPlaceholder: { width: 40, height: 40, backgroundColor: '#F5F5F5', borderRadius: 8 },
  bankName: { fontSize: 16, fontFamily: 'Switzer-Bold', color: '#1A1A1A' },
  accName: { fontSize: 14, fontFamily: 'Switzer-Regular', color: '#1A1A1A' },
  badge: { backgroundColor: '#E8F5E9', padding: 4, borderRadius: 6 },
  badgeText: { fontSize: 10, color: '#4CAF50', fontFamily: 'Switzer-Medium' },
  cardActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: '#4F84F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 20,
  },
  btnText: { fontSize: 14, fontFamily: 'Switzer-Medium' },
  btnTextWhite: { fontSize: 14, fontFamily: 'Switzer-Medium', color: '#FFF' },
  btnAdd: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 8,
  },
  btnAddText: { fontSize: 14, fontFamily: 'Switzer-Medium', color: '#1A1A1A' },
  alertBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFBE6',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    color: '#1A1A1A',
    lineHeight: 18,
  },
});
