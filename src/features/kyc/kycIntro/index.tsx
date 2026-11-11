import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createStyles } from '../activateQris/styles';
import { Check, ExternalLink, File, Image, X } from 'lucide-react-native';
import { KYC_CONSENT_ACKNOWLEDGEMENT, KYC_PRIVACY_POLICY_URL } from './termsData';
import { KycTermsWebView } from './KycTermsWebView';
import { useKycConsentQuery } from '@/hooks/useKycConsentQuery';
import { useKycStatusQuery } from '@/hooks/useKycStatusQuery';
import { useAcceptKycConsent } from '@/hooks/useAcceptKycConsent';

interface KycIntroViewProps {
  onPressBack: () => void;
  onPressContinueKyc: () => void;
  onPressSkip: () => void;
  onPressReadFullTerms?: () => void;
  termsSheetRestoreKey?: number;
  isOnboardingFlow?: boolean;
}

// Entry point to KYC for newly registered users who received an access token from pin-setup.
// Layout mirrors ActivateQrisView (KYC_INCOMPLETE state) minus the status banner.
export const KycIntroView = ({
  onPressBack,
  onPressContinueKyc,
  onPressSkip,
  onPressReadFullTerms,
  termsSheetRestoreKey = 0,
  isOnboardingFlow = false,
}: KycIntroViewProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const [isTermsVisible, setIsTermsVisible] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isTermsLoadError, setIsTermsLoadError] = useState(false);
  const [isCheckingConsent, setIsCheckingConsent] = useState(false);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [isAcceptError, setIsAcceptError] = useState(false);
  const consentQuery = useKycConsentQuery({ enabled: false });
  const statusQuery = useKycStatusQuery({ enabled: false });
  const acceptConsent = useAcceptKycConsent();
  const isTermsUpdated = Boolean(
    statusQuery.data?.consent &&
    !statusQuery.data.consent.hasAcceptedCurrentVersion &&
    statusQuery.data.consent.acceptedVersion,
  );
  const privacyPolicyUrl = consentQuery.data?.privacyPolicyPublicUrl || KYC_PRIVACY_POLICY_URL;

  useEffect(() => {
    if (termsSheetRestoreKey > 0) setIsTermsVisible(true);
  }, [termsSheetRestoreKey]);

  const openPrivacyPolicy = async () => Linking.openURL(privacyPolicyUrl);

  const refreshConsentState = async () => {
    setIsCheckingConsent(true);
    setIsTermsLoadError(false);
    setIsAcceptError(false);
    setHasAcceptedTerms(false);

    try {
      const [consentResult, statusResult] = await Promise.all([
        consentQuery.refetch(),
        statusQuery.refetch(),
      ]);

      // An already accepted active version skips the consent sheet entirely.
      if (
        !consentResult.isError &&
        !statusResult.isError &&
        statusResult.data?.consent?.hasAcceptedCurrentVersion &&
        statusResult.data.consent.currentVersion === consentResult.data?.version
      ) {
        setIsTermsVisible(false);
        onPressContinueKyc();
        return;
      }

      setIsTermsLoadError(consentResult.isError || statusResult.isError || !consentResult.data);
      setIsTermsVisible(true);
    } catch {
      setIsTermsLoadError(true);
      setIsTermsVisible(true);
    } finally {
      setIsCheckingConsent(false);
    }
  };

  const handleOpenConsent = () => {
    void refreshConsentState();
  };

  const handleRetryTerms = () => {
    void refreshConsentState();
  };

  const handleAcceptTerms = async () => {
    const version = consentQuery.data?.version;
    if (!hasAcceptedTerms || !version || isTermsLoadError || isCheckingConsent || isSavingConsent) {
      return;
    }

    setIsSavingConsent(true);
    setIsAcceptError(false);
    try {
      await acceptConsent.mutateAsync(version);
      setIsTermsVisible(false);
      onPressContinueKyc();
    } catch (error: any) {
      const errorCode = error?.response?.data?.error?.code;
      if (errorCode === 'KYC_CONSENT_VERSION_MISMATCH') {
        await refreshConsentState();
      } else {
        setIsAcceptError(true);
      }
    } finally {
      setIsSavingConsent(false);
    }
  };

  const renderInfoItem = ({
    title,
    description,
    icon,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }) => (
    <View style={styles.itemRow}>
      <View style={[styles.itemIconContainer, styles.itemIconContainerNeutral]}>{icon}</View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDesc}>{description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="KYC"
        titlePosition="center"
        titleStyle="medium"
        onPressBack={onPressBack}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>KYC (Know Your Customer)</Text>
        <Text style={styles.subtitle}>
          Verifikasi identitasmu dengan KTP dan foto selfie untuk membuka semua fitur Doitpay,
          termasuk transfer dan terima pembayaran dengan limit lebih besar. Prosesnya cepat dan
          datamu terlindungi dengan aman.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yang Perlu Disiapkan</Text>
          {renderInfoItem({
            title: 'KTP',
            description: 'KTP asli yang masih berlaku dan terlihat jelas',
            icon: <File size={22} color="#6B7280" strokeWidth={2} />,
          })}
          {renderInfoItem({
            title: 'Foto Selfie',
            description: 'Foto selfie untuk mencocokkan identitasmu dengan KTP',
            icon: <Image size={22} color="#6B7280" strokeWidth={2} />,
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={handleOpenConsent}
          disabled={isCheckingConsent}
          activeOpacity={0.8}
          accessibilityLabel={
            isCheckingConsent ? 'Memeriksa persetujuan' : 'Lanjutkan Verifikasi KTP'
          }
          accessibilityState={{ busy: isCheckingConsent, disabled: isCheckingConsent }}>
          {isCheckingConsent ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonPrimaryText}>Lanjutkan Verifikasi KTP</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={onPressSkip} activeOpacity={0.8}>
          <Text style={styles.buttonSecondaryText}>{isOnboardingFlow ? 'Lewati' : 'Kembali'}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isTermsVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => {
          if (!isSavingConsent && !isCheckingConsent) setIsTermsVisible(false);
        }}>
        <View style={styles.termsModalBackdrop}>
          <TouchableOpacity
            style={styles.termsBackdropDismiss}
            activeOpacity={1}
            onPress={() => setIsTermsVisible(false)}
            disabled={isSavingConsent || isCheckingConsent}
            accessibilityLabel="Tutup ketentuan"
          />
          <View style={styles.termsSheet}>
            <View style={styles.termsHandle} />
            <View style={styles.termsHeader}>
              <Text style={styles.termsTitle}>Sebelum verifikasi identitas</Text>
              <TouchableOpacity
                style={styles.termsCloseButton}
                onPress={() => setIsTermsVisible(false)}
                disabled={isSavingConsent || isCheckingConsent}
                accessibilityLabel="Tutup">
                <X size={22} color="#596174" />
              </TouchableOpacity>
            </View>
            <Text style={styles.termsSubtitle}>
              Baca ketentuan berikut sebelum mengirim data KTP dan selfie.
            </Text>

            {isCheckingConsent ? (
              <View style={styles.termsInlineLoading}>
                <ActivityIndicator size="large" color="#3929CC" />
              </View>
            ) : consentQuery.data ? (
              <KycTermsWebView
                style={[
                  styles.termsScroll,
                  isTermsLoadError ? styles.termsContentFaded : undefined,
                ]}
                html={consentQuery.data.content}
                privacyPolicyUrl={privacyPolicyUrl}
                baseUrl={consentQuery.data.tncPublicUrl || consentQuery.data.publicUrl}
              />
            ) : (
              <View style={styles.termsInlineLoading} />
            )}

            <View style={[styles.termsFooter, { paddingBottom: Math.max(insets.bottom, 18) }]}>
              {isTermsLoadError || isAcceptError ? (
                <>
                  <View style={styles.termsErrorCard}>
                    <View style={styles.termsAlertHeading}>
                      <View style={styles.termsErrorIcon}>
                        <Text style={styles.termsErrorIconText}>×</Text>
                      </View>
                      <Text style={styles.termsErrorTitle}>
                        {isAcceptError
                          ? 'Persetujuan belum berhasil disimpan'
                          : 'Ketentuan belum bisa dimuat'}
                      </Text>
                    </View>
                    <Text style={styles.termsErrorDescription}>
                      Periksa koneksi lalu coba lagi. Verifikasi belum dimulai.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.termsRetryButton}
                    disabled={isCheckingConsent || isSavingConsent}
                    onPress={isAcceptError ? handleAcceptTerms : handleRetryTerms}>
                    <Text style={styles.termsRetryText}>Coba lagi</Text>
                  </TouchableOpacity>
                </>
              ) : null}
              <View style={styles.termsLinksRow}>
                <TouchableOpacity
                  style={styles.termsLinkButton}
                  onPress={() => {
                    setIsTermsVisible(false);
                    // The screen is opened by the screen container through the callback below.
                    onPressReadFullTerms?.();
                  }}
                  disabled={isCheckingConsent}>
                  <Text style={styles.termsLinkText}>Baca di halaman lengkap</Text>
                  <ExternalLink size={16} color="#3526C7" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.termsLinkButton}
                  onPress={openPrivacyPolicy}
                  disabled={isCheckingConsent}>
                  <Text style={styles.termsLinkText}>Kebijakan Privasi</Text>
                  <ExternalLink size={16} color="#3526C7" />
                </TouchableOpacity>
              </View>
              {isTermsUpdated ? (
                <View style={styles.termsUpdatedCard}>
                  <View style={styles.termsAlertHeading}>
                    <View style={styles.termsUpdatedIcon}>
                      <Text style={styles.termsUpdatedIconText}>!</Text>
                    </View>
                    <Text style={styles.termsUpdatedTitle}>Ketentuan diperbarui</Text>
                  </View>
                  <Text style={styles.termsUpdatedDescription}>
                    Baca kembali versi terbaru, lalu centang lagi untuk melanjutkan.
                  </Text>
                </View>
              ) : null}
              <TouchableOpacity
                style={styles.termsConsentRow}
                onPress={() => {
                  if (!isTermsLoadError && !isCheckingConsent && !isSavingConsent) {
                    setHasAcceptedTerms((accepted) => !accepted);
                  }
                }}
                activeOpacity={0.8}
                disabled={isTermsLoadError || isCheckingConsent || isSavingConsent}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: hasAcceptedTerms,
                  disabled: isTermsLoadError || isCheckingConsent || isSavingConsent,
                }}>
                <View
                  style={[styles.termsCheckbox, hasAcceptedTerms && styles.termsCheckboxChecked]}>
                  {hasAcceptedTerms ? <Check size={17} color="#FFFFFF" strokeWidth={3} /> : null}
                </View>
                <Text style={styles.termsConsentText}>{KYC_CONSENT_ACKNOWLEDGEMENT}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.termsAcceptButton,
                  (!hasAcceptedTerms ||
                    !consentQuery.data?.version ||
                    isTermsLoadError ||
                    isCheckingConsent ||
                    isSavingConsent) &&
                    styles.termsAcceptButtonDisabled,
                ]}
                disabled={
                  !hasAcceptedTerms ||
                  !consentQuery.data?.version ||
                  isTermsLoadError ||
                  isCheckingConsent ||
                  isSavingConsent
                }
                onPress={handleAcceptTerms}>
                <Text
                  style={[
                    styles.termsAcceptButtonText,
                    (!hasAcceptedTerms ||
                      !consentQuery.data?.version ||
                      isTermsLoadError ||
                      isCheckingConsent ||
                      isSavingConsent) && {
                      color: '#737373',
                    },
                  ]}>
                  {isSavingConsent ? 'Menyimpan persetujuan...' : 'Setuju dan mulai verifikasi'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.termsLaterButton}
                onPress={() => setIsTermsVisible(false)}
                disabled={isSavingConsent || isCheckingConsent}>
                <Text style={styles.termsLaterText}>Nanti saja</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default KycIntroView;
