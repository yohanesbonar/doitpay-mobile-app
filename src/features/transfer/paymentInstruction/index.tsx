import React, { useEffect, useRef, useState } from 'react';
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
import { ChevronDown, Clock, Copy, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatNumber } from '@/utils/Common';
import QRCode from 'react-native-qrcode-svg';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';
import Clipboard from '@react-native-clipboard/clipboard';
import { getAmountRange, trackPostHogEvent } from '@/analytics/posthog';

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
  instructionData?: {
    status: string;
    message: string;
    data: {
      payment_code: string;
      channels: {
        channel: string;
        steps: string[];
      }[];
    }[];
  };
  isPendingPaymentInstruction?: boolean;
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
  instructionData,
  isPendingPaymentInstruction,
}: PaymentInstructionViewProps) => {
  const [amount, setAmount] = useState(initialAmount || 0);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const [countdownText, setCountdownText] = useState('00:00');

  const isQris = paymentMethod === 'QRIS';

  const expiredAtRaw =
    transferData?.paymentExpiredAt ||
    receiveData?.paymentExpiredAt ||
    transferData?.paymentInstrument?.expiredAt;

  const formattedExpiryDate = expiredAtRaw
    ? new Date(expiredAtRaw).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' WIB'
    : '';

  useEffect(() => {
    if (!expiredAtRaw) {
      setCountdownText('00:00');
      return;
    }

    const targetTime = new Date(expiredAtRaw).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setCountdownText('00:00');
        clearInterval(intervalId);
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

      if (hours > 0) {
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        setCountdownText(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
      } else {
        setCountdownText(`${formattedMinutes}:${formattedSeconds}`);
      }
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [expiredAtRaw]);

  const handleCopy = (text) => {
    Clipboard.setString(text);
    trackPostHogEvent('va_number_copied', {
      source_bank:
        transferData?.va?.name || receiveData?.va?.name || bankData?.shortName || 'unknown',
    });
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

  const toggleDropdown = (channelName: string) => {
    setExpandedChannel(expandedChannel === channelName ? null : channelName);
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
        <View style={styles.payBeforeCard}>
          <View style={styles.payBeforeLeft}>
            <Clock size={18} color="#6B7280" style={{ marginRight: 8, marginTop: 1 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.payBeforeLabel}>Pay before:</Text>
              <Text style={styles.payBeforeDate} numberOfLines={1}>
                {formattedExpiryDate}
              </Text>
            </View>
          </View>
          <Text style={styles.payBeforeCountdown}>{countdownText}</Text>
        </View>

        {isQris ? (
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
                      {formatNumber(transferData?.amount ?? receiveData?.amount ?? 0)}
                    </Text>
                  </View>
                  <Text style={styles.qrisTarget}>
                    Mengirim ke{' '}
                    <Text style={styles.qrisTargetBoldText} numberOfLines={3}>
                      {transferData?.qris?.recipientName ?? receiveData?.qris?.recipientName ?? ''}
                    </Text>
                  </Text>
                </View>
              ) : (
                <View style={styles.recipientInfo}>
                  <Text style={styles.recipientName}>{receiveData?.qris?.recipientName ?? ''}</Text>
                  <Text style={styles.recipientId}>{`NMID: ${receiveData?.qris?.nmid ?? ''}`}</Text>
                </View>
              )}

              <View style={styles.qrCard}>
                {receiveData?.qris?.content && (
                  <QRCode value={receiveData?.qris?.content ?? ''} size={250} />
                )}
                {transferData?.qris?.content && (
                  <QRCode value={transferData?.qris?.content ?? ''} size={250} />
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
                  <Text style={[styles.amountText]}>{formatNumber(receiveData?.amount)}</Text>
                </View>
              )}
            </ViewShot>
          </View>
        ) : (
          <View>
            <View style={styles.vaCard}>
              <View style={styles.vaHeader}>
                <Image
                  source={{
                    uri: transferData?.va?.logoUrl || receiveData?.va?.logoUrl,
                  }}
                  style={{ width: 64, height: 64, resizeMode: 'contain' }}
                />
                <Text style={styles.bankNameText}>
                  {transferData?.va?.name ?? receiveData?.va?.name ?? ''}
                </Text>
              </View>

              <Text style={styles.vaLabel}>Nomor virtual account</Text>
              <View style={styles.vaNumberRow}>
                <Text style={styles.vaNumberText}>
                  {transferData?.va?.number ?? receiveData?.va?.number ?? ''}
                </Text>
                <TouchableOpacity
                  style={styles.copyBadge}
                  onPress={() => handleCopy(transferData?.va?.number || receiveData?.va?.number)}>
                  <Copy size={14} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.copyText}>Salin</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.vaLabelWithMargin}>Amount</Text>
              <Text style={styles.vaAmountText}>
                Rp{' '}
                <Text style={styles.vaAmountBoldText}>
                  {formatNumber(transferData?.amount || receiveData?.amount)}
                </Text>
              </Text>
            </View>

            <View
              style={{ backgroundColor: '#F9FAFB', paddingVertical: 12, paddingHorizontal: 20 }}>
              <Text style={styles.guideTitle}>Cara Pembayaran</Text>
              {!isPendingPaymentInstruction && instructionData?.data?.[0]?.channels ? (
                instructionData.data[0].channels.map((item) => {
                  const isExpanded = expandedChannel === item.channel;

                  return (
                    <View key={item.channel} style={{ width: '100%', marginBottom: 8 }}>
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => toggleDropdown(item.channel)}>
                        <Text style={styles.dropdownText}>{item.channel}</Text>

                        <ChevronDown
                          size={20}
                          color="#6B7280"
                          style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
                        />
                      </TouchableOpacity>

                      {isExpanded && (
                        <View style={styles.instructionStepsContainer}>
                          {item.steps.map((stepText, stepIndex) => (
                            <View key={stepIndex} style={styles.stepRow}>
                              <View style={styles.stepNumberBadge}>
                                <Text style={styles.stepNumberText}>{stepIndex + 1}</Text>
                              </View>
                              <Text style={styles.stepInstructionText}>{stepText}</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <Text style={{ color: '#9CA3AF', fontFamily: 'Switzer-Regular', paddingLeft: 4 }}>
                  Memuat petunjuk pembayaran...
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      {isQris && (
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
