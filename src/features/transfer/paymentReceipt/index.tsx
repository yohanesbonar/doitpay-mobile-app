import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import { CheckCircle2, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatApiDateToLocal, formatNumber } from '@/utils/Common';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { useReceiveStatusQuery, useTransferDetailQuery } from '@/hooks/useTransferMutation';

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
  const methodLabel = paymentMethod === 'QRIS' ? 'QRIS' : 'Virtual Account';
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

  const effectiveTransactionId = useMemo(() => {
    if (method === 'receive') {
      return (receiveStatusData as any)?.data?.id || transactionId || '-';
    }
    return (transferDetailData as any)?.data?.id || transactionId || '-';
  }, [method, receiveStatusData, transferDetailData, transactionId]);

  const effectiveRecipient = useMemo(() => {
    if (method === 'receive') {
      return (receiveStatusData as any)?.data?.beneficiaryName;
    }
    return (transferDetailData as any)?.data?.beneficiaryName;
  }, [method, receiveStatusData, transferDetailData]);

  const effectivePaymentMethodLabel = useMemo(() => {
    const pm =
      (method === 'receive'
        ? (receiveStatusData as any)?.data?.paymentMethod
        : (transferDetailData as any)?.data?.paymentMethod) || paymentMethod;

    if (pm) return String(pm);
    return methodLabel;
  }, [method, receiveStatusData, transferDetailData, paymentMethod, methodLabel]);

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

  return (
    <View style={styles.container}>
      {/* <HeaderToolbar title="" titlePosition="left" titleStyle="regular" /> */}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
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
              <View style={styles.bankLogoWrapper}>
                <Text style={styles.bankText}>{accountData?.bankName || 'BCA'}</Text>
              </View>

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
          </View>
        </ViewShot>
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
