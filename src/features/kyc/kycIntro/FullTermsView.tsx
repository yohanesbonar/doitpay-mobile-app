import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '../activateQris/styles';
import { KycTermsWebView } from './KycTermsWebView';
import { useKycConsentQuery } from '@/hooks/useKycConsentQuery';
import { KYC_PRIVACY_POLICY_URL } from './termsData';

interface FullTermsViewProps {
  onPressBack: () => void;
}

export const FullTermsView = ({ onPressBack }: FullTermsViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const consentQuery = useKycConsentQuery();

  return (
    <View style={styles.termsPage}>
      <HeaderToolbar
        title="Ketentuan Verifikasi Identitas"
        titlePosition="left"
        titleStyle="medium"
        onPressBack={onPressBack}
        backgroundColor="#FFFFFF"
      />
      {consentQuery.data ? (
        <KycTermsWebView
          style={styles.termsWebView}
          html={consentQuery.data.content}
          privacyPolicyUrl={consentQuery.data.privacyPolicyPublicUrl || KYC_PRIVACY_POLICY_URL}
          baseUrl={consentQuery.data.tncPublicUrl || consentQuery.data.publicUrl}
        />
      ) : consentQuery.isError ? (
        <View style={styles.termsPageError}>
          <Text style={styles.termsPageErrorText}>Ketentuan gagal dimuat.</Text>
          <TouchableOpacity onPress={() => consentQuery.refetch()}>
            <Text style={styles.termsPageRetryText}>Coba lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.termsPageLoading}>
          <ActivityIndicator size="large" color="#3929CC" />
        </View>
      )}
      <View style={styles.termsPageFooter}>
        <TouchableOpacity style={styles.termsPageButton} onPress={onPressBack}>
          <Text style={styles.termsPageButtonText}>Kembali ke persetujuan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
