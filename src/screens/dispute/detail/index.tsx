import React, { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeDetailView } from '@/features/dispute/detail';
import { DisputeReport } from '@/features/dispute/types';
import { useDisputeDetailQuery } from '@/features/dispute/detail/hooks/useDisputeDetailQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { disputeDetailApi } from '@/features/dispute/detail/api/dispute-detail-api';
import Toast from 'react-native-toast-message';

const DisputeDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialReport = route.params?.report as DisputeReport | undefined;
  const routeReportId = route.params?.reportId as string | undefined;
  const detailId = routeReportId || initialReport?.id;
  const queryClient = useQueryClient();

  const [statusOverride, setStatusOverride] = useState<DisputeReport['status'] | undefined>();
  const [showWithdrawSuccessModal, setShowWithdrawSuccessModal] = useState(false);
  const { data: detailData, refetch, isRefetching } = useDisputeDetailQuery(detailId);

  const { mutate: cancelReport } = useMutation({
    mutationFn: (id: string) => disputeDetailApi.cancelCustomerReport(id),
    onSuccess: async () => {
      setStatusOverride('DITARIK');
      await queryClient.invalidateQueries({ queryKey: ['dispute-list'] });
      await queryClient.refetchQueries({ queryKey: ['dispute-list'], type: 'active' });
      setShowWithdrawSuccessModal(true);
    },
    onError: (error: any) => {
      Toast.show({
        type: 'error',
        text1: error?.message || 'Gagal menarik laporan',
      });
    },
  });

  const baseReport = useMemo<DisputeReport>(() => {
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
        case 'DONE':
          return 'SELESAI';
        case 'REJECTED':
          return 'DITOLAK';
        default:
          return 'DIAJUKAN';
      }
    };

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

    const item = detailData?.data;
    if (!item) {
      return {
        id: detailId || '-',
        transactionId: '-',
        issueType: '-',
        date: '-',
        status: 'DIAJUKAN',
        recipientName: '-',
        amount: 0,
        description: '-',
        attachmentCount: 0,
      };
    }

    return {
      id: item.id || detailId || '-',
      transactionId: item.transactionId || item.orderReferenceId || item.id || '-',
      issueType: item.reasonLabel || item.customReason || 'Laporan Masalah',
      reopenedAt: item.reopenedAt,
      isReplied: item.isReplied,
      date: formatDate(item.createdAt || item.updatedAt),
      estimatedAt: item.estimatedAt,
      status: mapApiStatusToDisputeStatus(item.status),
      rawStatus: item.status,
      statusCheckpoints: item.statusCheckpoints,
      evidenceFiles: item.evidenceFiles,
      recipientName: '-',
      amount: 0,
      description: item.detail || '-',
      attachmentCount: item.evidenceFiles?.length ?? 0,
    };
  }, [detailData, detailId]);

  const report = useMemo(
    () => (statusOverride ? { ...baseReport, status: statusOverride } : baseReport),
    [baseReport, statusOverride],
  );

  return (
    <DisputeDetailView
      report={report}
      isRefreshing={isRefetching}
      onRefresh={() => {
        void refetch();
      }}
      onPressBack={() => navigation.goBack()}
      onWithdraw={() => {
        if (!detailId) {
          Toast.show({
            type: 'error',
            text1: 'ID laporan tidak tersedia',
          });
          return;
        }

        cancelReport(detailId);
      }}
      showWithdrawSuccessModal={showWithdrawSuccessModal}
      onCloseWithdrawSuccessModal={() => {
        setShowWithdrawSuccessModal(false);
        // navigate to maintabs
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }}
      onBackToDisputeList={() => {
        setShowWithdrawSuccessModal(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'DisputeList', params: { initialTab: 'selesai' } }],
        });
      }}
      onReopen={() =>
        navigation.navigate('DisputeAddResponse', {
          mode: 'reopen',
          report,
          reportId: report?.id,
        })
      }
      onAddResponse={() =>
        navigation.navigate('DisputeAddResponse', {
          mode: 'response',
          report,
          reportId: report?.id,
        })
      }
    />
  );
};

export default DisputeDetailScreen;
