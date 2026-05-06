import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Share } from 'react-native';
import { CheckCircle2, Download, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatNumber } from '@/utils/Common';

interface PaymentReceiptViewProps {
  accountData?: {
    accountNumber: string;
    bankName: string;
    name: string;
  };
  bankData?: any;
  paymentMethod?: 'VA' | 'QRIS';
  amount?: string;
  transactionId?: string;
  dateTime?: string;
  onPressBack: () => void;
  onPressHome?: () => void;
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
}: PaymentReceiptViewProps) => {
  const bankName = bankData?.name || accountData?.bankName || 'Bank Central Asia';
  const ownerName = accountData?.name || 'Prabu Suwito';
  const methodLabel = paymentMethod === 'QRIS' ? 'QRIS' : 'Virtual Account - BCA';
  console.log('PaymentReceiptView - Props:', {
    accountData,
    bankData,
    paymentMethod,
    amount,
    transactionId,
    dateTime,
  });
  const formattedAmount = formatNumber(amount || '0');

  const handleDownload = () =>
    Alert.alert('Unduh Bukti', 'Fungsi unduh bukti akan segera tersedia.');
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Bukti Pembayaran\n\nBank: ${bankName}\nPenerima: ${ownerName}\nJumlah: Rp ${amount}\n\nSilakan scan QR code ini untuk melakukan pembayaran.`,
        title: 'Bagikan Bukti',
      });
    } catch (error) {
      Alert.alert('Gagal', 'Gagal untuk membagikan Bukti Pembayaran');
    }
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar title="" titlePosition="left" titleStyle="regular" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.resultCard}>
          <View style={styles.resultIcon}>
            <CheckCircle2 size={40} color="#FFFFFF" />
          </View>
          <Text style={styles.resultTitle}>Transfer Berhasil</Text>
          <Text style={styles.resultAmount}>Rp {formattedAmount}</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ID Transaksi</Text>
            <Text style={styles.detailValue}>{transactionId || 'TRX0123123'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tanggal & Waktu</Text>
            <Text style={styles.detailValue}>{dateTime || '12 February 2026 10:30:20'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <Text style={styles.detailValue}>{methodLabel}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Penerima</Text>
            <Text style={styles.detailValue}>{ownerName}</Text>
          </View>
        </View>

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
      </ScrollView>
    </View>
  );
};

export default PaymentReceiptView;
