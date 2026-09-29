import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { createStyles } from '../activateQris/styles';
import { CreditCard, File, Image } from 'lucide-react-native';

interface KycIntroViewProps {
  onPressBack: () => void;
  onPressContinueKyc: () => void;
  onPressSkip: () => void;
}

// Entry point to KYC for newly registered users who received an access token from pin-setup.
// Layout mirrors ActivateQrisView (KYC_INCOMPLETE state) minus the status banner.
export const KycIntroView = ({
  onPressBack,
  onPressContinueKyc,
  onPressSkip,
}: KycIntroViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const renderInfoItem = ({
    title,
    description,
    icon,
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }) => (
    <View style={styles.itemRow}>
      <View style={[styles.itemIconContainer, styles.itemIconContainerNeutral]}>{icon}</View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDesc}>{description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="KYC"
        titlePosition="center"
        titleStyle="medium"
        onPressBack={onPressBack}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>KYC (Know Your Customer)</Text>
        <Text style={styles.subtitle}>
          Verifikasi identitasmu dengan KTP dan foto selfie untuk membuka semua fitur Doitpay,
          termasuk transfer dan terima pembayaran dengan limit lebih besar. Prosesnya cepat dan
          datamu terlindungi dengan aman.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yang Perlu Disiapkan</Text>
          {renderInfoItem({
            title: 'Data Usaha',
            description: 'Nama, kategori, alamat, dan deskripsi barang atau jasa',
            icon: <File size={22} color="#6B7280" strokeWidth={2} />,
          })}
          {renderInfoItem({
            title: 'Foto Bukti Usaha',
            description: 'Foto produk, tempat usaha, menu, atau aktivitas layanan',
            icon: <Image size={22} color="#6B7280" strokeWidth={2} />,
          })}
          {renderInfoItem({
            title: 'NPWP (opsional)',
            description: 'NPWP pemilik usaha untuk proses verifikasi.',
            icon: <CreditCard size={22} color="#6B7280" strokeWidth={2} />,
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={onPressContinueKyc}
          activeOpacity={0.8}>
          <Text style={styles.buttonPrimaryText}>Lanjutkan Verifikasi KTP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={onPressSkip} activeOpacity={0.8}>
          <Text style={styles.buttonSecondaryText}>Lewati</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default KycIntroView;
