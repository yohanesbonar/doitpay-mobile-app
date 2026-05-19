import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import { ChevronDown, Copy, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatNumber } from '@/utils/Common';
import QRCode from 'react-native-qrcode-svg';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import Clipboard from '@react-native-clipboard/clipboard';

interface PaymentInstructionViewProps {
  accountData?: {
    accountNumber: string;
    bankName: string;
    name: string;
  };
  bankData?: any;
  paymentMethod?: 'VA' | 'QRIS';
  amount?: string;
  onPressBack: () => void;
  method?: 'receive' | 'pay';
  setNewAmount?: (val: string) => void;
  transferData?: any;
  receiveData?: any;
  bankPayment?: any;
}

const PaymentInstructionView = ({
  accountData,
  bankData,
  paymentMethod,
  amount: initialAmount,
  onPressBack,
  method,
  setNewAmount,
  transferData,
  receiveData,
  bankPayment,
}: PaymentInstructionViewProps) => {
  const [amount, setAmount] = useState(initialAmount || 0);

  const isQris = paymentMethod === 'QRIS';

  console.log('transferData ->>', transferData);
  console.log('receiveData ->>', receiveData);
  console.log('bankPayment ->>', bankPayment);

  const handleCopy = (text) => {
    Clipboard.setString(text);
    Alert.alert('Sukses', 'Nomor VA berhasil disalin');
  };

  const viewShotRef = useRef<any>(null);

  const hasAndroidPermission = async () => {
    const getCheckPermission =
      Platform.Version >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(getCheckPermission);
    if (hasPermission) return true;

    const status = await PermissionsAndroid.request(getCheckPermission);
    return status === 'granted';
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
      Alert.alert('Info', 'QRIS disimpan. Silakan buka aplikasi Galeri/Photos di HP kamu.');
    }
  };

  const handleDownloadQris = async () => {
    try {
      const uri = await viewShotRef.current.capture();

      let targetUri = uri;

      if (Platform.OS === 'ios') {
        if (uri.startsWith('file://')) {
          targetUri = uri.replace('file://', '');
        }

        await CameraRoll.saveAsset(targetUri, { type: 'photo' });
        Alert.alert('Sukses', 'QRIS berhasil disimpan ke Galeri Foto.', [
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

        Alert.alert('Sukses', 'QRIS berhasil disimpan ke Galeri Foto.', [
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
        Alert.alert(
          'Gagal Menyimpan',
          'Terjadi kendala pada Simulator iOS. Fitur ini berjalan normal di iPhone fisik dengan Info.plist yang sudah kamu konfigurasi.',
        );
      } else {
        Alert.alert('Gagal', 'Gagal menyimpan QRIS ke galeri');
      }
    }
  };

  const handleShareQrisImage = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: uri,
        title: 'Bagikan QRIS',
        message: `QRIS Pembayaran sebesar Rp ${amount}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title={method === 'receive' ? 'Terima Pembayaran' : 'Pembayaran'}
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="regular"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isQris || method === 'receive' ? (
          <View style={styles.qrisContainer}>
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1.0 }}
              style={styles.viewShotWrapper}>
              {method !== 'receive' ? (
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <Text style={styles.qrisLabel}>Total pembayaran</Text>
                  <View style={styles.qrisAmountWrapper}>
                    <Text style={styles.qrisCurrency}>Rp</Text>
                    <Text style={styles.qrisAmountText}>
                      {formatNumber(transferData?.amount ?? 0)}
                    </Text>
                  </View>
                  <Text style={styles.qrisTarget}>
                    Mengirim ke{' '}
                    <Text style={styles.qrisTargetBoldText} numberOfLines={3}>
                      {transferData?.recipientName ?? ''}
                    </Text>
                  </Text>
                </View>
              ) : (
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName}>{receiveData?.recipientName ?? ''}</Text>
                  <Text style={styles.recipientId}>{`NMID: ${receiveData?.nmid ?? ''}`}</Text>
                </View>
              )}

              <View style={styles.qrCard}>
                {receiveData?.qrString && <QRCode value={receiveData?.qrString ?? ''} size={280} />}
                {transferData?.qrString && (
                  <QRCode value={transferData?.qrString ?? ''} size={280} />
                )}
                <Image
                  source={require('../../../assets/images/ic-qris.png')}
                  style={{ width: 80, height: 30, marginTop: 16 }}
                  resizeMode="contain"
                />
              </View>

              {method === 'receive' && (
                <View style={styles.inputAmountWrapper}>
                  <Text style={styles.inputCurrencyPrefix}>Rp</Text>
                  <Text style={[styles.amountText]}>{formatNumber(amount)}</Text>
                </View>
              )}
            </ViewShot>
          </View>
        ) : (
          <View>
            <View style={styles.vaCard}>
              <View style={styles.vaHeader}>
                <Image
                  source={
                    bankPayment?.shortName == 'BCA'
                      ? require('../../../assets/images/ic-BCA.png')
                      : require('../../../assets/images/ic-CIMB.png')
                  }
                  style={{ width: 64, height: 64, resizeMode: 'contain' }}
                />
                <Text style={styles.bankNameText}>{bankPayment?.name ?? ''}</Text>
              </View>

              <Text style={styles.vaLabel}>Nomor virtual account</Text>
              <View style={styles.vaNumberRow}>
                <Text style={styles.vaNumberText}>{transferData?.vaNumber ?? ''}</Text>
                <TouchableOpacity
                  style={styles.copyBadge}
                  onPress={() => handleCopy(transferData?.vaNumber)}>
                  <Copy size={14} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.copyText}>Salin</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.vaLabelWithMargin}>Amount</Text>
              <Text style={styles.vaAmountText}>
                Rp <Text style={styles.vaAmountBoldText}>{formatNumber(amount)}</Text>
              </Text>
            </View>

            <Text style={styles.guideTitle}>Cara Pembayaran</Text>
            {['Mobile Banking', 'ATM'].map((item) => (
              <TouchableOpacity key={item} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{item}</Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
      {(isQris || method === 'receive') && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.outlineButton} onPress={handleDownloadQris}>
            <Download size={18} color="#111827" style={{ marginRight: 8 }} />
            <Text style={styles.outlineButtonText}>Unduh Gambar QRIS</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.outlineButton} onPress={handleShareQrisImage}>
            <Share2 size={18} color="#111827" style={{ marginRight: 8 }} />
            <Text style={styles.outlineButtonText}>Bagikan</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PaymentInstructionView;
