import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Linking } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { createStyles } from './styles';
import { Check, CircleAlertIcon, CreditCard, File, Image, X } from 'lucide-react-native';
import { QrisActivationStatus } from '@/features/kyc/api/qris';

interface ActivateQrisViewProps {
  onPressBack: () => void;
  onPressContinueKyc: () => void;
  activationStatus?: QrisActivationStatus;
  rejectionReason?: string;
}

export const ActivateQrisView = ({
  onPressBack,
  onPressContinueKyc,
  activationStatus = 'CAN_ACTIVATE',
  rejectionReason,
}: ActivateQrisViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const isKycIncomplete = activationStatus === 'KYC_INCOMPLETE';
  const isRejected = activationStatus === 'REJECTED';
  const isPendingVerification = activationStatus === 'PENDING';
  const isActivationReady = activationStatus === 'CAN_ACTIVATE' || activationStatus === 'ACTIVE';

  const onPressWhatsapp = async () => {
    const message = encodeURIComponent('Halo Doitpay, saya ingin pengajuan aktivasi QRIS.');
    await Linking.openURL(`https://wa.me/?text=${message}`);
  };

  const onPressEmail = async () => {
    const subject = encodeURIComponent('Pengajuan Aktivasi QRIS');
    const body = encodeURIComponent('Halo tim Doitpay, saya ingin mengajukan aktivasi QRIS.');
    await Linking.openURL(`mailto:support@doitpay.co?subject=${subject}&body=${body}`);
  };

  const handleContinueKyc = () => {
    onPressContinueKyc();
  };

  const onPressBackToReceiveMoney = () => {
    onPressBack();
  };

  const renderInfoItem = ({
    title,
    description,
    icon,
    tone = 'neutral',
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    tone?: 'neutral' | 'success';
  }) => {
    const iconContainerStyle =
      tone === 'success'
        ? [styles.itemIconContainer, styles.itemIconContainerSuccess]
        : [styles.itemIconContainer, styles.itemIconContainerNeutral];

    return (
      <View style={styles.itemRow}>
        <View style={iconContainerStyle}>{icon}</View>
        <View style={styles.itemContent}>
          <Text style={styles.itemTitle}>{title}</Text>
          <Text style={styles.itemDesc}>{description}</Text>
        </View>
      </View>
    );
  };

  const renderStatusBanner = () => {
    if (isKycIncomplete) {
      return (
        <View style={[styles.banner, styles.bannerWarning]}>
          <View style={styles.bannerIconContainer}>
            <CircleAlertIcon
              size={18}
              color="#FFFFFF"
              strokeWidth={2.2}
            />
          </View>
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTitle, styles.bannerWarningTitle]}>
              Selesaikan Verifikasi KYC
            </Text>
            <Text style={[styles.bannerSubtitle, styles.bannerWarningSubtitle]}>
              KYC diperlukan untuk mengajukan NMID. Kamu belum menyelesaikan KYC.
            </Text>
          </View>
        </View>
      );
    }

    if (isPendingVerification) {
      return (
        <View style={[styles.banner, styles.bannerWarning]}>
          <View style={styles.bannerIconContainer}>
            <CircleAlertIcon size={18} color="#FFFFFF" strokeWidth={2.2} />
          </View>
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTitle, styles.bannerWarningTitle]}>Pengajuan Sedang Diproses</Text>
            <Text style={[styles.bannerSubtitle, styles.bannerWarningSubtitle]}>
              Pengajuan aktivasi QRIS kamu sedang diverifikasi. Mohon tunggu notifikasi berikutnya.
            </Text>
          </View>
        </View>
      );
    }

    if (isRejected) {
      return (
        <View style={[styles.banner, styles.bannerDanger]}>
          <View style={[styles.bannerIconContainer, styles.bannerDangerIconContainer]}>
            <X size={18} color="#FFFFFF" strokeWidth={2.6} />
          </View>
          <View style={styles.bannerContent}>
            <Text style={[styles.bannerTitle, styles.bannerDangerTitle]}>Pengajuan Ditolak</Text>
            <Text style={[styles.bannerSubtitle, styles.bannerDangerSubtitle]}>
              Ada informasi yang perlu dilengkapi sebelum NMID dapat diajukan kembali.
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.banner, styles.bannerSuccess]}>
        <View style={[styles.bannerIconContainer, styles.bannerSuccessIconContainer]}>
          <Check size={18} color="#FFFFFF" strokeWidth={3} />
        </View>
        <View style={styles.bannerContent}>
          <Text style={[styles.bannerTitle, styles.bannerSuccessTitle]}>Data Lengkap</Text>
          <Text style={[styles.bannerSubtitle, styles.bannerSuccessSubtitle]}>
            Identitas dan rekening settlement-mu sudah terverifikasi.
          </Text>
        </View>
      </View>
    );
  };

  const renderMiddleSection = () => {
    if (isKycIncomplete) {
      return (
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
      );
    }

    if (isPendingVerification) {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Status Pengajuan</Text>
          <Text style={styles.itemDesc}>
            Dokumen kamu sudah diterima dan sedang ditinjau tim kami. Kamu akan mendapatkan notifikasi setelah proses selesai.
          </Text>
        </View>
      );
    }

    if (isRejected) {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Alasan Penolakan</Text>
          <Text style={styles.itemDesc}>
            {rejectionReason ||
              'Pengajuan QRIS Anda belum dapat disetujui karena masih terdapat informasi yang perlu diperbaiki atau dikonfirmasi. Silakan lanjutkan proses melalui WhatsApp agar tim kami dapat membantu aktivasi.'}
          </Text>
        </View>
      );
    }

    if (isActivationReady) {
      return (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sudah terverifikasi di akunmu</Text>
            {renderInfoItem({
              title: 'KTP & Identitas Pribadi',
              description: 'Sudah diverifikasi melalui KYC',
              tone: 'success',
              icon: <Check size={18} color="#16A34A" strokeWidth={3} />,
            })}
            {renderInfoItem({
              title: 'Rekening Settlement',
              description: 'Rekening bank yang akan menerima dana',
              tone: 'success',
              icon: <Check size={18} color="#16A34A" strokeWidth={3} />,
            })}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Yang Perlu Disiapkan</Text>
            {renderInfoItem({
              title: 'Data Usaha',
              description: 'Nama, kategori, alamat, dan deskripsi barang atau jasa',
              icon: <File size={24} color="#6B7280" strokeWidth={2} />,
            })}
            {renderInfoItem({
              title: 'Foto Bukti Usaha',
              description: 'Foto produk, tempat usaha, menu, atau aktivitas layanan',
              icon: <Image size={24} color="#6B7280" strokeWidth={2} />,
            })}
            {renderInfoItem({
              title: 'NPWP',
              description: 'NPWP pemilik usaha untuk proses verifikasi',
              icon: <CreditCard size={24} color="#6B7280" strokeWidth={2} />,
            })}
          </View>
        </>
      );
    }

    return null;
  };

  const renderActions = () => {
    if (isKycIncomplete) {
      return (
        <>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={handleContinueKyc}
            activeOpacity={0.8}>
            <Text style={styles.buttonPrimaryText}>Lanjutkan Verifikasi KTP</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={onPressBackToReceiveMoney}
            activeOpacity={0.8}>
            <Text style={styles.buttonSecondaryText}>Kembali ke Terima Uang</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (isPendingVerification) {
      return (
        <TouchableOpacity
          style={styles.buttonSecondary}
          onPress={onPressBackToReceiveMoney}
          activeOpacity={0.8}>
          <Text style={styles.buttonSecondaryText}>Kembali ke Terima Uang</Text>
        </TouchableOpacity>
      );
    }

    if (isRejected) {
      return (
        <>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={onPressWhatsapp}
            activeOpacity={0.8}>
            <Text style={styles.buttonPrimaryText}>Ajukan Ulang VIA Whatsapp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={onPressEmail}
            activeOpacity={0.8}>
            <Text style={styles.buttonSecondaryText}>Ajukan Ulang VIA Email</Text>
          </TouchableOpacity>
        </>
      );
    }

    if (isActivationReady) {
      return (
        <>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={onPressWhatsapp}
            activeOpacity={0.8}>
            <Text style={styles.buttonPrimaryText}>Ajukan VIA Whatsapp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={onPressEmail} activeOpacity={0.8}>
            <Text style={styles.buttonSecondaryText}>Ajukan VIA Email</Text>
          </TouchableOpacity>
        </>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Aktifkan QRIS"
        titlePosition="left"
        titleStyle="medium"
        onPressBack={onPressBack}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {renderStatusBanner()}

        <Text style={styles.title}>QRIS Terima Pembayaran</Text>
        <Text style={styles.subtitle}>
          QRIS dibuat atas namamu sendiri, ajukan NMID ke Doitpay terlebih dahulu.
        </Text>

        {renderMiddleSection()}
      </ScrollView>

      <View style={styles.footer}>{renderActions()}</View>
    </View>
  );
};

export default ActivateQrisView;
