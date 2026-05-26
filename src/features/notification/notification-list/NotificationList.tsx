import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import { useGetNotificationListQuery } from '../hooks/useGetNotificationListQuery';
import { useReadNotificationMutation } from '../hooks/useReadNotificationMutation';
import NotificationItem from './components/NotificationItem';
import { NotificationListSkeleton } from './components/NotificationItemSkeleton';
import { Notification, NotificationGroup, NotificationSubType } from './types';

type Tab = { label: string; value: NotificationSubType | undefined };

const TABS: Tab[] = [
  { label: 'Semua', value: undefined },
  { label: 'Uang Masuk', value: 'incoming' },
  { label: 'Transfer', value: 'transfer' },
  { label: 'QRIS', value: 'qris' },
  { label: 'Refund', value: 'refund' },
  { label: 'Settlement', value: 'settlement' },
  { label: 'PIN', value: 'pin' },
  { label: 'Beneficiary', value: 'beneficiary' },
  { label: 'Login', value: 'login' },
  { label: 'Email', value: 'email' },
  { label: 'Akun', value: 'account' },
];

const getDateLabel = (createdAt: string): string => {
  const date = new Date(createdAt);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Hari ini';
  if (date.toDateString() === yesterday.toDateString()) return 'Kemarin';

  return format(date, 'd MMMM yyyy', { locale: id });
};

const groupByDate = (items: Notification[]): NotificationGroup[] => {
  const map = new Map<string, Notification[]>();

  for (const item of items) {
    const label = getDateLabel(item.createdAt);
    const existing = map.get(label) ?? [];
    map.set(label, [...existing, item]);
  }

  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
};

const NotificationItemRow = ({ item }: { item: Notification }) => {
  const { mutate: readNotification } = useReadNotificationMutation();

  return (
    <NotificationItem
      item={item}
      onPress={() => {
        if (!item.readAt) readNotification(item.id);
      }}
    />
  );
};

export const NotificationList = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();

  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);

  const { data, isLoading, isRefetching, refetch, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetNotificationListQuery({ subType: activeTab.value });

  const flatItems = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const sections = useMemo(() => groupByDate(flatItems), [flatItems]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifikasi</Text>
        </View>

        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.value ?? 'semua'}
                style={[styles.tabButton, activeTab.value === tab.value && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}>
                <Text
                  style={[styles.tabText, activeTab.value === tab.value && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {isLoading ? (
          <NotificationListSkeleton />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationItemRow item={item} />}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
            contentContainerStyle={[styles.listContent, { backgroundColor: '#F4F4F4' }]}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            stickySectionHeadersEnabled={false}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#4F84F6" style={{ paddingVertical: 16 }} />
              ) : null
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Tidak ada notifikasi</Text>
                <Text style={styles.emptyTextDesc}>Notifikasi kamu akan muncul di sini</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};
