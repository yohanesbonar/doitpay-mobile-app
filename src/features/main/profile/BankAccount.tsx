import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { Trash2, Edit3, Plus, AlertCircle } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { useFocusEffect } from '@react-navigation/native';
import { useBankAccounts, useDeleteBankAccount } from '@/hooks/useMeMutation';

interface Account {
  id: string;
  bank: string;
  name: string;
  accNo: string;
  isVerified: boolean;
  isActive: boolean;
  image: any;
}

export const BankAccounts = ({ navigation }: any) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const { mutate: getBankAccounts, isPending: isGettingBankAccounts } = useBankAccounts();
  const { mutate: deleteBankAccount, isPending: isDeletingBankAccount } = useDeleteBankAccount();

  useFocusEffect(
    useCallback(() => {
      getBankAccounts(
        {},
        {
          onSuccess: (data) => {
            console.log('Fetched bank accounts:', data);
            const fetchedAccounts = data?.data || [];
            setAccounts(fetchedAccounts);
          },
          onError: (error) => {
            console.error('Error fetching bank accounts:', error);
          },
        },
      );
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Rekening', 'Apakah Anda yakin ingin menghapus rekening ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          deleteBankAccount(
            { id },
            {
              onSuccess: () => {
                setTimeout(() => {
                  getBankAccounts(
                    {},
                    {
                      onSuccess: (data) => {
                        console.log('Fetched bank accounts afters deletion:', data);
                        const fetchedAccounts = data?.data || [];
                        setAccounts(fetchedAccounts);
                      },
                      onError: (error) => {
                        console.error('Error fetching bank accounts after deletion:', error);
                      },
                    },
                  );
                }, 200);
              },
              onError: (error) => {
                // Handle error, e.g., show error message
              },
            },
          );
        },
      },
    ]);
  };

  const BankCard = ({ item }: { item: Account }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.bankInfo}>
          <View style={styles.bankLogoPlaceholder}>
            <Image
              source={{ uri: item?.bank?.logoUrl ?? item?.logoUrl ?? '' }}
              style={{ width: 80, height: 80 }}
              resizeMode="contain"
            />
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={styles.bankName}>{item?.bank?.shortName ?? item?.shortName ?? ''}</Text>
            <Text style={styles.accName}>{item.accountHolderName ?? ''}</Text>
            <Text style={styles.accNo}>{item.accountNumber ?? ''}</Text>
          </View>
        </View>
        {item.isVerified && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Terverifikasi</Text>
          </View>
        )}
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.btnSecondary} onPress={() => handleDelete(item.id)}>
          <Trash2 size={16} color="#E25C5C" />
          <Text style={[styles.btnText, { color: '#E25C5C' }]}>Hapus</Text>
        </TouchableOpacity>

        {item.isActive ? (
          <TouchableOpacity style={styles.btnSecondary}>
            <Edit3 size={16} color="#1A1A1A" />
            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnPrimary} onPress={() => handleSetActive(item.id)}>
            <Text style={styles.btnTextWhite}>Jadikan Aktif</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../../assets/images/ic-empty-bank.png')}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <Text style={styles.emptyTitle}>Belum ada rekening bank</Text>
      <Text style={styles.emptySubtitle}>
        Tambahkan rekening bank untuk menerima settlement dan menarik dana
      </Text>

      <TouchableOpacity
        style={styles.btnLargePrimary}
        onPress={() => navigation.navigate('BankList', { fromProfile: true })}>
        <Plus size={20} color="#FFF" />
        <Text style={styles.btnTextWhiteLarge}>Tambah Rekening Baru</Text>
      </TouchableOpacity>
    </View>
  );

  // const activeAccount = accounts.find((a) => a.isActive);
  // const otherAccounts = accounts.filter((a) => !a.isActive);

  let activeAccount = { ...accounts[0], isActive: true };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Rekening Bank"
        onPressBack={() => navigation.goBack()}
        titlePosition="left"
        titleStyle="Regular"
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {accounts.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            {activeAccount && (
              <View>
                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                  Rekening Settlement Aktif
                </Text>
                <View style={{ backgroundColor: '#FAFAFA', paddingHorizontal: 20, paddingTop: 12 }}>
                  <BankCard item={activeAccount} />
                </View>
              </View>
            )}

            {/* {otherAccounts.length > 0 && (
              <View style={{ marginTop: 8 }}>
                <Text style={styles.sectionLabel}>Rekening Lainnya</Text>
                {otherAccounts.map((acc) => (
                  <View
                    style={{ backgroundColor: '#FAFAFA', paddingHorizontal: 20, paddingTop: 12 }}
                    key={acc.id}>
                    <BankCard key={acc.id} item={acc} />
                  </View>
                ))}
              </View>
            )} */}

            {accounts.length === 0 && (
              <TouchableOpacity
                style={styles.btnAddOutline}
                onPress={() => navigation.navigate('BankList', { fromProfile: true })}>
                <Plus size={20} color="#1A1A1A" />
                <Text style={styles.btnAddText}>Tambah Rekening Baru</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <View style={styles.alertBox}>
          <AlertCircle size={20} color="#D4A017" />
          <Text style={styles.alertText}>
            Rekening harus atas nama yang sama dengan akun Doitpay{' '}
            <Text style={{ fontFamily: 'Switzer-Bold' }}>(Prabu Suwito)</Text>. Rekening atas nama
            berbeda tidak bisa ditambahkan.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: {},
  sectionLabel: {
    fontSize: 14,
    fontFamily: 'Switzer-Medium',
    color: '#1A1A1A',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    marginBottom: 16,
    backgroundColor: '#FFF',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  bankInfo: { flexDirection: 'row', gap: 12 },
  bankLogoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  bankName: { fontSize: 16, fontFamily: 'Switzer-Medium', color: '#1A1A1A' },
  accName: { fontSize: 14, fontFamily: 'Switzer-Regular', color: '#1A1A1A', marginTop: 4 },
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
    borderColor: '#D4D4D4',
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
    borderColor: '#D4D4D4',
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
    marginHorizontal: 20,
  },
  alertText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    color: '#1A1A1A',
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 240,
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Switzer-Bold',
    fontSize: 20,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginBottom: 32,
  },
  btnLargePrimary: {
    flexDirection: 'row',
    backgroundColor: '#4F84F6',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 30,
    marginHorizontal: 20,
  },
  btnTextWhiteLarge: {
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
    color: '#FFF',
  },
  btnAddOutline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 16,
    marginHorizontal: 20,
  },
  accNo: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#666',
  },
});
