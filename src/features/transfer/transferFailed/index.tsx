import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { X, AlertCircle, RefreshCw, Headset } from 'lucide-react-native';
import { formatNumber } from '@/utils/Common';

interface TransferFailedViewProps {
  title: string;
  infoLabel: string;
  note: string;
  amount: string | number;
  transactionId: string;
  dateTime: string;
  paymentMethod: string;
  recipientName: string;
  onRetry: () => void;
  onContactSupport: () => void;
}

const { width } = require('react-native').Dimensions.get('window');

export const TransferFailedView: React.FC<TransferFailedViewProps> = ({
  title,
  infoLabel,
  note,
  amount,
  transactionId,
  dateTime,
  paymentMethod,
  recipientName,
  onRetry,
  onContactSupport,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={false}>
        <View style={styles.headerCard}>
          <View style={styles.iconContainer}>
            <X size={44} color="#EF4444" strokeWidth={2.5} />
          </View>
          <Text style={styles.statusTitle}>{title}</Text>
          <Text style={styles.amountText}>Rp {formatNumber(amount)}</Text>
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
            <Text style={styles.value}>{dateTime}</Text>
          </View>

          <View style={styles.rowDetail}>
            <Text style={styles.label}>Metode Pembayaran</Text>
            <Text style={styles.value}>{paymentMethod}</Text>
          </View>

          <View style={styles.rowDetail}>
            <Text style={styles.label}>Penerima</Text>
            <Text style={styles.valueBold}>{recipientName}</Text>
          </View>

          <View style={styles.alertBox}>
            <View style={styles.alertHeaderRow}>
              <AlertCircle size={18} color="#EF4444" style={{ marginRight: 8 }} />
              <Text style={styles.alertTitle}>{infoLabel}</Text>
            </View>
            <Text style={styles.alertNote}>{note}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnRetry} onPress={onRetry} activeOpacity={0.8}>
          <RefreshCw size={16} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.btnRetryText}>Coba Lagi</Text>
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
    backgroundColor: '#EF4444',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 65,
    paddingBottom: 70,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: { color: '#FFF', fontSize: 24, fontFamily: 'Switzer-Semibold', marginBottom: 8 },
  amountText: { color: '#FFF', fontSize: 48, fontFamily: 'Switzer-Bold' },
  contentBody: { paddingHorizontal: 24, paddingTop: 8 },
  sectionTitle: { fontSize: 18, fontFamily: 'Switzer-Bold', color: '#0A0A0A', marginBottom: 20 },
  rowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    width: '100%',
  },
  label: { fontSize: 14, fontFamily: 'Switzer-Regular', color: '#6B7280', width: '50%' },
  value: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#111827',
    width: '50%',
    textAlign: 'right',
  },
  valueBold: {
    fontSize: 14,
    fontFamily: 'Switzer-Bold',
    color: '#111827',
    width: '50%',
    textAlign: 'right',
  },
  alertBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  alertHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  alertTitle: { fontSize: 14, fontFamily: 'Switzer-Bold', color: '#991B1B' },
  alertNote: {
    fontSize: 13,
    fontFamily: 'Switzer-Regular',
    color: '#991B1B',
    lineHeight: 18,
    paddingLeft: 26,
  },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12, backgroundColor: '#FFF' },
  btnRetry: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnRetryText: { color: '#FFF', fontSize: 15, fontFamily: 'Switzer-Bold' },
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
  btnSupportText: { color: '#0A0A0A', fontSize: 15, fontFamily: 'Switzer-Bold' },
  curveCutout: {
    position: 'absolute',
    width: width * 2.43,
    height: width * 2.25,
    borderRadius: (width * 2.43) / 2,
    bottom: -width * 2.13,
    backgroundColor: '#FFFFFF',
  },
});
