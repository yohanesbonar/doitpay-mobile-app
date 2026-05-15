import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, TextInput } from 'react-native';
import { ChevronDown, Copy, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatNumber } from '@/utils/Common';
import QRCode from 'react-native-qrcode-svg';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import ViewShot from 'react-native-view-shot';

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
}: PaymentInstructionViewProps) => {
  const [amount, setAmount] = useState(initialAmount || '');

  const bankName = bankData?.name || 'Bank Central Asia';
  const ownerName = accountData?.ownerName || 'Prabu Suwito';
  const accountNumber = accountData?.accountNumber || '123012932141293120';
  const isQris = paymentMethod === 'QRIS';

  console.log('transferData ->>', transferData);
  console.log('receiveData ->>', receiveData);

  const handleInputChange = (val: string) => {
    setNewAmount?.(val);
    setAmount(formatNumber(val));
  };

  const handleCopy = () => Alert.alert('Sukses', 'Nomor VA berhasil disalin');

  const viewShotRef = useRef<any>(null);

  const handleDownloadQris = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await CameraRoll.saveAsset(uri, { type: 'photo' });
      Alert.alert('Sukses', 'QRIS berhasil disimpan ke galeri');
    } catch (error) {
      Alert.alert('Gagal', 'Gagal menyimpan QRIS');
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
            {method !== 'receive' ? (
              <View>
                <Text style={styles.qrisLabel}>Total pembayaran</Text>
                <View style={styles.qrisAmountWrapper}>
                  <Text style={styles.qrisCurrency}>Rp</Text>
                  <Text style={styles.qrisAmountText}>
                    {formatNumber(receiveData?.amount ?? 0)}
                  </Text>
                </View>
                <Text style={styles.qrisTarget}>
                  Mengirim ke{' '}
                  <Text style={styles.qrisTargetBoldText} numberOfLines={3}>
                    {ownerName}
                  </Text>
                </Text>
              </View>
            ) : (
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>{receiveData?.recipientName ?? ''}</Text>
                <Text style={styles.recipientId}>{`NMID: ${receiveData?.nmid ?? ''}`}</Text>
              </View>
            )}

            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1.0 }}
              style={{ backgroundColor: 'white', padding: 20, borderRadius: 16 }} // Pastikan ada bg white
            >
              <View style={styles.qrCard}>
                {receiveData?.qrString && <QRCode value={receiveData?.qrString ?? ''} size={280} />}

                <Image
                  source={require('../../../assets/images/ic-qris.png')}
                  style={{ width: 80, height: 30, marginTop: 16 }}
                  resizeMode="contain"
                />
              </View>
            </ViewShot>

            {method === 'receive' && (
              <View style={styles.inputAmountWrapper}>
                <Text style={styles.inputCurrencyPrefix}>Rp</Text>
                <Text style={[styles.amountText]}>{formatNumber(amount)}</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            <View style={styles.vaCard}>
              <View style={styles.vaHeader}>
                <View style={styles.bankLogoPlaceholder}>
                  <Text style={styles.bankInitial}>{bankName.toUpperCase().substring(0, 3)}</Text>
                </View>
                <Text style={styles.bankNameText}>{bankName}</Text>
              </View>

              <Text style={styles.vaLabel}>Nomor virtual account</Text>
              <View style={styles.vaNumberRow}>
                <Text style={styles.vaNumberText}>{accountNumber}</Text>
                <TouchableOpacity style={styles.copyBadge} onPress={handleCopy}>
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
