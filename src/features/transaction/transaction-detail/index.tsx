import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Clock, XCircle, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatNumber } from '@/utils/Common';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { TransactionStatus, TransactionType } from '@/features/transaction/types';
import { useTransactionReceiptQuery } from '@/features/transaction/hooks/useTransactionReceiptQuery';
import FastImage from 'react-native-fast-image';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; Icon: React.ComponentType<any> }
> = {
  [TransactionStatus.SUCCESS_TRANSFER]: {
    label: 'Transfer Berhasil',
    color: '#3B82F6',
    Icon: CheckCircle2,
  },
  [TransactionStatus.SUCCESS_RECEIVE]: {
    label: 'Dana Berhasil Diterima',
    color: '#16A34A',
    Icon: CheckCircle2,
  },
  [TransactionStatus.PENDING]: {
    label: 'Transaksi Diproses',
    color: '#D97706',
    Icon: Clock,
  },
  [TransactionStatus.CANCELED]: {
    label: 'Transaksi Dibatalkan',
    color: '#6B7280',
    Icon: XCircle,
  },
  [TransactionStatus.FAILED]: {
    label: 'Transaksi Gagal',
    color: '#EF4444',
    Icon: XCircle,
  },
};

const deriveStatus = (type: string, status?: string): string => {
  if (status && STATUS_CONFIG[status]) return status;
  if (type === TransactionType.RECEIVE_IN) return TransactionStatus.SUCCESS_RECEIVE;
  return TransactionStatus.SUCCESS_TRANSFER;
};

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${minutes} WIB`;
};

const formatMethodLabel = (method: string) =>
  method
    .toLowerCase()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export interface TransactionDetailProps {
  transactionId: string;
  referenceId: string;
  type: string;
  status?: string;
  onPressBack: () => void;
}

export const TransactionDetail = ({
  transactionId,
  referenceId,
  type,
  status,
  onPressBack,
}: TransactionDetailProps) => {
  const viewShotRef = useRef<any>(null);

  const { data: receiptResponse, isLoading } = useTransactionReceiptQuery(referenceId, type);
  const receipt = receiptResponse?.data;

  const resolvedStatus = deriveStatus(type, status);
  const {
    label: statusLabel,
    color: statusColor,
    Icon: StatusIcon,
  } = STATUS_CONFIG[resolvedStatus] ?? STATUS_CONFIG[TransactionStatus.SUCCESS_TRANSFER];

  const hasAndroidPermission = async () => {
    const permission =
      Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;
    const result = await PermissionsAndroid.request(permission);
    return result === 'granted';
  };

  const openGallery = async () => {
    try {
      if (Platform.OS === 'ios') {
        const url = 'photos-redirect://';
        const canOpen = await Linking.canOpenURL(url);
        await Linking.openURL(canOpen ? url : 'calshow://');
      } else {
        await Linking.openURL('content://media/internal/images/media');
      }
    } catch {
      Alert.alert('Info', 'Bukti disimpan. Silakan buka aplikasi Galeri/Photos di HP kamu.');
    }
  };

  const handleDownload = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      let targetUri = uri;
      if (Platform.OS === 'ios') {
        if (uri.startsWith('file://')) targetUri = uri.replace('file://', '');
        await CameraRoll.saveAsset(targetUri, { type: 'photo' });
        Alert.alert('Sukses', 'Bukti disimpan ke Galeri Foto.', [
          { text: 'OK', style: 'cancel' },
          { text: 'Buka Galeri', onPress: openGallery },
        ]);
      } else {
        const allowed = await hasAndroidPermission();
        if (!allowed) {
          Alert.alert('Izin Ditolak', 'Aplikasi butuh izin akses galeri');
          return;
        }
        await CameraRoll.saveAsset(targetUri, { type: 'photo' });
        Alert.alert('Sukses', 'Bukti berhasil disimpan ke Galeri Foto.', [
          { text: 'OK', style: 'cancel' },
          { text: 'Buka Galeri', onPress: openGallery },
        ]);
      }
    } catch (error) {
      console.error('Download error:', error);
      if (Platform.OS !== 'ios') {
        Alert.alert('Gagal', 'Gagal menyimpan bukti ke galeri');
      }
    }
  };

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        title: 'Bagikan Bukti',
        message: `Bukti Transaksi sebesar Rp ${formatNumber((receipt?.amount ?? 0).toString())}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  console.log(receipt?.paymentMethod);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HeaderToolbar title="Detail Transaksi" onPressBack={onPressBack} titlePosition="left" />

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
              <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
                <View style={styles.statusIcon}>
                  <StatusIcon size={65} color="#FFFFFF" />
                </View>
                <Text style={styles.statusTitle}>{statusLabel}</Text>
                <Text style={styles.statusAmount}>
                  Rp {formatNumber((receipt?.amount ?? 0).toString())}
                </Text>
                <View style={styles.curveCutout} />
              </View>

              <View style={styles.recipientBox}>
                <View style={styles.recipientLeft}>
                  <View style={styles.bankLogoWrapper}>
                    <FastImage
                      source={{ uri: receipt?.paymentMethodLogoUrl }}
                      style={{ width: 30, height: 30 }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                  <View style={styles.recipientInfo}>
                    <Text style={styles.recipientName} numberOfLines={1}>
                      {receipt?.beneficiaryName ?? '-'}
                    </Text>
                    <Text style={styles.recipientMethod}>
                      {receipt?.paymentMethod ? receipt.paymentMethod : '-'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Detail Transaksi</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ID Transaksi</Text>
                  <Text style={styles.detailValue}>{transactionId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Tanggal & Waktu</Text>
                  <Text style={styles.detailValue}>
                    {receipt?.createdAt ? formatDateTime(receipt.createdAt) : '-'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Metode Pembayaran</Text>
                  <Text style={styles.detailValue}>
                    {receipt?.paymentMethod ? receipt.paymentMethod : '-'}
                  </Text>
                </View>
              </View>
            </ViewShot>
          </ScrollView>
        )}

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
          <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
            <Text style={styles.backButtonText}>Kembali ke Daftar Transaksi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
