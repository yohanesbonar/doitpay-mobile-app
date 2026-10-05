import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  AlertCircle,
  Camera,
  ChevronDown,
  Clock,
  Copy,
  FileWarning,
  WifiOff,
  X,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LogoutConfirmationModal } from '@/features/main/profile/components/LogoutConfirmationModal';
import { createStyles as createProfileStyles } from '@/features/main/profile/styles';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import { formatNumber } from '@/utils/Common';
import { generateUUID } from '@/utils/uuid';
import { useTheme } from '@/theme/ThemeProvider';
import {
  manualBankApiMock,
  ManualBankTransferData,
} from '@/features/transfer/transferDetail/api/manual-bank.mock';

const ManualBankPaymentScreen = () => {
  const { colors } = useTheme();
  const confirmationModalStyles = createProfileStyles(colors);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transferData } = (route.params || {}) as { transferData: ManualBankTransferData };
  const [receiptAsset, setReceiptAsset] = useState<{
    uri: string;
    fileName?: string | null;
    fileSize?: number | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelConfirmationVisible, setIsCancelConfirmationVisible] = useState(false);
  const [errorType, setErrorType] = useState<'submission' | 'fileSize' | 'fileFormat' | null>(null);
  const [countdown, setCountdown] = useState('00:00');
  const [expandedPaymentGuide, setExpandedPaymentGuide] = useState<string | null>(null);
  const manualBank = transferData?.manualBank;
  const isBca = /bca|central asia/i.test(manualBank?.bankName ?? '');
  const bankDisplayName = isBca ? 'Bank BCA' : manualBank?.bankName || 'bank tujuan';
  const paymentGuides = [
    {
      title: 'Mobile Banking',
      steps: [
        'Buka aplikasi mobile banking dan login ke akun kamu.',
        'Pilih menu Transfer ke rekening bank lain.',
        `Pilih bank tujuan ${bankDisplayName}, lalu masukkan nomor rekening ${manualBank?.accountNumber || '-'}.`,
        `Masukkan nominal tepat Rp ${formatNumber(manualBank?.totalAmount ?? 0)}.`,
        'Periksa kembali nama penerima dan nominal, lalu selesaikan transfer.',
      ],
    },
    {
      title: 'ATM',
      steps: [
        'Masukkan kartu ATM dan PIN kamu.',
        'Pilih menu Transfer ke rekening bank lain.',
        `Pilih bank tujuan ${bankDisplayName}, lalu masukkan nomor rekening ${manualBank?.accountNumber || '-'}.`,
        `Masukkan nominal tepat Rp ${formatNumber(manualBank?.totalAmount ?? 0)}.`,
        'Pastikan nama penerima dan nominal sudah benar sebelum mengonfirmasi transaksi.',
      ],
    },
  ];

  useEffect(() => {
    if (!transferData?.paymentExpiredAt) {
      setCountdown('00:00');
      return;
    }

    const expiryTime = new Date(transferData.paymentExpiredAt).getTime();
    const updateCountdown = () => {
      const secondsLeft = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      setCountdown(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [transferData?.paymentExpiredAt]);

  const copyValue = (label: string, value: string) => {
    Clipboard.setString(value);
    Toast.show({
      type: 'success',
      text1: `${label} berhasil disalin.`,
    });
  };

  const chooseReceipt = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
    const asset = result.assets?.[0];
    if (result.didCancel || !asset?.uri) return;

    if (asset.fileSize && asset.fileSize > 5 * 1024 * 1024) {
      setErrorType('fileSize');
      return;
    }

    const fileExtension = asset.fileName?.split('.').pop()?.toLowerCase();
    const isSupportedFormat =
      ['jpg', 'jpeg', 'png'].includes(fileExtension ?? '') ||
      ['image/jpeg', 'image/png'].includes(asset.type ?? '');
    if (!isSupportedFormat) {
      setErrorType('fileFormat');
      return;
    }

    setErrorType(null);
    setReceiptAsset({ uri: asset.uri, fileName: asset.fileName, fileSize: asset.fileSize });
  };

  const submitReceipt = async () => {
    if (!receiptAsset?.uri || !transferData?.id) return;
    setIsSubmitting(true);
    try {
      const response = await manualBankApiMock.submitProof(
        transferData.id,
        receiptAsset.uri,
        receiptAsset.fileName,
      );
      if (response.data.status === 'VERIFYING') {
        navigation.replace('ManualBankVerification', {
          transferData,
          accountData: route.params?.accountData,
          bankData: route.params?.bankData,
        });
      }
    } catch {
      setErrorType('submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleErrorAction = () => {
    setErrorType(null);
  };

  const cancelTransfer = async () => {
    if (!transferData?.id || isCancelling) return;

    setIsCancelling(true);
    try {
      const response = await manualBankApiMock.cancelTransfer(transferData.id, generateUUID());
      if (response.data.statusUser !== 'CANCELLED') return;
      navigation.goBack();
    } catch {
      Alert.alert('Gagal Membatalkan Transfer', 'Silakan coba lagi.');
    } finally {
      setIsCancelling(false);
    }
  };

  const confirmCancelTransfer = () => {
    setIsCancelConfirmationVisible(true);
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Pembayaran"
        onPressBack={() => navigation.goBack()}
        titlePosition="left"
        titleStyle="medium"
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.expiryCard}>
          <Clock size={22} color="#6B7280" />
          <View style={styles.expiryDetails}>
            <Text style={styles.expiryLabel}>Bayar sebelum:</Text>
            <Text style={styles.expiryDate}>
              {formatExpiryDate(transferData?.paymentExpiredAt)}
            </Text>
          </View>
          <Text style={styles.countdown}>{countdown}</Text>
        </View>

        <View style={styles.paymentCard}>
          <Text style={styles.sectionLabel}>Nominal Transfer</Text>
          <View style={styles.amountRow}>
            <View style={styles.amountValue}>
              <Text style={styles.currency}>Rp</Text>
              <Text style={styles.amount}>{formatNumber(manualBank?.totalAmount ?? 0)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => copyValue("Nominal Transfer", String(manualBank?.totalAmount ?? ''))}
              style={styles.copyButton}>
              <Copy size={16} color="#FFF" />
              <Text style={styles.copyButtonText}>Salin</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bankDetails}>
            <View style={styles.bankHeader}>
              {isBca ? (
                <Image
                  source={require('../../../assets/images/ic-BCA.png')}
                  style={styles.bankLogo}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.bankLogoFallback}>
                  <Text style={styles.bankLogoText}>
                    {manualBank?.bankName?.slice(0, 3).toUpperCase()}
                  </Text>
                </View>
              )}
              <View>
                <Text style={styles.bankName}>Doitpay</Text>
                <Text style={styles.accountName}>{isBca ? 'Bank BCA' : manualBank?.bankName}</Text>
              </View>
            </View>
            <Text style={styles.accountNumberLabel}>Nomor rekening</Text>
            <View style={styles.accountNumberRow}>
              <Text style={styles.accountNumber}>{manualBank?.accountNumber}</Text>
              <TouchableOpacity
                onPress={() => copyValue("Nomor Rekening", manualBank?.accountNumber ?? '')}
                style={styles.copyButton}>
                <Copy size={16} color="#FFF" />
                <Text style={styles.copyButtonText}>Salin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.notice}>
          <View style={styles.noticeIcon}>
            <AlertCircle size={22} color="#FFF" />
          </View>
          <Text style={styles.noticeText}>
            <Text style={styles.noticeTitle}>Pastikan nominal sesuai</Text>
            {'\n'}Pastikan nominal transfer sesuai hingga digit terakhir.{' '}
            <Text style={styles.noticeEmphasis}>Kode unik</Text> menjadi{' '}
            <Text style={styles.noticeEmphasis}>biaya layanan jika transaksi berhasil.</Text>
          </Text>
        </View>

        <Text style={styles.attachmentTitle}>Lampiran Foto</Text>
        {receiptAsset ? (
          <View style={styles.attachmentContainer}>
            <TouchableOpacity onPress={chooseReceipt} style={styles.attachmentCard}>
              <Image source={{ uri: receiptAsset.uri }} style={styles.receiptThumbnail} />
              <View style={styles.attachmentInfo}>
                <Text style={styles.attachmentFileName} numberOfLines={2} ellipsizeMode="tail">
                  {receiptAsset.fileName || 'Bukti Transfer'}
                </Text>
                <Text style={styles.attachmentFileSize}>
                  {formatFileSize(receiptAsset.fileSize)}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Hapus foto lampiran"
              onPress={() => setReceiptAsset(null)}
              style={styles.removeAttachmentButton}>
              <X size={18} color="#FFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={chooseReceipt} style={styles.uploadBox}>
            <>
              <Camera size={24} color="#737373" />
              <Text style={styles.uploadLabel}>Upload Foto</Text>
              <Text style={styles.uploadHint}>JPG, PNG, JPEG (maks. 5 MB)</Text>
            </>
          </TouchableOpacity>
        )}
        <View style={styles.paymentGuideSection}>
          <Text style={styles.paymentGuideHeading}>Cara Pembayaran</Text>
          {paymentGuides.map((guide) => {
            const isExpanded = expandedPaymentGuide === guide.title;

            return (
              <View key={guide.title} style={styles.paymentGuideItem}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityState={{ expanded: isExpanded }}
                  onPress={() => setExpandedPaymentGuide(isExpanded ? null : guide.title)}
                  style={styles.paymentGuideTrigger}>
                  <Text style={styles.paymentGuideTitle}>{guide.title}</Text>
                  <ChevronDown
                    size={20}
                    color="#6B7280"
                    style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
                {isExpanded && (
                  <View style={styles.paymentGuideSteps}>
                    {guide.steps.map((step, index) => (
                      <View key={`${guide.title}-${index}`} style={styles.paymentGuideStep}>
                        <View style={styles.paymentGuideStepBadge}>
                          <Text style={styles.paymentGuideStepNumber}>{index + 1}</Text>
                        </View>
                        <Text style={styles.paymentGuideStepText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Kirim Bukti Transfer"
          onPress={submitReceipt}
          type="regular"
          color="#3B82F6"
          textColor="white"
          disable={!receiptAsset || isSubmitting || isCancelling}
          loading={isSubmitting}
        />
        <Button
          title="Batalkan Transfer"
          onPress={confirmCancelTransfer}
          type="regular"
          color="#FFFFFF"
          textColor="black"
          borderColor="#D1D5DB"
          style={styles.cancelTransferButton}
          textStyle={styles.cancelTransferButtonText}
          disable={isSubmitting || isCancelling}
          loading={isCancelling}
        />
      </View>
      <Modal
        visible={isSubmitting}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {}}>
        <View style={styles.submittingOverlay}>
          <View style={styles.submittingCard}>
            <ActivityIndicator size="large" color="#111111" style={styles.submittingSpinner} />
            <Text style={styles.submittingTitle}>Mengirim Bukti Transfer</Text>
            <Text style={styles.submittingDescription}>Mohon tunggu jangan menutup aplikasi</Text>
          </View>
        </View>
      </Modal>
      <Modal
        visible={errorType !== null}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setErrorType(null)}>
        <View style={styles.errorOverlay}>
          <View style={styles.errorSheet}>
            <View
              style={[
                styles.errorIconCircle,
                errorType === 'submission' ? styles.errorIconDanger : styles.errorIconWarning,
              ]}>
              {errorType === 'submission' ? (
                <WifiOff size={34} color="#DC2626" strokeWidth={2.5} />
              ) : (
                <FileWarning size={34} color="#D18B00" strokeWidth={2} />
              )}
            </View>
            <Text style={styles.errorTitle}>
              {errorType === 'submission'
                ? 'Gagal Mengirim Bukti Transfer'
                : errorType === 'fileSize'
                  ? 'Ukuran File Terlalu Besar'
                  : 'Format File Tidak Didukung'}
            </Text>
            <Text style={styles.errorDescription}>
              {errorType === 'submission'
                ? 'Periksa Internet kamu dan coba lagi'
                : errorType === 'fileSize'
                  ? 'Maksimal ukuran file 5MB. Silahkan pilih file lain'
                  : 'Gunakan format JPG, JPEG atau PNG'}
            </Text>
            <Button
              title={errorType === 'submission' ? 'Coba Lagi' : 'Pilih File Lain'}
              onPress={handleErrorAction}
              type="regular"
              color="#3B82F6"
              textColor="white"
              style={styles.errorActionButton}
              textStyle={styles.errorActionButtonText}
            />
          </View>
        </View>
      </Modal>
      <LogoutConfirmationModal
        visible={isCancelConfirmationVisible}
        styles={confirmationModalStyles}
        colors={colors}
        title="Batalkan Transfer?"
        description="Transaksi ini akan dibatalkan dan tidak dapat dilanjutkan."
        cancelLabel="Kembali"
        confirmLabel="Batalkan"
        onClose={() => setIsCancelConfirmationVisible(false)}
        onConfirm={() => {
          setIsCancelConfirmationVisible(false);
          cancelTransfer();
        }}
      />
    </View>
  );
};

export default ManualBankPaymentScreen;

const formatExpiryDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  const datePart = date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${datePart}, ${timePart} WIB`;
};

const formatFileSize = (size?: number | null) => {
  if (!size || size <= 0) return 'Ukuran tidak diketahui';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { padding: 20, paddingBottom: 120 },
  expiryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 18,
    marginBottom: 18,
    backgroundColor: '#FAFAFA',
  },
  expiryDetails: { flex: 1, marginLeft: 10 },
  expiryLabel: { fontFamily: 'Switzer-Regular', fontSize: 15, color: '#111827' },
  expiryDate: { fontFamily: 'Switzer-Medium', fontSize: 15, marginTop: 5, color: '#111827' },
  countdown: { color: '#EF4444', fontFamily: 'Switzer-Bold', fontSize: 24, marginLeft: 8 },
  paymentCard: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, overflow: 'hidden' },
  sectionLabel: {
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
    marginHorizontal: 16,
    marginTop: 16,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  amountValue: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  currency: { fontFamily: 'Switzer-Regular', fontSize: 20, color: '#737373' },
  amount: { fontFamily: 'Switzer-Bold', fontSize: 28, color: '#111827' },
  copyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyButtonText: { color: '#FFF', marginLeft: 6, fontFamily: 'Switzer-Medium' },
  bankDetails: { borderTopWidth: 1, borderTopColor: '#D1D5DB', padding: 16 },
  bankHeader: { flexDirection: 'row', alignItems: 'center' },
  bankLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 14,
    padding: 8,
  },
  bankLogoFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankLogoText: { fontFamily: 'Switzer-Bold', color: '#3B82F6' },
  bankName: { fontFamily: 'Switzer-Medium', fontSize: 18, color: '#111827' },
  accountName: { color: '#111827', marginTop: 3, fontFamily: 'Switzer-Regular', fontSize: 15 },
  accountNumberLabel: {
    color: '#111827',
    marginTop: 14,
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
  },
  accountNumberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    gap: 10,
  },
  accountNumber: { fontFamily: 'Switzer-Medium', fontSize: 20, color: '#111827', flex: 1 },
  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFCDF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginTop: 18,
  },
  noticeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAB308',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  noticeText: {
    flex: 1,
    lineHeight: 23,
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
    color: '#111827',
  },
  noticeTitle: { fontFamily: 'Switzer-Medium', fontSize: 17 },
  noticeEmphasis: { fontFamily: 'Switzer-Bold' },
  attachmentTitle: { fontFamily: 'Switzer-Medium', fontSize: 16, marginTop: 24, marginBottom: 10 },
  attachmentContainer: { position: 'relative' },
  attachmentCard: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    paddingRight: 52,
    flexDirection: 'row',
    alignItems: 'center',
  },
  receiptThumbnail: { width: 112, height: 112, borderRadius: 8, backgroundColor: '#F3F4F6' },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
    alignSelf: 'flex-start',
    paddingTop: 12,
    paddingRight: 12,
  },
  attachmentFileName: { color: '#111827', fontFamily: 'Switzer-Medium', fontSize: 16 },
  attachmentFileSize: {
    color: '#111827',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    marginTop: 6,
  },
  paymentGuideSection: {
    marginHorizontal: -20,
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  paymentGuideHeading: {
    fontFamily: 'Switzer-Bold',
    fontSize: 18,
    color: '#111827',
    marginBottom: 16,
  },
  paymentGuideItem: {
    width: '100%',
    marginBottom: 8,
  },
  paymentGuideTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  paymentGuideTitle: {
    fontFamily: 'Switzer-Medium',
    fontSize: 15,
    color: '#111827',
  },
  paymentGuideSteps: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  paymentGuideStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    width: '100%',
  },
  paymentGuideStepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3475E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  paymentGuideStepNumber: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Switzer-Bold',
  },
  paymentGuideStepText: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
    fontFamily: 'Switzer-Regular',
    lineHeight: 18,
  },
  removeAttachmentButton: {
    position: 'absolute',
    right: 8,
    top: 12,
    width: 30,
    height: 30,
    borderRadius: 19,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  uploadBox: {
    minHeight: 130,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  uploadLabel: { fontFamily: 'Switzer-Medium', marginTop: 8 },
  uploadHint: { color: '#737373', fontSize: 12, marginTop: 8 },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#F3F4F6' },
  cancelTransferButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minHeight: 50,
  },
  cancelTransferButtonText: { fontFamily: 'Switzer-Medium', fontSize: 16 },
  submittingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  submittingCard: {
    width: '100%',
    minHeight: 300,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  submittingTitle: {
    color: '#000',
    fontFamily: 'Switzer-Bold',
    fontSize: 22,
    textAlign: 'center',
    marginTop: 40,
  },
  submittingSpinner: { transform: [{ scale: 2 }] },
  submittingDescription: {
    color: '#111',
    fontFamily: 'Switzer-Regular',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  errorOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  errorSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 30,
    alignItems: 'center',
  },
  errorIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  errorIconDanger: { backgroundColor: '#FEE2E2' },
  errorIconWarning: { backgroundColor: '#FEF7C3' },
  errorTitle: {
    color: '#080808',
    fontFamily: 'Switzer-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  errorDescription: {
    color: '#111827',
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  errorActionButton: {
    alignSelf: 'stretch',
    minHeight: 60,
    paddingVertical: 10,
  },
  errorActionButtonText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
  },
});
