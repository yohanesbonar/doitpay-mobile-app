import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { Clock, RefreshCw, Headset, Info } from 'lucide-react-native';

interface PaymentExpiredViewProps {
  method: 'transfer' | 'receive';
  isQRIS: boolean;
  amount: string | number;
  transactionId: string;
  dateTime: string;
  paymentMethod: string;
  recipientName: string;
  onActionNewPayment: () => void;
  onContactSupport: () => void;
  isButtonLoading?: boolean;
}

const { width } = Dimensions.get('window');

export const PaymentExpiredView: React.FC<PaymentExpiredViewProps> = ({
  method,
  isQRIS,
  amount,
  transactionId,
  dateTime,
  paymentMethod,
  recipientName,
  onActionNewPayment,
  onContactSupport,
  isButtonLoading = false,
}) => {
  const isReceive = method === 'receive';

  const statusTitle = isReceive ? 'Pembayaran Berakhir' : 'Transfer Dibatalkan';

  let statusSubtitle = '';
  if (isReceive) {
    statusSubtitle = isQRIS
      ? 'QRIS telah melewati masa berlaku dan tidak menerima pembayaran'
      : 'VA telah melewati masa berlaku dan tidak menerima pembayaran';
  } else {
    statusSubtitle = isQRIS
      ? 'QR telah melewati masa berlaku dan tidak menerima pembayaran'
      : 'VA telah melewati masa berlaku dan tidak menerima pembayaran';
  }

  let buttonLabel = '';
  if (isReceive) {
    buttonLabel = isQRIS ? 'Buat QRIS Baru' : 'Buat Virtual Account Baru';
  } else {
    buttonLabel = isQRIS ? 'Buat QRIS Baru' : 'Buat Virtual Account Baru';
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <Clock size={44} color="#6B7280" strokeWidth={2.5} />
          </View>
          <Text style={styles.amountText}>
            Rp {amount ? Number(amount).toLocaleString('id-ID') : '0'}
          </Text>
          <Text style={styles.statusTitle}>{statusTitle}</Text>
          <Text style={styles.statusSubtitle}>{statusSubtitle}</Text>
          <View style={styles.curveCutout} />
        </View>

        <View style={styles.contentBody}>
          <Text style={styles.sectionTitle}>Detail Transaksi</Text>

          <View style={styles.rowDetail}>
            <Text style={styles.label}>ID Transaksi</Text>
            <Text style={styles.valueBold}>{transactionId}</Text>
          </View>

          <View style={styles.rowDetail}>
            <Text style={styles.label}>Tanggal & Waktu</Text>
            <Text style={styles.valueBold}>{dateTime}</Text>
          </View>

          <View style={styles.rowDetail}>
            <Text style={styles.label}>Metode Pembayaran</Text>
            <Text style={styles.valueBold}>{paymentMethod}</Text>
          </View>

          <View style={styles.rowDetail}>
            <Text style={styles.label}>Penerima</Text>
            <Text style={styles.valueBold}>{recipientName}</Text>
          </View>

          <View style={styles.alertBox}>
            <View style={styles.alertHeaderRow}>
              <Info size={24} color="#1F2937" style={{ marginRight: 8 }} />
              <Text style={styles.alertTitle}>Permintaan pembayaran berakhir</Text>
            </View>
            <Text style={styles.alertNote}>
              Tidak ada pembayaran yang diterima sebelum batas waktu berakhir
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.btnAction, isButtonLoading && styles.btnDisabled]} 
          onPress={onActionNewPayment} 
          disabled={isButtonLoading}
          activeOpacity={0.8}
        >
          {isButtonLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <RefreshCw size={16} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.btnActionText}>{buttonLabel}</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSupport} onPress={onContactSupport} activeOpacity={0.8}>
          <Headset size={16} color="#0A0A0A" style={{ marginRight: 8 }} />
          <Text style={styles.btnSupportText}>Hubungi Bantuan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  scrollContainer: { flexGrow: 1 },
  headerCard: {
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    paddingTop: 70,
    paddingBottom: 60,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountText: { color: '#171717', fontSize: 30, fontFamily: 'Switzer-Semibold', marginBottom: 8 },
  statusTitle: { color: '#171717', fontSize: 24, fontFamily: 'Switzer-Semibold', marginBottom: 8 },
  statusSubtitle: {
    color: '#171717',
    fontSize: 16,
    fontFamily: 'Switzer-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  contentBody: { paddingHorizontal: 24, paddingTop: 0 },
  sectionTitle: { fontSize: 20, fontFamily: 'Switzer-Semibold', color: '#000', marginBottom: 10 },
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#D4D4D4',
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    width: '50%',
    textAlign: 'left',
  },
  value: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#171717',
    width: '50%',
    textAlign: 'right',
  },
  valueBold: {
    fontSize: 14,
    fontFamily: 'Switzer-Medium',
    color: '#171717',
    width: '50%',
    textAlign: 'right',
  },
  alertBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  alertHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  alertTitle: { fontSize: 16, fontFamily: 'Switzer-Regular', color: '#171717' },
  alertNote: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#000000',
    lineHeight: 18,
    paddingLeft: 26,
    marginLeft: 5,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, backgroundColor: '#FFF' },
  btnAction: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnActionText: { color: '#FFF', fontSize: 15, fontFamily: 'Switzer-Semibold' },
  btnSupport: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: '#93C5FD',
  },
  btnSupportText: { color: '#0A0A0A', fontSize: 15, fontFamily: 'Switzer-Semibold' },
  curveCutout: {
    position: 'absolute',
    width: width * 2.43,
    height: width * 2.25,
    borderRadius: (width * 2.43) / 2,
    bottom: -width * 2.13,
    backgroundColor: '#FFFFFF',
  },
});
