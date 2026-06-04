import React, { useState, useMemo, FC } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
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
import { useDebounce } from '@/hooks/useDebounce';
import { HistoryListSkeleton } from './components/HistoryItemSkeleton';
import type { Transaction } from './types';
import { GetTransactionsQueries } from '@/features/transaction/types';
import { useGetTransactionsQuery } from '@/features/transaction/hooks/useGetTransactionHistoriesQuery';

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

const groupByMonth = (transactions: Transaction[]) => {
  const groups: Record<string, { title: string; data: Transaction[] }> = {};
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

interface HistoryProps {
  navigateToDetail: (transactionId: string) => void;
}

export const History: FC<HistoryProps> = ({ navigateToDetail }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const queryParams = useMemo<Omit<GetTransactionsQueries, 'cursor'>>(() => {
    const params: Omit<GetTransactionsQueries, 'cursor'> = {
      limit: 20,
      year: selectedDate.year,
    };

    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedDate.month !== undefined) params.month = selectedDate.month + 1;
    if (activeFilters.paymentType !== 'Semua') {
      params.payment_type =
        activeFilters.paymentType === 'Virtual Account'
          ? 'VIRTUAL_ACCOUNT'
          : activeFilters.paymentType;
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
  } = useGetTransactionsQuery(queryParams);

  const transactions = useMemo(
    () => transactionHistoriesData?.pages.flatMap((page) => page?.data?.items ?? []) ?? [],
    [transactionHistoriesData],
  );

  console.log(transactions, 'TRANSACTIONS');

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
            renderItem={({ item }) => (
              <Pressable style={{ marginHorizontal: 24 }} onPress={() => navigateToDetail(item.id)}>
                <HistoryItem item={item} />
              </Pressable>
            )}
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
