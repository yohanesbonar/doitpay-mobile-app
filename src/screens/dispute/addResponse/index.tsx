import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DisputeAddResponseView } from '@/features/dispute/addResponse';
import { DisputeReport } from '@/features/dispute/types';

const DisputeAddResponseScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const report = route.params?.report as DisputeReport | undefined;
  const mode = (route.params?.mode as 'response' | 'reopen' | undefined) || 'response';
  const reportId = (route.params?.reportId as string | undefined) || report?.id || '-';

  return (
    <DisputeAddResponseView
      mode={mode}
      report={report}
      reportId={reportId}
      onPressBack={() => navigation.goBack()}
      onSubmitSuccess={() => {
        if (mode === 'reopen') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'DisputeList', params: { initialTab: 'selesai' } }],
          });
          return;
        }

        navigation.goBack();
      }}
    />
  );
};

export default DisputeAddResponseScreen;
