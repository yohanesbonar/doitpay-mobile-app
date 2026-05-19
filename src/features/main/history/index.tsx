import React, { useState, useMemo, useRef } from 'react';
import { View, Text, SectionList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
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
import { Calendar, Navigation, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useGetTransactionHistoriesQuery } from './hooks/useGetTransactionHistoriesQuery';
import { BottomSheetModal } from '@gorhom/bottom-sheet';

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
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const filterSheetRef = useRef<BottomSheetModal>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState(DATA_MOCK);

  const {
    data: transactionHistoriesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTransactionHistoriesQuery();

  const transactionHistories = transactionHistoriesData?.pages.flatMap(
    (page) => page?.result?.data ?? [],
  );

  const initialFilters = {
    paymentType: 'Semua',
    transactionType: 'Semua',
  };
  const initialDate = { month: undefined, year: 2026 };

  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const filterCounter = useMemo(() => {
    let count = 0;
    if (activeFilters.paymentType !== 'Semua') count++;
    if (activeFilters.transactionType !== 'Semua') count++;
    return count;
  }, [activeFilters]);

  const isAnyFilterActive = useMemo(() => {
    return filterCounter > 0 || selectedDate.month !== undefined || searchQuery !== '';
  }, [filterCounter, selectedDate, searchQuery]);

  const handleClearFilter = () => {
    setActiveFilters(initialFilters);
    setSelectedDate(initialDate);
    setSearchQuery('');
  };

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
    return data
      .map((section) => {
        const isYearMatch = section.year === selectedDate.year;
        const isMonthMatch =
          selectedDate.month === undefined || section.month === selectedDate.month;
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
      })
      .filter((section) => section.data.length > 0);
  }, [searchQuery, activeFilters, selectedDate, data]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>{t('history.title')}</Text>
          <TouchableOpacity onPress={() => handleLogout()}>
            <IconNotification />
          </TouchableOpacity>
        </View>

        {data?.length > 0 && (
          <View>
            <View style={styles.searchContainer}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={t('history.searchTransaction')}
              />
            </View>

            <View style={styles.filterContainer}>
              <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
                <Calendar size={18} color="#1A1A1A" />
                <Text style={styles.dateText}>
                  {selectedDate?.month !== undefined
                    ? `${monthsLabel[selectedDate.month]} ${selectedDate.year}`
                    : `${selectedDate.year}`}
                </Text>
              </TouchableOpacity>

              <FilterButton onPress={() => setShowFilter(true)} count={filterCounter} />

              {isAnyFilterActive && (
                <TouchableOpacity style={styles.clearFilterButton} onPress={handleClearFilter}>
                  <X size={16} color="#E25C5C" />
                  <Text style={styles.clearFilterText}>{t('history.clearFilter')}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <SectionList
          sections={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryItem item={item} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 120,
            backgroundColor: data?.length > 0 ? colors.pageBackground : '#FFF',
          }}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null
          }
          ListEmptyComponent={() =>
            isLoading ? (
              <ActivityIndicator style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.emptyState}>
                <Image
                  source={require('../../../assets/images/ic-empty-history.png')}
                  style={{ width: 191, height: 208, resizeMode: 'contain' }}
                />
                <Text style={styles.emptyText}>{t('history.transactionNotFound')}</Text>
                <Text style={styles.emptyTextDesc}>{t('history.descTransactionNotFound')}</Text>
              </View>
            )
          }
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
