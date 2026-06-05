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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Clock, XCircle, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatNumber } from '@/utils/Common';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { TransactionStatus } from '@/features/transaction/types';

const DUMMY_TRANSACTION = {
  accountHolderName: 'Ahmad Fauzan',
  bankShortName: 'BCA',
  transactionMethod: 'VIRTUAL_ACCOUNT',
  amount: 1500000,
  fee: 2500,
  totalAmount: 1502500,
  createdAt: '2025-01-15T10:30:00Z',
  status: TransactionStatus.SUCCESS_TRANSFER,
  isCredit: false,
  referenceId: 'REF-202501150001',
  accountNumber: '1234567890',
};

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

interface TransactionDetailProps {
  transactionId: string;
  onPressBack: () => void;
}

export const TransactionDetail = ({ transactionId, onPressBack }: TransactionDetailProps) => {
  const viewShotRef = useRef<any>(null);
  const tx = DUMMY_TRANSACTION;

  const statusConfig =
    STATUS_CONFIG[tx.status] ?? STATUS_CONFIG[TransactionStatus.SUCCESS_TRANSFER];
  const { label: statusLabel, color: statusColor, Icon: StatusIcon } = statusConfig;
  const isExpense = !tx.isCredit;

  const hasAndroidPermission = async () => {
    const permission =
      Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const openGallery = async () => {
    try {
      if (Platform.OS === 'ios') {
        const iosPhotosUrl = 'photos-redirect://';
        const canOpen = await Linking.canOpenURL(iosPhotosUrl);
        await Linking.openURL(canOpen ? iosPhotosUrl : 'calshow://');
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
        message: `Bukti Transaksi sebesar Rp ${formatNumber(tx.amount.toString())}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HeaderToolbar title="Detail Transaksi" onPressBack={onPressBack} titlePosition="left" />

      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
            <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
              <View style={styles.statusIcon}>
                <StatusIcon size={80} color="#FFFFFF" />
              </View>
              <Text style={styles.statusTitle}>{statusLabel}</Text>
              <Text style={styles.statusAmount}>
                {isExpense ? '-' : ''}Rp {formatNumber(tx.amount.toString())}
              </Text>
              <View style={styles.curveCutout} />
            </View>

            <View style={styles.recipientBox}>
              <View style={styles.recipientLeft}>
                <View style={styles.bankLogoWrapper}>
                  <Text style={styles.bankText}>{tx.bankShortName}</Text>
                </View>
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName} numberOfLines={1}>
                    {tx.accountHolderName}
                  </Text>
                  <Text style={styles.recipientMethod}>
                    {formatMethodLabel(tx.transactionMethod)}
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
                <Text style={styles.detailValue}>{formatDateTime(tx.createdAt)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Metode Pembayaran</Text>
                <Text style={styles.detailValue}>{formatMethodLabel(tx.transactionMethod)}</Text>
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
          <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
            <Text style={styles.backButtonText}>Kembali ke Daftar Transaksi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
