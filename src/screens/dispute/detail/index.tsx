import React, { useMemo, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeDetailView } from '@/features/dispute/detail';
import { DisputeReport } from '@/features/dispute/types';
import { useDisputeDetailQuery } from '@/features/dispute/detail/hooks/useDisputeDetailQuery';

const DisputeDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialReport = route.params?.report as DisputeReport | undefined;
  const detailId = initialReport?.id;

  const [statusOverride, setStatusOverride] = useState<DisputeReport['status'] | undefined>();
  const {
    data: detailData,
    refetch,
    isRefetching,
  } = useDisputeDetailQuery(detailId);

  const baseReport = useMemo<DisputeReport>(() => {
    if (detailData?.data) {
      const item = detailData.data;

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
            return initialReport?.status || 'DIAJUKAN';
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

      return {
        id: item.id || initialReport?.id || '-',
        transactionId:
          item.transactionId || item.orderReferenceId || initialReport?.transactionId || item.id || '-',
        issueType: item.reasonLabel || item.customReason || initialReport?.issueType || 'Laporan Masalah',
        date: formatDate(item.createdAt || item.updatedAt || initialReport?.date),
        estimatedAt: item.estimatedAt || initialReport?.estimatedAt,
        status: mapApiStatusToDisputeStatus(item.status),
        statusCheckpoints: item.statusCheckpoints || initialReport?.statusCheckpoints,
        recipientName: initialReport?.recipientName || '-',
        amount: initialReport?.amount || 0,
        description: item.detail || initialReport?.description || '-',
        attachmentCount: item.evidenceFiles?.length ?? initialReport?.attachmentCount ?? 0,
      };
    }

    return (
      initialReport || {
        id: '-',
        transactionId: '-',
        issueType: 'Laporan Masalah',
        date: '-',
        status: 'DIAJUKAN',
        recipientName: '-',
        amount: 0,
        description: '-',
        attachmentCount: 0,
      }
    );
  }, [detailData, initialReport]);

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
      onWithdraw={() => setStatusOverride('DITARIK')}
      onReopen={() => setStatusOverride('DIPROSES')}
      onAddResponse={() => navigation.navigate('DisputeAddResponse', { report })}
    />
  );
};

export default DisputeDetailScreen;
