import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import { ChevronDown, Copy, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';

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
}

const PaymentInstructionView = ({
  accountData,
  bankData,
  paymentMethod,
  amount,
  onPressBack,
}: PaymentInstructionViewProps) => {
  console.log('PaymentInstructionView - Props:', {
    accountData,
    bankData,
    paymentMethod,
    amount,
  });

  const accountNumber = accountData?.accountNumber || '123012932141293120';
  const bankName = bankData?.name || 'Bank Central Asia';
  const ownerName = bankData?.name || 'Prabu Suwito';
  const isQris = paymentMethod === 'QRIS';

  const handleCopy = () => Alert.alert('Sukses', 'Nomor VA berhasil disalin');

  const handleShareQris = async () => {
    try {
      await Share.share({
        message: `QRIS Pembayaran\n\nBank: ${bankName}\nPenerima: ${ownerName}\nJumlah: Rp ${amount}\n\nSilakan scan QR code ini untuk melakukan pembayaran.`,
        title: 'Bagikan QRIS',
      });
    } catch (error) {
      Alert.alert('Gagal', 'Gagal untuk membagikan QRIS');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Pembayaran"
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="regular"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isQris ? (
          <View style={styles.qrisContainer}>
            <Text style={styles.qrisLabel}>Total pembayaran</Text>
            <View style={styles.qrisAmountWrapper}>
              <Text style={styles.qrisCurrency}>Rp</Text>
              <Text style={styles.qrisAmountText}>{amount}</Text>
            </View>
            <Text style={styles.qrisTarget}>
              Mengirim ke <Text style={styles.qrisTargetBoldText}>{ownerName}</Text>
            </Text>

            <View style={styles.qrCard}>
              <Image
                source={require('../../../assets/images/ic-qris-sample.png')}
                style={{ width: 322 }}
                resizeMode="contain"
              />
              <Image
                source={require('../../../assets/images/ic-qris.png')}
                style={{ width: 90 }}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity style={styles.outlineButton} onPress={handleShareQris}>
              <Download size={18} color="#111827" style={{ marginRight: 8 }} />
              <Text style={styles.outlineButtonText}>Unduh Gambar QRIS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineButton} onPress={handleShareQris}>
              <Share2 size={18} color="#111827" style={{ marginRight: 8 }} />
              <Text style={styles.outlineButtonText}>Bagikan</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={styles.vaCard}>
              <View style={styles.vaHeader}>
                <View style={styles.bankLogoPlaceholder}>
                  <Text style={styles.bankInitial}>{bankName.toUpperCase()}</Text>
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
                Rp <Text style={styles.vaAmountBoldText}>{amount}</Text>
              </Text>
            </View>

            <Text style={styles.guideTitle}>Cara Pembayaran</Text>
            <TouchableOpacity style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>Mobile Banking</Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem}>
              <Text style={styles.dropdownText}>ATM</Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentInstructionView;
