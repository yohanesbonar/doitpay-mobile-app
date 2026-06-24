import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TouchableOpacity, View, StyleSheet, TextInput, ScrollView } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Mail,
  MessageSquare,
  Search,
  FileText,
} from 'lucide-react-native';

interface DisputeHelpCenterViewProps {
  onPressBack: () => void;
  onPressReportCenter: () => void;
}

const FAQS = [
  {
    question: 'Apakah transfer benar-benar gratis ?',
    answer:
      'Ya, gratis untuk transfer hingga Rp5.000.000 per hari. Di atas itu dikenakan biaya Rp2.599 per transaksi.',
  },
  {
    question: 'Berapa lama transfer sampai?',
    answer: 'Rata-rata transfer berhasil dalam hitungan menit, tergantung status bank tujuan.',
  },
  {
    question: 'Bagaimana jika transfer gagal?',
    answer: 'Kamu dapat cek status transaksi di riwayat dan kirim laporan dari detail transaksi.',
  },
  {
    question: 'Bagaimana cara reset PIN?',
    answer: 'Gunakan menu Lupa PIN pada halaman login untuk memulai reset PIN.',
  },
  {
    question: 'Apa itu QRIS Terima Pembayaran',
    answer:
      'QRIS Terima Pembayaran digunakan untuk menerima pembayaran dari aplikasi bank atau e-wallet lain.',
  },
  {
    question: 'Bagaimana cara hapus akun?',
    answer: 'Masuk ke Profil, pilih Hapus Akun, lalu ikuti verifikasi untuk menyelesaikan proses.',
  },
];

export const DisputeHelpCenterView = ({
  onPressBack,
  onPressReportCenter,
}: DisputeHelpCenterViewProps) => {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar
        title="Pusat Bantuan"
        onPressBack={() => onPressBack()}
        titlePosition="left"
        titleStyle="bold"
        backgroundColor="#F5F5F7"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrapper}>
          <Search size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Cari pertanyaan"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
          />
        </View>

        <TouchableOpacity style={styles.menuCard} activeOpacity={0.8}>
          <View style={styles.menuIconWrapper}>
            <MessageSquare size={18} color="#6B7280" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Chat CS</Text>
            <Text style={styles.menuSubtitle}>Online 24/7</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} activeOpacity={0.8}>
          <View style={styles.menuIconWrapper}>
            <Mail size={18} color="#6B7280" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Email</Text>
            <Text style={styles.menuSubtitle}>help@doitpay.co</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} activeOpacity={0.8} onPress={onPressReportCenter}>
          <View style={styles.menuIconWrapper}>
            <FileText size={18} color="#6B7280" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Pusat Laporan</Text>
            <Text style={styles.menuSubtitle}>Buat & Cek Laporan</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>PERTANYAAN UMUM</Text>

        {FAQS.map((faq, index) => {
          const expanded = expandedIndex === index;

          return (
            <TouchableOpacity
              key={faq.question}
              activeOpacity={0.8}
              style={styles.faqItem}
              onPress={() => setExpandedIndex(expanded ? null : index)}>
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                {expanded ? (
                  <ChevronUp size={18} color="#737373" />
                ) : (
                  <ChevronDown size={18} color="#737373" />
                )}
              </View>
              {expanded && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  searchWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Switzer-Regular',
    fontSize: 13,
    color: '#111827',
  },
  menuCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: '#1F2937',
    fontSize: 15,
    fontFamily: 'Switzer-Bold',
  },
  menuSubtitle: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    marginTop: 2,
  },
  sectionLabel: {
    marginTop: 14,
    marginBottom: 8,
    color: '#737373',
    fontSize: 12,
    fontFamily: 'Switzer-Medium',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    color: '#1F2937',
    fontSize: 14,
    fontFamily: 'Switzer-Bold',
    paddingRight: 8,
  },
  faqAnswer: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'Switzer-Regular',
    marginTop: 8,
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
