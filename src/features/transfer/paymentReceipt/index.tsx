import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
  Image,
  Dimensions,
} from 'react-native';
import { CheckCircle2, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { FeeInfoButton } from '@/components/molecules/FeeInfoButton';
import { styles, receiptStyles } from './styles';
import { formatApiDateToLocal, formatNumber } from '@/utils/Common';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { useReceiveStatusQuery, useTransferDetailQuery } from '@/hooks/useTransferMutation';
import { usePostHog } from 'posthog-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PaymentReceiptViewProps {
  accountData?: {
    accountNumber: string;
    bankName: string;
    name?: string;
    accountHolderName?: string;
    accountName?: string;
  };
  bankData?: any;
  paymentMethod?: 'VA' | 'QRIS';
  amount?: string;
  transactionId?: string;
  dateTime?: string;
  onPressBack: () => void;
  onPressHome?: () => void;
  method?: string;
}

const PaymentReceiptView = ({
  accountData,
  bankData,
  paymentMethod,
  amount,
  transactionId,
  dateTime,
  onPressBack,
  onPressHome,
  method,
}: PaymentReceiptViewProps) => {
  const posthog = usePostHog();
  const methodLabel = paymentMethod === 'QRIS' ? 'QRIS' : 'Virtual Account';

  useEffect(() => {
    posthog.capture('transfer_completed', {
      amount: parseInt(amount || '0'),
      payment_method: paymentMethod ?? null,
      transaction_id: transactionId ?? null,
      method: method ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: transferDetailData, isLoading: isTransferDetailLoading } = useTransferDetailQuery(
    method !== 'receive' ? transactionId : undefined,
  );
  const { data: receiveStatusData, isLoading: isReceiveStatusLoading } = useReceiveStatusQuery(
    method === 'receive' ? transactionId : undefined,
  );

  const receiptInfo = useMemo(() => {
    const baseAmount = amount || '0';
    const baseDateTime = dateTime || '';

    if (method === 'receive' && receiveStatusData?.data) {
      const statusData = receiveStatusData.data as any;
      return {
        amount: statusData.amount?.toString() || baseAmount,
        dateTime:
          formatApiDateToLocal(statusData.paidAt || statusData.updatedAt || '') || baseDateTime,
      };
    }

    if (method !== 'receive' && transferDetailData?.data) {
      const detail = transferDetailData.data as any;
      return {
        amount: detail.amount?.toString() || baseAmount,
        dateTime: formatApiDateToLocal(detail.createdAt) || baseDateTime,
      };
    }

    return {
      amount: baseAmount,
      dateTime: baseDateTime,
    };
  }, [method, receiveStatusData, transferDetailData, amount, dateTime]);

  const effectiveAmount = receiptInfo.amount || amount || '0';
  const formattedAmount = formatNumber(effectiveAmount);
  const effectiveDateTime = receiptInfo.dateTime || dateTime || '-';
  const viewShotRef = useRef<any>(null);

  const receiptData = (
    method === 'receive' ? receiveStatusData?.data : transferDetailData?.data
  ) as any;

  const effectiveTransactionId = receiptData?.id || transactionId || '-';
  const effectiveRecipient = receiptData?.beneficiaryName;
  const effectivePaymentMethodLogoUrl = receiptData?.paymentMethodLogoUrl;
  const effectivePaymentMethodLabel = receiptData?.paymentMethod
    ? String(receiptData.paymentMethod)
    : paymentMethod || methodLabel;
  const effectiveFee = receiptData?.fee;
  const effectivePercentageFee = receiptData?.percentageFee;
  const effectiveTotalAmount = receiptData?.totalAmount;
  const effectiveBeneficiaryBankName = receiptData?.beneficiaryBankName;
  const effectiveBeneficiaryBankLogo = receiptData?.beneficiaryBankLogo;
  const effectiveSenderName = receiptData?.senderName;
  const effectivePaymentMethodName = receiptData?.paymentMethodName;

  const isReceiveIn = method === 'receive';

  const senderName = effectiveSenderName || '-';
  const senderBank = effectivePaymentMethodName || effectivePaymentMethodLabel || '-';
  const senderLogoUri = effectivePaymentMethodLogoUrl;

  const recipientName = effectiveRecipient || '-';
  const recipientBank = effectiveBeneficiaryBankName || '-';
  const recipientLogoUri = effectiveBeneficiaryBankLogo;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const doitpayLogo = require('../../../assets/images/ic-doitpay-white.png');

  const hasAndroidPermission = async () => {
    const getCheckPermission =
      Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(getCheckPermission);
    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(getCheckPermission);
    return status === 'granted';
  };

  const handleDownload = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      let targetUri = uri;

      if (Platform.OS === 'ios') {
        if (uri.startsWith('file://')) {
          targetUri = uri.replace('file://', '');
        }

        await CameraRoll.saveAsset(targetUri, { type: 'photo' });
        Alert.alert('Sukses', 'Bukti disimpan ke Galeri Foto.', [
          {
            text: 'OK',
            style: 'cancel',
          },
          {
            text: 'Buka Galeri',
            onPress: () => openGalleryApp(),
          },
        ]);
      } else {
        const hasPermission = await hasAndroidPermission();
        if (!hasPermission) {
          Alert.alert('Izin Ditolak', 'Aplikasi butuh izin akses galeri');
          return;
        }

        await CameraRoll.saveAsset(targetUri, { type: 'photo' });

        Alert.alert('Sukses', 'Bukti berhasil disimpan ke Galeri Foto.', [
          {
            text: 'OK',
            style: 'cancel',
          },
          {
            text: 'Buka Galeri',
            onPress: () => openGalleryApp(),
          },
        ]);
      }
    } catch (error: any) {
      console.error('Download error:', error);

      if (Platform.OS === 'ios') {
      } else {
        Alert.alert('Gagal', 'Gagal menyimpan Bukti ke galeri');
      }
    }
  };

  const openGalleryApp = async () => {
    try {
      if (Platform.OS === 'ios') {
        const iosPhotosUrl = 'photos-redirect://';
        const isSupported = await Linking.canOpenURL(iosPhotosUrl);

        if (isSupported) {
          await Linking.openURL(iosPhotosUrl);
        } else {
          await Linking.openURL('calshow://');
        }
      } else {
        await Linking.openURL('content://media/internal/images/media');
      }
    } catch (error) {
      console.log('Gagal membuka galeri otomatis:', error);
      Alert.alert('Info', 'Bukti disimpan. Silakan buka aplikasi Galeri/Photos di HP kamu.');
    }
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        title: 'Bagikan Bukti',
        message: `Bukti Pembayaran sebesar Rp ${amount}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const renderReceiptForCapture = () => (
    <View style={receiptStyles.container}>
      <View style={[receiptStyles.header, { backgroundColor: '#3B82F6' }]}>
        <Image source={doitpayLogo} style={receiptStyles.logo} resizeMode="contain" />
        <Text style={receiptStyles.statusText}>
          {method === 'receive' ? 'Dana Berhasil Diterima' : 'Transfer Berhasil'}
        </Text>
      </View>

      <View style={receiptStyles.nominalCard}>
        <Text style={receiptStyles.nominalLabel}>Nominal</Text>
        <View style={receiptStyles.nominalRow}>
          <Text style={receiptStyles.nominalCurrency}>Rp</Text>
          <Text style={receiptStyles.nominalAmount}>{formattedAmount}</Text>
        </View>
      </View>

      {!isReceiveIn && (
        <View style={receiptStyles.partySection}>
          <View style={receiptStyles.partyRow}>
            <View style={receiptStyles.partyLogo}>
              {senderLogoUri ? (
                <Image
                  source={{ uri: senderLogoUri }}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={doitpayLogo}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              )}
            </View>
            <View style={receiptStyles.partyInfo}>
              <Text style={receiptStyles.partyName} numberOfLines={1}>
                {senderName}
              </Text>
              <Text style={receiptStyles.partyBank}>{senderBank}</Text>
            </View>
          </View>

          <View style={receiptStyles.dashedConnector} />

          <View style={receiptStyles.partyRow}>
            <View style={receiptStyles.partyLogo}>
              {recipientLogoUri ? (
                <Image
                  source={{ uri: recipientLogoUri }}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={doitpayLogo}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              )}
            </View>
            <View style={receiptStyles.partyInfo}>
              <Text style={receiptStyles.partyName} numberOfLines={1}>
                {recipientName}
              </Text>
              <Text style={receiptStyles.partyBank}>{recipientBank}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={receiptStyles.detailSection}>
        <Text style={receiptStyles.receiptSectionTitle}>Detail Transaksi</Text>

        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>ID Transaksi</Text>
          <Text style={receiptStyles.receiptDetailValue}>{effectiveTransactionId}</Text>
        </View>
        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>Tanggal & Waktu</Text>
          <Text style={receiptStyles.receiptDetailValue}>{effectiveDateTime}</Text>
        </View>
        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>Metode Pembayaran</Text>
          <Text style={receiptStyles.receiptDetailValue}>{effectivePaymentMethodLabel}</Text>
        </View>
        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>Jumlah</Text>
          <Text style={receiptStyles.receiptDetailValue}>Rp {formattedAmount}</Text>
        </View>
        {effectiveFee != null && (
          <View style={receiptStyles.receiptDetailRow}>
            <Text style={receiptStyles.receiptDetailLabel}>Biaya Admin</Text>
            <Text style={receiptStyles.receiptDetailValue}>
              Rp {formatNumber(effectiveFee.toString())}{' '}
              {effectivePercentageFee && `(${effectivePercentageFee}%)`}
            </Text>
          </View>
        )}
        {effectiveTotalAmount != null && (
          <View style={receiptStyles.receiptDetailRow}>
            <Text style={receiptStyles.receiptDetailLabel}>Total</Text>
            <Text style={receiptStyles.receiptDetailValue}>
              Rp {formatNumber(effectiveTotalAmount.toString())}
            </Text>
          </View>
        )}
      </View>

      <View style={receiptStyles.footer}>
        <Text style={receiptStyles.footerText}>PT Indoraya Sehati Remmitance</Text>
        <Text style={receiptStyles.footerText}>©{new Date().getFullYear()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <HeaderToolbar title="" titlePosition="left" titleStyle="regular" /> */}

      <ViewShot
        ref={viewShotRef}
        options={{ format: 'png', quality: 1.0 }}
        style={{
          position: 'absolute',
          top: -9999,
          left: 0,
          width: SCREEN_WIDTH,
          backgroundColor: '#FFFFFF',
        }}>
        {renderReceiptForCapture()}
      </ViewShot>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCard}>
          <View style={styles.resultIcon}>
            <CheckCircle2 size={80} color="#FFFFFF" />
          </View>
          <Text style={styles.resultTitle}>
            {method === 'receive' ? 'Dana Berhasil Diterima' : 'Transfer Berhasil'}
          </Text>
          <Text style={styles.resultAmount}>Rp {formattedAmount}</Text>

          <View style={styles.curveCutout} />
        </View>

        <View style={styles.recipientBox}>
          <View style={styles.recipientLeft}>
            <Image
              source={{ uri: effectivePaymentMethodLogoUrl }}
              style={[
                styles.bankLogo,
                { paddingHorizontal: effectivePaymentMethodLabel == 'QRIS' ? 5 : 0 },
              ]}
              resizeMode="contain"
            />

            <View style={styles.recipientInfo}>
              <Text style={styles.recipientName} numberOfLines={1}>
                {effectiveRecipient || '-'}
              </Text>
              <Text style={styles.recipientMethod}>{effectivePaymentMethodLabel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Detail Transaksi</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ID Transaksi</Text>
            <Text style={styles.detailValue}>{effectiveTransactionId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tanggal & Waktu</Text>
            <Text style={styles.detailValue}>{effectiveDateTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <Text style={styles.detailValue}>{effectivePaymentMethodLabel}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jumlah</Text>
            <Text style={styles.detailValue}>Rp {formattedAmount}</Text>
          </View>
          {effectiveFee != null && (
            <View style={styles.detailRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.detailLabelWithIcon}>Biaya Admin</Text>
                <FeeInfoButton message="Biaya jasa admin yang dibebankan kepada merchant" />
              </View>
              <Text style={styles.detailValue}>
                Rp {formatNumber(effectiveFee.toString())}{' '}
                {effectivePercentageFee && `(${effectivePercentageFee}%)`}
              </Text>
            </View>
          )}
          {effectiveTotalAmount != null && (
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>Total</Text>
              <Text style={styles.detailValue}>
                Rp {formatNumber(effectiveTotalAmount.toString())}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footerContainer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
            <Download size={18} color="#111827" style={{ marginRight: 8 }} />
            <Text style={styles.actionText}>Unduh Bukti</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={18} color="#111827" style={{ marginRight: 8 }} />
            <Text style={styles.actionText}>Bagikan</Text>
          </TouchableOpacity>
        </View>

        {onPressHome ? (
          <TouchableOpacity style={styles.homeButton} onPress={onPressHome}>
            <Text style={styles.homeButtonText}>Kembali ke Beranda</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default PaymentReceiptView;
