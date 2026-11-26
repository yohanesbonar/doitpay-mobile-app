import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '../activateQris/styles';
import { useKycPrivacyPolicyUrl } from '@/features/kyc/hooks/useKycPrivacyPolicyUrl';
import { useKycConsentQuery } from '@/hooks/useKycConsentQuery';

interface KycPrivacyPolicyViewProps {
  onPressBack: () => void;
}

export const KycPrivacyPolicyView = ({ onPressBack }: KycPrivacyPolicyViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const privacyPolicyUrlQuery = useKycPrivacyPolicyUrl();
  const consentQuery = useKycConsentQuery();
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const privacyPolicyUrl =
    privacyPolicyUrlQuery.data || consentQuery.data?.privacyPolicyPublicUrl || '';
  const retryLoad = () => {
    if (!privacyPolicyUrl) {
      void Promise.all([privacyPolicyUrlQuery.refetch(), consentQuery.refetch()]);
    } else {
      setReloadKey((key) => key + 1);
    }
  };

  return (
    <View style={styles.termsPage}>
      <HeaderToolbar
        title="Kebijakan Privasi"
        titlePosition="left"
        titleStyle="medium"
        onPressBack={onPressBack}
        backgroundColor="#FFFFFF"
      />
      <View style={styles.termsWebView}>
        {privacyPolicyUrl ? (
          <>
            <WebView
              key={`${privacyPolicyUrl}-${reloadKey}`}
              source={{ uri: privacyPolicyUrl }}
              originWhitelist={['http://*', 'https://*']}
              onLoadStart={() => {
                setIsLoading(true);
                setHasLoadError(false);
              }}
              onLoadEnd={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasLoadError(true);
              }}
              onHttpError={() => {
                setIsLoading(false);
                setHasLoadError(true);
              }}
            />
            {isLoading ? (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  styles.termsPageLoading,
                  styles.webViewOverlay,
                ]}>
                <ActivityIndicator size="large" color="#3929CC" />
              </View>
            ) : null}
            {hasLoadError ? (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  styles.termsPageError,
                  styles.webViewOverlay,
                ]}>
                <Text style={styles.termsPageErrorText}>Kebijakan Privasi gagal dimuat.</Text>
                <TouchableOpacity onPress={retryLoad}>
                  <Text style={styles.termsPageRetryText}>Coba lagi</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        ) : (
          <View style={styles.termsPageError}>
            <Text style={styles.termsPageErrorText}>URL Kebijakan Privasi belum tersedia.</Text>
            <TouchableOpacity onPress={retryLoad}>
              <Text style={styles.termsPageRetryText}>Coba lagi</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.termsPageFooter}>
        <TouchableOpacity style={styles.termsPageButton} onPress={onPressBack}>
          <Text style={styles.termsPageButtonText}>Kembali ke persetujuan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webViewOverlay: {
    backgroundColor: '#FFFFFF',
    zIndex: 1,
    elevation: 1,
  },
});
