import React, { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { DisputeReport } from '../types';
import { AlertCircle, CheckCircle2, Clock3, RefreshCw, XCircle } from 'lucide-react-native';
import { useDisputeListQuery } from './hooks/useDisputeListQuery';
import { ReportListItemApi } from './api/dispute-list-api';
import { useFocusEffect } from '@react-navigation/native';

type ListTab = 'aktif' | 'selesai';

const formatDate = (value?: string) => {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const mapApiStatusToDisputeStatus = (status?: string): DisputeReport['status'] => {
  const normalized = (status || '').toUpperCase();

  switch (normalized) {
    case 'REPORTED':
      return 'DIPROSES';
    case 'UNDER_REVIEW':
      return 'DIAJUKAN';
    case 'NEED_USER_FEEDBACK':
      return 'DIBUTUHKAN_INFO';
    case 'RESOLVED':
      return 'SELESAI';
    case 'REJECTED':
      return 'DITOLAK';
    default:
      return 'DIAJUKAN';
  }
};

const toDisputeReport = (item: ReportListItemApi): DisputeReport => ({
  id: item.id,
  transactionId: item.transactionId || item.orderReferenceId || item.id,
  issueType: item.reasonLabel ?? 'Lainnya',
  date: formatDate(item.createdAt || item.updatedAt),
  estimatedAt: item.estimatedAt,
  status: mapApiStatusToDisputeStatus(item.status),
  recipientName: '-',
  amount: 0,
  description: item.detail,
  attachmentCount: 0,
});

interface DisputeListViewProps {
  transactionId?: string;
  onPressBack: () => void;
  onPressReport: (report: DisputeReport) => void;
}

const statusPillConfig: Record<
  string,
  {
    label: string;
    color: string;
    bg: string;
    iconBg: string;
    iconColor: string;
    Icon: React.ComponentType<any>;
  }
> = {
  DIAJUKAN: {
    label: 'Ditinjau',
    color: '#404040',
    bg: '#D4D4D4',
    iconBg: '#D4D4D4',
    iconColor: '#404040',
    Icon: Clock3,
  },
  DIPROSES: {
    label: 'Diproses',
    color: '#3981FF',
    bg: '#EBF2FF',
    iconBg: '#EBF2FF',
    iconColor: '#3981FF',
    Icon: RefreshCw,
  },
  DIBUTUHKAN_INFO: {
    label: 'Butuh Tindakan',
    color: '#CA8A04',
    bg: '#FEF9C3',
    iconBg: '#FEF9C3',
    iconColor: '#CA8A04',
    Icon: AlertCircle,
  },
  SELESAI: {
    label: 'Selesai',
    color: '#16A34A',
    bg: '#DCFCE7',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    Icon: CheckCircle2,
  },
  DITOLAK: {
    label: 'Ditolak',
    color: '#DC2626',
    bg: '#E5E5E5',
    iconBg: '#E5E5E5',
    iconColor: '#DC2626',
    Icon: XCircle,
  },
};

export const DisputeListView = ({
  transactionId,
  onPressBack,
  onPressReport,
}: DisputeListViewProps) => {
  const [tab, setTab] = useState<ListTab>('aktif');
  const queryStatus = tab === 'aktif' ? 'ACTIVE' : 'DONE';

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useDisputeListQuery({ status: queryStatus, transactionId });

  const dataSource = useMemo(
    () => (data?.pages.flatMap((page) => page.items) || []).map(toDisputeReport),
    [data],
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar
        title="Laporan Saya"
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="medium"
        backgroundColor="#F5F5F7"
      />

      <View style={styles.container}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity
            style={[styles.tabButton, tab === 'aktif' && styles.tabButtonActive]}
            onPress={() => setTab('aktif')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, tab === 'aktif' && styles.tabTextActive]}>Aktif</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, tab === 'selesai' && styles.tabButtonActive]}
            onPress={() => setTab('selesai')}
            activeOpacity={0.8}>
            <Text style={[styles.tabText, tab === 'selesai' && styles.tabTextActive]}>Selesai</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="small" color="#3981FF" />
            <Text style={styles.loadingText}>Memuat laporan...</Text>
          </View>
        ) : dataSource.length === 0 ? (
          <View style={styles.emptyState}>
            <Image
              source={require('@/assets/images/ic-empty-report-list.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>Belum ada laporan</Text>
            <Text style={styles.emptyDesc}>
              Kalau ada masalah dengan transaksi, kamu bisa lapor langsung dari detail transaksi.
            </Text>
          </View>
        ) : (
          <FlatList
            data={dataSource}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.listContent}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#3981FF" style={{ paddingVertical: 16 }} />
              ) : null
            }
            renderItem={({ item }) => {
              const status = statusPillConfig[item.status] || statusPillConfig.DIAJUKAN;
              const StatusIcon = status.Icon;

              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => onPressReport(item)}
                  activeOpacity={0.85}>
                  <View style={[styles.leadingIconWrap, { backgroundColor: status.iconBg }]}>
                    <StatusIcon size={16} color={status.iconColor} strokeWidth={2.2} />
                  </View>

                  <View style={styles.cardHeader}>
                    <View style={styles.cardMainInfo}>
                      <Text
                        style={styles.issueType}
                        numberOfLines={2}
                        ellipsizeMode="tail">
                        {item.issueType}
                      </Text>
                      <Text style={styles.metaText}>{item.date}</Text>
                      <Text
                        style={styles.metaSubText}>
                        #{item.id}
                      </Text>
                    </View>
                    <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
                      <Text style={[styles.statusPillText, { color: status.color }]}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  tabWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D7D7DB',
    backgroundColor: '#F7F7F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E5E5',
  },
  tabText: {
    fontFamily: 'Switzer-Medium',
    color: '#262626',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#0A0A0A',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingWrapper: {
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 13,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDEE2',
    borderRadius: 9,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  leadingIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardMainInfo: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    marginRight: 12,
  },
  issueType: {
    color: '#000000',
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
    lineHeight: 20,
  },
  statusPill: {
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 16,
    alignSelf: 'flex-start',
    flexShrink: 0,
  },
  statusPillText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 12,
  },
  metaText: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    marginTop: 1,
  },
  metaSubText: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    marginTop: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  emptyTitle: {
    color: '#000000',
    fontFamily: 'Switzer-Medium',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyImage: {
    width: 250,
    height: 250,
  },
  emptyDesc: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
