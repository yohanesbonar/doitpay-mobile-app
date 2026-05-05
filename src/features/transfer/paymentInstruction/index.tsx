import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Image,
  TextInput,
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
  method?: 'receive' | 'pay';
}

const PaymentInstructionView = ({
  accountData,
  bankData,
  paymentMethod,
  amount: initialAmount,
  onPressBack,
  method,
}: PaymentInstructionViewProps) => {
  const [amount, setAmount] = useState(initialAmount || '');

  const bankName = bankData?.name || 'Bank Central Asia';
  const ownerName = bankData?.name || 'Prabu Suwito';
  const accountNumber = accountData?.accountNumber || '123012932141293120';
  const isQris = paymentMethod === 'QRIS';

  const formatNumber = (val: string) => {
    const cleanNumber = val.replace(/[^0-9]/g, '');
    if (cleanNumber === '') return '';
    return parseInt(cleanNumber).toLocaleString('id-ID');
  };

  const handleInputChange = (val: string) => {
    const formatted = formatNumber(val);
    setAmount(formatted);
  };

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
                  <Text style={styles.qrisAmountText}>{amount}</Text>
                </View>
                <Text style={styles.qrisTarget}>
                  Mengirim ke <Text style={styles.qrisTargetBoldText}>{ownerName}</Text>
                </Text>
              </View>
            ) : (
              <View style={styles.recipientInfo}>
                <Text style={styles.recipientName}>Yahya Rusdi</Text>
                <Text style={styles.recipientId}>NMID: ID12312932103</Text>
              </View>
            )}

            <View style={styles.qrCard}>
              <Image
                source={require('../../../assets/images/ic-qris-sample.png')}
                style={{ width: 280, height: 280 }}
                resizeMode="contain"
              />
              <Image
                source={require('../../../assets/images/ic-qris.png')}
                style={{ width: 80, height: 30, marginTop: 10 }}
                resizeMode="contain"
              />
            </View>

            {method === 'receive' && (
              <View style={styles.inputAmountWrapper}>
                <Text style={styles.inputCurrencyPrefix}>Rp</Text>
                <TextInput
                  style={[
                    styles.amountInput,
                    amount.length === 0 ? styles.amountInputPlaceholder : styles.amountInputActive,
                  ]}
                  placeholder="Nominal transfer"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={handleInputChange}
                />
              </View>
            )}

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
                Rp <Text style={styles.vaAmountBoldText}>{amount}</Text>
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
    </View>
  );
};

export default PaymentInstructionView;
