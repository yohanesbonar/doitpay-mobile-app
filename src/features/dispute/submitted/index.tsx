import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Check } from 'lucide-react-native';
import Button from '@/components/atoms/Button';

interface DisputeSubmittedViewProps {
  reportId: string;
  dateLabel: string;
  onPressViewReport: () => void;
  onPressBackToHome: () => void;
}

export const DisputeSubmittedView = ({
  reportId,
  dateLabel,
  onPressViewReport,
  onPressBackToHome,
}: DisputeSubmittedViewProps) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Check size={36} color="#FFFFFF" />
        </View>
        <Text style={styles.heroTitle}>Laporan kamu terkirim</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Detail laporan</Text>

        <View style={styles.row}>
          <Text style={styles.label}>ID Laporan</Text>
          <Text style={styles.value}>{reportId}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{dateLabel}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.status}>Diajukan</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          onPress={onPressViewReport}
          title="Lihat Laporan"
          color="#3475E8"
          type="regular"
          textColor="white"
          textStyle={styles.primaryButtonText}
          style={styles.primaryButton}
        />

        <TouchableOpacity onPress={onPressBackToHome} style={styles.secondaryButton} activeOpacity={0.8}>
          <Text style={styles.secondaryButtonText}>Kembali ke Beranda</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    backgroundColor: '#3475E8',
    alignItems: 'center',
    paddingTop: 42,
    paddingBottom: 34,
  },
  heroBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: 'Switzer-Bold',
    fontSize: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    color: '#1F2937',
    fontFamily: 'Switzer-Bold',
    fontSize: 16,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  label: {
    color: '#6B7280',
    fontSize: 13,
    fontFamily: 'Switzer-Regular',
  },
  value: {
    color: '#111827',
    fontSize: 13,
    fontFamily: 'Switzer-Medium',
  },
  status: {
    color: '#3475E8',
    fontSize: 13,
    fontFamily: 'Switzer-Bold',
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  primaryButton: {
    borderRadius: 24,
    height: 48,
  },
  primaryButtonText: {
    fontFamily: 'Switzer-Bold',
    fontSize: 15,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
});
