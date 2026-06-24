import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { ACTIVE_REPORTS, DisputeReport, FINISHED_REPORTS } from '../types';
import { AlertCircle, CheckCircle2, Clock3, RefreshCw, XCircle } from 'lucide-react-native';

type ListTab = 'aktif' | 'selesai';

interface DisputeListViewProps {
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
    color: '#737373',
    bg: '#E7E7E7',
    iconBg: '#E5E5E5',
    iconColor: '#737373',
    Icon: Clock3,
  },
  DIPROSES: {
    label: 'Diproses',
    color: '#3981FF',
    bg: '#E7F0FF',
    iconBg: '#E7F0FF',
    iconColor: '#3981FF',
    Icon: RefreshCw,
  },
  DIBUTUHKAN_INFO: {
    label: 'Butuh Tindakan',
    color: '#D9A10D',
    bg: '#FFF4D1',
    iconBg: '#FFF4D1',
    iconColor: '#D9A10D',
    Icon: AlertCircle,
  },
  SELESAI: {
    label: 'Selesai',
    color: '#22B35A',
    bg: '#DFF8E8',
    iconBg: '#DFF8E8',
    iconColor: '#22B35A',
    Icon: CheckCircle2,
  },
  DITARIK: {
    label: 'Ditarik',
    color: '#737373',
    bg: '#E7E7E7',
    iconBg: '#E5E5E5',
    iconColor: '#737373',
    Icon: Clock3,
  },
  DITOLAK: {
    label: 'Ditolak',
    color: '#FF5A5A',
    bg: '#FFE3E3',
    iconBg: '#FFE3E3',
    iconColor: '#FF5A5A',
    Icon: XCircle,
  },
};

export const DisputeListView = ({ onPressBack, onPressReport }: DisputeListViewProps) => {
  const [tab, setTab] = useState<ListTab>('aktif');

  const data = useMemo(() => (tab === 'aktif' ? ACTIVE_REPORTS : FINISHED_REPORTS), [tab]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar
        title="Laporan Saya"
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="bold"
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

        {data.length === 0 ? (
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
            data={data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
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
                    <View>
                      <Text style={styles.issueType}>{item.issueType}</Text>
                      <Text style={styles.metaText}>
                        {item.date} #{item.transactionId}
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  issueType: {
    color: '#000000',
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
  },
  statusPill: {
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginLeft: 10,
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
