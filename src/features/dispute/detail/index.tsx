import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { AlertCircle, Check, Copy, X } from 'lucide-react-native';
import { DisputeReport } from '../types';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

interface DisputeDetailViewProps {
  report: DisputeReport;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onPressBack: () => void;
  onWithdraw: () => void;
  showWithdrawSuccessModal?: boolean;
  onCloseWithdrawSuccessModal?: () => void;
  onBackToDisputeList?: () => void;
  onAddResponse: () => void;
  onReopen: () => void;
}

type TimelineStep = {
  label: string;
  time: string;
  isActive?: boolean;
  isCompleted?: boolean;
};

const fallbackTimelineSteps: TimelineStep[] = [
  { label: 'Dilaporkan', time: '21 Juni · 09:12' },
  { label: 'Diterima', time: '22 Juni · 09:12' },
  { label: 'Sedang Ditinjau', time: '23 Juni · 09:12' },
  { label: 'Menunggu Pihak Bank', time: '26 Juni · 09:12' },
  { label: 'Selesai', time: '30 Juni · 09:12' },
];

const checkpointLabelMap: Record<string, string> = {
  REPORTED: 'Dilaporkan',
  UNDER_REVIEW: 'Sedang Ditinjau',
  NEED_USER_FEEDBACK: 'Butuh Tindakan',
  DONE: 'Selesai',
  RESOLVED: 'Selesai',
  REJECTED: 'Ditolak',
};

const badgeLabelMap: Record<string, string> = {
  REPORTED: 'Diproses',
  UNDER_REVIEW: 'Ditinjau',
  NEED_USER_FEEDBACK: 'Butuh Tindakan',
  RESOLVED: 'Selesai',
  DONE: 'Selesai',
  REJECTED: 'Ditolak',
  CANCELED: 'Ditarik',
  DIAJUKAN: 'Ditinjau',
  DIPROSES: 'Diproses',
  DIBUTUHKAN_INFO: 'Butuh Tindakan',
  SELESAI: 'Selesai',
  DITARIK: 'Ditarik',
  DITOLAK: 'Ditolak',
};

const badgeStyleMap: Record<
  string,
  {
    color: string;
    bg: string;
  }
> = {
  DIAJUKAN: {
    color: '#404040',
    bg: '#D4D4D4',
  },
  DIPROSES: {
    color: '#3981FF',
    bg: '#EBF2FF',
  },
  DIBUTUHKAN_INFO: {
    color: '#CA8A04',
    bg: '#FEF9C3',
  },
  SELESAI: {
    color: '#16A34A',
    bg: '#DCFCE7',
  },
  DITARIK: {
    color: '#DC2626',
    bg: '#E5E5E5',
  },
  DITOLAK: {
    color: '#DC2626',
    bg: '#E5E5E5',
  },
};

const getProgressIndex = (status: DisputeReport['status']): number => {
  switch (status) {
    case 'DIAJUKAN':
      return 1;
    case 'DIPROSES':
      return 2;
    case 'DIBUTUHKAN_INFO':
      return 2;
    case 'SELESAI':
      return 4;
    case 'DITARIK':
    case 'DITOLAK':
      return 1;
    default:
      return 0;
  }
};

const formatTransactionCode = (transactionId: string): string => {
  const digits = transactionId.replace(/\D/g, '');
  if (!digits) return '#D12381';
  return `#D${digits.slice(-5)}`;
};

