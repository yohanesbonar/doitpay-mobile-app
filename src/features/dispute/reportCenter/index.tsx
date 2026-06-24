import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View, StyleSheet, ScrollView } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import IconMessageSquareWarning from '@/assets/icons/ic-message-square-warning.svg';
import { ChevronLeft } from 'lucide-react-native';

interface DisputeReportCenterViewProps {
  transactionId?: string;
  recipientName?: string;
  amount?: number;
  onPressBack: () => void;
  onPressCreateReport: () => void;
  onPressMyReports: () => void;
}

export const DisputeReportCenterView = ({
  transactionId,
  recipientName,
  amount,
  onPressBack,
  onPressCreateReport,
  onPressMyReports,
}: DisputeReportCenterViewProps) => {
  const steps = [
    {
      number: '1',
      title: 'Jelaskan kendalamu',
      subtitle: 'Pilih kategori dan unggah bukti pendukung jika tersedia',
    },
    {
      number: '2',
      title: 'Kami proses laporanmu',
      subtitle: 'Estimasi waktu penanganan akan ditampilkan setelah laporan dikirim.',
    },
    {
      number: '3',
      title: 'Pantau status laporan',
      subtitle: 'Lihat perkembangan dan hasil penanganan langsung di aplikasi.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar
        title="Pusat Bantuan"
        onPressBack={() => onPressBack()}
        titlePosition="left"
        titleStyle="bold"
        backgroundColor="#F5F5F7"
      />

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.iconBubble}>
            <IconMessageSquareWarning width={32} height={32} />
          </View>

          <Text style={styles.title}>Laporkan Masalah</Text>
          <Text style={styles.subtitle}>Kami siap membantu menyelesaikan kendalamu</Text>

          <View style={styles.stepsList}>
            {steps.map((step) => (
              <View key={step.number} style={styles.stepCard}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{step.number}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepText}>{step.title}</Text>
                  <Text style={styles.stepSubText}>{step.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>

          {!!transactionId && (
            <View style={styles.transactionCard}>
              <Text style={styles.txLabel}>Detail transaksi</Text>
              <Text style={styles.txValue}>{transactionId}</Text>
              <Text style={styles.txMeta}>{recipientName || '-'} • Rp {(amount || 0).toLocaleString('id-ID')}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footerButtons}>
          <TouchableOpacity onPress={onPressMyReports} style={styles.secondaryButton} activeOpacity={0.8}>
            <Text style={styles.secondaryButtonText}>Lihat Status Laporan</Text>
          </TouchableOpacity>

          <Button
            onPress={onPressCreateReport}
            title="Laporkan Kendala"
            color="#3475E8"
            type="regular"
            textColor="white"
            textStyle={styles.primaryButtonText}
            style={styles.primaryButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 146,
  },
  iconBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3475E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Switzer-Medium',
    fontSize: 24,
    color: '#121212',
    lineHeight: 54,
  },
  subtitle: {
    marginTop: 0,
    marginBottom: 20,
    color: '#374151',
    fontFamily: 'Switzer-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  stepsList: {
    gap: 10,
  },
  stepCard: {
    borderWidth: 1,
    borderColor: '#A5C2F8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#F8FBFF',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepBadge: {
    width: 36,
    height: 36,
    borderRadius: 7,
    backgroundColor: '#3981FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Switzer-Medium',
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
  },
  stepText: {
    color: '#000',
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
  },
  stepSubText: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    marginTop: 4,
    lineHeight: 16,
    paddingRight: 6,
  },
  transactionCard: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  txLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
  },
  txValue: {
    color: '#111827',
    fontSize: 14,
    fontFamily: 'Switzer-Bold',
    marginTop: 4,
  },
  txMeta: {
    color: '#1F2937',
    fontSize: 13,
    fontFamily: 'Switzer-Regular',
    marginTop: 4,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#D4D4D8',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#F9FAFB',
  },
  secondaryButtonText: {
    fontFamily: 'Switzer-Regular',
    color: '#000000',
    fontSize: 14,
  },
  primaryButton: {
    borderRadius: 24,
    height: 48,
  },
  primaryButtonText: {
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  footerButtons: {
    paddingTop: 12,
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    backgroundColor: '#F5F5F7',
  },
  headerBackButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
