import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeDetailView } from '@/features/dispute/detail';
import { DisputeReport } from '@/features/dispute/types';

const DisputeDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialReport = route.params?.report as DisputeReport | undefined;

  const [report, setReport] = useState<DisputeReport>(
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
    },
  );

  return (
    <DisputeDetailView
      report={report}
      onPressBack={() => navigation.goBack()}
      onWithdraw={() => setReport((prev) => ({ ...prev, status: 'DITARIK' }))}
      onReopen={() => setReport((prev) => ({ ...prev, status: 'DIPROSES' }))}
      onAddResponse={() => navigation.navigate('DisputeAddResponse', { report })}
    />
  );
};

export default DisputeDetailScreen;