const formatEstimateDate = (value?: string): string => {
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

const formatCheckpointTime = (value?: string): string => {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const buildTimelineFromCheckpoints = (report: DisputeReport): TimelineStep[] => {
  const checkpoints = report.statusCheckpoints || [];

  if (checkpoints.length === 0) {
    return fallbackTimelineSteps;
  }

  return checkpoints.map((checkpoint) => {
    const normalizedStatus = (checkpoint.status || '').toUpperCase();
    const label = checkpointLabelMap[normalizedStatus] || normalizedStatus.replace(/_/g, ' ');

    return {
      label,
      time: formatCheckpointTime(checkpoint.timestamp),
      isActive: checkpoint.isActive,
      isCompleted: checkpoint.isCompleted,
    };
  });
};

export const DisputeDetailView = ({
  report,
  isRefreshing = false,
  onRefresh,
  onPressBack,
  onWithdraw,
  showWithdrawSuccessModal = false,
  onCloseWithdrawSuccessModal,
  onBackToDisputeList,
  onAddResponse,
  onReopen,
}: DisputeDetailViewProps) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  console.log('report', report);

  const timelineSteps = useMemo(() => buildTimelineFromCheckpoints(report), [report]);
  const hasDynamicFlags = (report.statusCheckpoints || []).length > 0;

  const progressIndex = getProgressIndex(report.status);
  const isNeedInfo = report.status === 'DIBUTUHKAN_INFO' || report.rawStatus === 'NEED_USER_FEEDBACK';
  const isDone = report.rawStatus === 'REJECTED' || report.rawStatus === 'RESOLVED';
  const isClosed = report.status === 'DITARIK';
  const badgeLabel =
    badgeLabelMap[(report.rawStatus || report.status || '').toUpperCase()] || 'Ditinjau';
  const badgeStyle = badgeStyleMap[report.status] || badgeStyleMap.DIAJUKAN;

  const handleCopyReportId = () => {
    const reportId = (report.id || '').trim();
    if (!reportId) {
      return;
    }

    Clipboard.setString(reportId);
    Toast.show({
      type: 'success',
      text1: 'ID laporan disalin',
    });
  };

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
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} tintColor="#3981FF" />
            ) : undefined
          }>
          <View style={styles.summaryCard}>
            <View style={styles.reportIdRow}>
              <Text style={styles.reportIdText}>{`ID#${report.id}`}</Text>
              <TouchableOpacity
                style={styles.copyIdButton}
                activeOpacity={0.8}
                onPress={handleCopyReportId}>
                <Copy size={18} color="#525252" />
              </TouchableOpacity>
            </View>

            <View style={styles.summaryTopRow}>
              <View>
                <Text style={styles.issueType}>{report.issueType}</Text>
                <Text style={styles.summaryMeta}>{`${report.date}`}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
                <Text style={[styles.badgeText, { color: badgeStyle.color }]}>{badgeLabel}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.estimateRow}>
              <Text style={styles.estimateLabel}>Estimasi selesai:</Text>
              <Text style={styles.estimateValue}>{formatEstimateDate(report.estimatedAt)}</Text>
            </View>
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Status</Text>

            {timelineSteps.map((step, index) => {
              const done = hasDynamicFlags
                ? Boolean(step.isCompleted)
                : isDone
                  ? index <= progressIndex
                  : index < progressIndex;
              const current = hasDynamicFlags
                ? !done && Boolean(step.isActive)
                : !isDone && index === progressIndex;
              const pending = !done && !current;

              if (step.isActive && report.rawStatus === 'CANCELED') {
                step.label = 'Ditarik';
              }

              return (
                <View key={`${step.label}-${index}`} style={styles.timelineItem}>
                  <View style={styles.indicatorColumn}>
                    <View
                      style={[
                        styles.statusCircle,
                        done && styles.statusCircleDone,
                        current && styles.statusCircleCurrent,
                        pending && styles.statusCirclePending,
                      ]}>
                      {done && <Check size={10} color="#1C9F4B" strokeWidth={3} />}
                    </View>
                    {index < timelineSteps.length - 1 && (
                      <View
                        style={[styles.connector, (done || current) && styles.connectorActive]}
                      />
                    )}
                  </View>

                  <View style={styles.timelineTextWrap}>
                    <Text
                      style={[
                        styles.timelineLabel,
                        (done || current) && styles.timelineLabelActive,
                        pending && styles.timelineLabelPending,
                      ]}>
                      {step.label}
                    </Text>
                    <Text style={[styles.timelineTime, pending && styles.timelineTimePending]}>
                      {step.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>

          {isNeedInfo && (
            <View style={styles.needInfoBox}>
              <View style={styles.needInfoIconWrap}>
                <AlertCircle size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.needInfoText}>
                Tim kami butuh informasi tambahan agar laporan bisa dilanjutkan.
              </Text>
            </View>
          )}
        </ScrollView>

        {!isClosed && (
          <View style={styles.footer}>
            {isDone ? (
              <TouchableOpacity
                style={styles.outlinePrimaryButton}
                activeOpacity={0.85}
                onPress={onReopen}>
                <Text style={styles.outlinePrimaryButtonText}>Buka Kembali Laporan</Text>
              </TouchableOpacity>
            ) : isNeedInfo ? (
              <>
                <TouchableOpacity
                  style={styles.outlinePrimaryButton}
                  activeOpacity={0.85}
                  onPress={onAddResponse}>
                  <Text style={styles.outlinePrimaryButtonText}>Balas Laporan</Text>
                </TouchableOpacity>

                {report.rawStatus !== 'CANCELED' && (
                  <TouchableOpacity
                    style={[styles.outlineDangerButton, styles.secondaryFooterButton]}
                    activeOpacity={0.85}
                    onPress={() => setShowWithdrawModal(true)}>
                    <Text style={styles.outlineDangerButtonText}>Tarik Laporan</Text>
                  </TouchableOpacity>
                )}
              </>
            ) : report.rawStatus !== 'CANCELED' ? (
              <TouchableOpacity
                style={styles.outlineDangerButton}
                activeOpacity={0.85}
                onPress={() => setShowWithdrawModal(true)}>
                <Text style={styles.outlineDangerButtonText}>Tarik Laporan</Text>
              </TouchableOpacity>
            ) : (
              <View style={{}}></View>
            )}
          </View>
        )}
      </View>

      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowWithdrawModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              activeOpacity={0.8}
              onPress={() => setShowWithdrawModal(false)}>
              <X size={24} color="#000000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Tarik laporan ini?</Text>
            <Text style={styles.modalDesc}>
              Laporan {report.id} akan ditutup. Kamu bisa melaporkan lagi nanti jika perlu.
            </Text>

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              activeOpacity={0.85}
              onPress={() => {
                setShowWithdrawModal(false);
                onWithdraw();
              }}>
              <Text style={styles.modalPrimaryButtonText}>Ya Tarik Laporan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              activeOpacity={0.85}
              onPress={() => setShowWithdrawModal(false)}>
              <Text style={styles.modalSecondaryButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showWithdrawSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={onCloseWithdrawSuccessModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.successModalCard}>
            <View style={styles.successIconCircle}>
              <Check size={36} color="#16A34A" strokeWidth={2.6} />
            </View>

            <Text style={styles.successTitle}>Laporan Berhasil Ditarik</Text>
            <Text style={styles.successDesc}>
              Laporan telah berhasil ditarik dan tidak akan diproses lebih lanjut. Anda dapat
              membuat laporan baru jika diperlukan.
            </Text>

            <TouchableOpacity
              style={styles.successPrimaryButton}
              activeOpacity={0.85}
              onPress={onBackToDisputeList}>
              <Text style={styles.successPrimaryButtonText}>Kembali ke Laporan Saya</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.successSecondaryButton}
              activeOpacity={0.85}
              onPress={onCloseWithdrawSuccessModal}>
              <Text style={styles.successSecondaryButtonText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  },
  content: {
    paddingTop: 8,
    paddingBottom: 120,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
    padding: 12,
    marginBottom: 14,
  },
  reportIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportIdText: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
  },
  copyIdButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueType: {
    color: '#000000',
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
  },
  summaryMeta: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EAF1FF',
  },
  badgeText: {
    color: '#3B82F6',
    fontFamily: 'Switzer-Medium',
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#DFDFDF',
    marginTop: 10,
    marginBottom: 10,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  estimateLabel: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 16,
  },
  estimateValue: {
    color: '#000000',
    fontFamily: 'Switzer-Semibold',
    fontSize: 20,
    lineHeight: 38,
  },
  statusCard: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    backgroundColor: '#F7F7F7',
    padding: 12,
  },
  statusTitle: {
    color: '#121212',
    fontFamily: 'Switzer-Bold',
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 8,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  indicatorColumn: {
    width: 22,
    alignItems: 'center',
  },
  statusCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCircleDone: {
    backgroundColor: '#B8F1CB',
    borderWidth: 1,
    borderColor: '#56CF86',
  },
  statusCircleCurrent: {
    backgroundColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#9CC0FF',
  },
  statusCirclePending: {
    backgroundColor: '#D9D9D9',
    borderWidth: 1,
    borderColor: '#CBCBCB',
  },
  connector: {
    width: 2,
    flex: 1,
    marginVertical: 2,
    backgroundColor: '#D9D9D9',
  },
  connectorActive: {
    backgroundColor: '#A8DFBC',
  },
  timelineTextWrap: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 10,
  },
  timelineLabel: {
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
    lineHeight: 20,
    color: '#1A1A1A',
  },
  timelineLabelActive: {
    color: '#1A1A1A',
  },
  timelineLabelPending: {
    color: '#A8A8A8',
  },
  timelineTime: {
    fontFamily: 'Switzer-Regular',
    fontSize: 10,
    lineHeight: 14,
    color: '#1A1A1A',
    marginTop: 2,
  },
  timelineTimePending: {
    color: '#A8A8A8',
  },
  needInfoBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5DDC0',
    borderRadius: 8,
    backgroundColor: '#F3EFD8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  needInfoIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#DFAF05',
    justifyContent: 'center',
    alignItems: 'center',
  },
  needInfoText: {
    flex: 1,
    color: '#C28500',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F5F5F7',
  },
  outlineDangerButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FF5A5A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineDangerButtonText: {
    color: '#FF5A5A',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  outlinePrimaryButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#4F84F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinePrimaryButtonText: {
    color: '#4F84F6',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  secondaryFooterButton: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  modalTitle: {
    color: '#000000',
    fontFamily: 'Switzer-Semibold',
    fontSize: 24,
    lineHeight: 38,
    marginTop: 6,
    marginBottom: 10,
  },
  modalDesc: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 14,
  },
  modalPrimaryButton: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButtonText: {
    color: '#DC2626',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  modalSecondaryButton: {
    marginTop: 8,
    height: 45,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSecondaryButtonText: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  sheetHandle: {
    width: 120,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    color: '#000000',
    fontFamily: 'Switzer-Semibold',
    fontSize: 24,
    lineHeight: 38,
    marginTop: 6,
  },
  sheetLabel: {
    marginTop: 16,
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  sheetInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    minHeight: 86,
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  sheetPrimaryButton: {
    height: 45,
    borderRadius: 22,
    backgroundColor: '#3981FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetPrimaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  sheetSecondaryButton: {
    marginTop: 10,
    height: 45,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DDDEE2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  sheetSecondaryButtonText: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  successModalCard: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 16,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#16A34A',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  successTitle: {
    color: '#111111',
    fontFamily: 'Switzer-Semibold',
    fontSize: 24,
    lineHeight: 38,
    marginBottom: 8,
  },
  successDesc: {
    color: '#121212',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    lineHeight: 24,
  },
  successPrimaryButton: {
    marginTop: 20,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#3981FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successPrimaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  successSecondaryButton: {
    marginTop: 10,
    height: 45,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#DDDEE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successSecondaryButtonText: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
});
