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
  holdTemporary: () => void;
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
  holdTemporary,
  instructionData,
  isPendingPaymentInstruction,
}: PaymentInstructionViewProps) => {
  const [amount, setAmount] = useState(initialAmount || 0);
  const [expandedChannel, setExpandedChannel] = useState<string | null>(null);

  const isQris = paymentMethod === 'QRIS';

  console.log('instructionData ->>', instructionData);

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
                      {transferData?.qris?.recipientName ?? ''}
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
                  <QRCode value={receiveData?.qris?.content ?? ''} size={280} />
                )}
                {transferData?.qris?.content && (
                  <QRCode value={transferData?.qris?.content ?? ''} size={280} />
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
                  source={{ uri: transferData?.va?.logoUrl }}
                  style={{ width: 64, height: 64, resizeMode: 'contain' }}
                />
                <Text style={styles.bankNameText}>{transferData?.va.name ?? ''}</Text>
              </View>

              <Text style={styles.vaLabel}>Nomor virtual account</Text>
              <View style={styles.vaNumberRow}>
                <Text style={styles.vaNumberText}>{transferData?.va?.number ?? ''}</Text>
                <TouchableOpacity
                  style={styles.copyBadge}
                  onPress={() => handleCopy(transferData?.vaNumber)}
                  onLongPress={() => holdTemporary()}>
                  <Copy size={14} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.copyText}>Salin</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.vaLabelWithMargin}>Amount</Text>
              <Text style={styles.vaAmountText}>
                Rp <Text style={styles.vaAmountBoldText}>{formatNumber(transferData?.amount)}</Text>
              </Text>
            </View>

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
        )}
      </ScrollView>
      {(isQris || method === 'receive') && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={handleDownloadQris}
            onLongPress={() => holdTemporary()}>
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
