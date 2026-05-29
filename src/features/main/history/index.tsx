import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import HistoryItem from './components/HistoryItem';
import { NotificationIconWithBadge } from '@/components/molecules/NotificationIconWithBadge';
import { SearchBar } from '@/components/molecules/SearchBar';
import { FilterButton } from '@/components/molecules/FilterButton';
import { FilterBottomSheet } from '@/components/molecules/FilterBottomsheet';
import { DateBottomSheet } from '@/components/molecules/DateBottomsheet';
import { Calendar, X } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useGetTransactionHistoriesQuery } from './hooks/useGetTransactionHistoriesQuery';
import { HistoryListSkeleton } from './components/HistoryItemSkeleton';
import type { GetTransactionHistoryQueries, TransactionItem } from './types';

const monthsLabel = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const groupByMonth = (transactions: TransactionItem[]) => {
  const groups: Record<string, { title: string; data: TransactionItem[] }> = {};
  const order: string[] = [];

  for (const tx of transactions) {
    const date = new Date(tx.createdAt);
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const key = `${year}-${monthIndex}`;

    if (!groups[key]) {
      groups[key] = { title: `${monthsLabel[monthIndex]} ${year}`, data: [] };
      order.push(key);
    }
    groups[key].data.push(tx);
  }

  return order.map((key) => groups[key]);
};

const currentYear = new Date().getFullYear();
const initialFilters = { paymentType: 'Semua', transactionType: 'Semua' };
const initialDate = { month: undefined as number | undefined, year: currentYear };

export const History = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const queryParams = useMemo<Omit<GetTransactionHistoryQueries, 'cursor'>>(() => {
    const params: Omit<GetTransactionHistoryQueries, 'cursor'> = {
      limit: 20,
      year: selectedDate.year,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedDate.month !== undefined) params.month = selectedDate.month + 1;
    if (activeFilters.paymentType !== 'Semua') {
      params.payment_type =
        activeFilters.paymentType === 'Virtual Account' ? 'VIRTUAL_ACCOUNT' : activeFilters.paymentType;
    }
    if (activeFilters.transactionType !== 'Semua') {
      params.transaction_type =
        activeFilters.transactionType === 'Pengeluaran' ? 'expense' : 'income';
    }

    return params;
  }, [debouncedSearch, selectedDate, activeFilters]);

  const {
    data: transactionHistoriesData,
    isLoading,
    isRefetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetTransactionHistoriesQuery(queryParams);

  const transactions = useMemo(
    () => transactionHistoriesData?.pages.flatMap((page) => page?.data?.items ?? []) ?? [],
    [transactionHistoriesData],
  );

  const sections = useMemo(() => groupByMonth(transactions), [transactions]);

  const filterCounter = useMemo(() => {
    let count = 0;
    if (activeFilters.paymentType !== 'Semua') count++;
    if (activeFilters.transactionType !== 'Semua') count++;
    return count;
  }, [activeFilters]);

  const isAnyFilterActive =
    filterCounter > 0 || selectedDate.month !== undefined || searchQuery !== '';

  const handleClearFilter = () => {
    setActiveFilters(initialFilters);
    setSelectedDate(initialDate);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>{t('history.title')}</Text>
          <NotificationIconWithBadge onPress={() => navigation.navigate('Notification')} />
        </View>

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
                {selectedDate.month !== undefined
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

        {isLoading ? (
          <HistoryListSkeleton />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <HistoryItem item={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 120,
              backgroundColor: transactions.length > 0 ? colors.pageBackground : '#FFF',
            }}
            stickySectionHeadersEnabled={false}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#4F84F6" style={{ marginVertical: 16 }} />
              ) : null
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Image
                  source={require('../../../assets/images/ic-empty-history.png')}
                  style={{ width: 191, height: 208, resizeMode: 'contain' }}
                />
                <Text style={styles.emptyText}>{t('history.transactionNotFound')}</Text>
                <Text style={styles.emptyTextDesc}>{t('history.descTransactionNotFound')}</Text>
              </View>
            )}
          />
        )}

        <FilterBottomSheet
          isVisible={showFilter}
          onClose={() => setShowFilter(false)}
          filters={activeFilters}
          setFilters={setActiveFilters}
        />

        <DateBottomSheet
          isVisible={showDatePicker}
          onClose={() => setShowDatePicker(false)}
          selectedDate={{ month: selectedDate.month ?? 0, year: selectedDate.year }}
          onSelect={setSelectedDate}
        />
      </View>
    </SafeAreaView>
  );
};
