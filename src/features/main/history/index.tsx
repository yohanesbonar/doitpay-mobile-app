import React, { useState, useMemo } from 'react'; // Tambahkan useState & useMemo
import { View, Text, SectionList, TouchableOpacity, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import HistoryItem from './components/HistoryItem';
import { IconNotification } from '@/assets/icons';
import { handleLogout } from '@/utils/Common';
import { SearchBar } from '@/components/molecules/SearchBar'; // Gunakan yang baru dibuat
import { FilterButton } from '@/components/molecules/FilterButton';
import Toast from 'react-native-toast-message';

const DATA_MOCK = [
  {
    title: 'April',
    data: [
      { id: '1', name: 'Joni Wahyu', type: 'BCA QRIS', time: '14:00 WIB', amount: -500000 },
      { id: '2', name: 'Joni Joni Yespapa', type: 'BCA VA', time: '16:00 WIB', amount: 500000 },
      { id: '3', name: 'Kurniawan', type: 'BCA QRIS', time: '19:00 WIB', amount: -10000000 },
      { id: '4', name: 'Michelle', type: 'BCA QRIS', time: '12:00 WIB', amount: -8000000 },
    ],
  },
  {
    title: 'Maret 2026',
    data: [
      { id: '5', name: 'Joni Wahyu', type: 'BCA QRIS', time: '14:00 WIB', amount: -500000 },
      { id: '6', name: 'Joni Kurniawa', type: 'BCA QRIS', time: '14:00 WIB', amount: 900000 },
      { id: '7', name: 'Joni Michelle', type: 'BCA QRIS', time: '14:00 WIB', amount: -700000 },
    ],
  },
];

export const History = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return DATA_MOCK;

    return DATA_MOCK.map((section) => ({
      ...section,
      data: section.data.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    })).filter((section) => section.data.length > 0);
  }, [searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleOpenFilter = () => {
    Keyboard.dismiss();
    Toast.show({
      type: 'info',
      text1: 'Fitur Filter',
      text2: 'Fungsi filter akan segera hadir',
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>Riwayat</Text>
          <TouchableOpacity onPress={() => handleLogout()}>
            <IconNotification />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar value={searchQuery} onChangeText={handleSearch} placeholder="Cari Transaksi" />
          <FilterButton onPress={handleOpenFilter} />
        </View>

        <SectionList
          sections={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryItem item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={{
            paddingBottom: DATA_MOCK.length > 0 ? 120 : 16,
            backgroundColor: colors.pageBackground,
          }}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Transaksi tidak ditemukan</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};
