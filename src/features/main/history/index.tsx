import React, { useState, useMemo } from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import HistoryItem from './components/HistoryItem';
import { IconNotification } from '@/assets/icons';
import { handleLogout } from '@/utils/Common';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterButton } from '@/components/molecules/FilterButton';
import { FilterBottomSheet } from '@/components/molecules/FilterBottomsheet';
import { DateBottomSheet } from '@/components/molecules/DateBottomsheet';
import { Calendar } from 'lucide-react-native';

const DATA_MOCK = [
  {
    title: 'April 2026',
    month: 3,
    year: 2026,
    data: [
      {
        id: '1',
        name: 'Joni Wahyu',
        type: 'BCA QRIS',
        time: '14:00 WIB',
        amount: -500000,
        category: 'Pengeluaran',
      },
      {
        id: '2',
        name: 'Joni Joni Yespapa',
        type: 'BCA Virtual Account',
        time: '16:00 WIB',
        amount: 500000,
        category: 'Pemasukan',
      },
      {
        id: '3',
        name: 'Kurniawan',
        type: 'BCA QRIS',
        time: '19:00 WIB',
        amount: -10000000,
        category: 'Pengeluaran',
      },
      {
        id: '4',
        name: 'Michelle',
        type: 'BCA QRIS',
        time: '12:00 WIB',
        amount: -8000000,
        category: 'Pengeluaran',
      },
    ],
  },
  {
    title: 'Maret 2026',
    month: 2,
    year: 2026,
    data: [
      {
        id: '5',
        name: 'Joni Wahyu',
        type: 'BCA QRIS',
        time: '14:00 WIB',
        amount: -500000,
        category: 'Pengeluaran',
      },
      {
        id: '6',
        name: 'Joni Kurniawa',
        type: 'BCA QRIS',
        time: '14:00 WIB',
        amount: 900000,
        category: 'Pemasukan',
      },
      {
        id: '7',
        name: 'Joni Michelle',
        type: 'BCA QRIS',
        time: '14:00 WIB',
        amount: -700000,
        category: 'Pengeluaran',
      },
    ],
  },
];

export const History = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    paymentType: 'Semua',
    transactionType: 'Semua',
  });

  const [selectedDate, setSelectedDate] = useState({ month: undefined, year: 2026 });

  const monthsLabel = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const filteredData = useMemo(() => {
    return DATA_MOCK.map((section) => {
      const isYearMatch = section.year === selectedDate.year;
      const isMonthMatch = selectedDate.month === undefined || section.month === selectedDate.month;
      const isDateMatch = isYearMatch && isMonthMatch;

      return {
        ...section,
        data: section.data.filter((item) => {
          const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

          const matchesPayment =
            activeFilters.paymentType === 'Semua' ||
            (item.type && item.type.includes(activeFilters.paymentType));

          const matchesType =
            activeFilters.transactionType === 'Semua' ||
            item.category === activeFilters.transactionType;

          return matchesSearch && matchesPayment && matchesType && isDateMatch;
        }),
      };
    }).filter((section) => section.data.length > 0);
  }, [searchQuery, activeFilters, selectedDate]);

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
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari transaksi"
          />
        </View>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Calendar size={18} color="#1A1A1A" />
            <Text style={styles.dateText}>
              {`${selectedDate?.month ? monthsLabel[selectedDate.month] : ''} ${selectedDate.year}`}
            </Text>
          </TouchableOpacity>

          <FilterButton onPress={() => setShowFilter(true)} />
        </View>

        <SectionList
          sections={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryItem item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={{
            paddingBottom: 120,
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

        <FilterBottomSheet
          isVisible={showFilter}
          onClose={() => setShowFilter(false)}
          filters={activeFilters}
          setFilters={setActiveFilters}
        />

        <DateBottomSheet
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      </View>
    </SafeAreaView>
  );
};
