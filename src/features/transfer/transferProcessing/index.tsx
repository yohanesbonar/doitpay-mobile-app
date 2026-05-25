import React, { useEffect } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
// Menggunakan MailOpen (Diterima), Send (Mengirim), dan Check (Selesai) sesuai UI Figma kamu
import { MailOpen, Send, Check } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';
import { formatNumber } from '@/utils/Common';

// 1. Ubah definisi step order menjadi 3 tahap
export type TransferStep = 'received' | 'sending' | 'done';

interface TransferProcessingViewProps {
  accountData?: {
    accountNumber: string;
    bankName: string;
    name: string;
  };
  bankData?: any;
  amount?: string;
  paymentMethod?: 'VA' | 'QRIS';
  currentStep?: TransferStep;
  onPressBack: () => void;
  onFinish?: () => void;
}

// 2. Sesuaikan konfigurasi step menjadi 3 item
const stepLabels = [
  { key: 'received', label: 'Diterima', Icon: MailOpen },
  { key: 'sending', label: 'Mengirim', Icon: Send },
  { key: 'done', label: 'Selesai', Icon: Check },
] as const;

const statusTextMap = {
  received: 'Transfer diterima',
  sending: 'Mengirim Dana',
  done: 'Transfer Berhasil',
};

const TransferProcessingView = ({
  accountData,
  bankData,
  amount,
  paymentMethod,
  currentStep = 'received', 
  onPressBack,
  onFinish,
}: TransferProcessingViewProps) => {
  console.log('TransferProcessingView - Props:', {
    accountData,
    bankData,
    amount,
    paymentMethod,
    currentStep,
  });
  const bankName = bankData?.name || '-';
  const logoUrl = bankData?.logoUrl || accountData?.bankLogo || null;
  const ownerName = accountData?.accountHolderName || accountData?.accountName || '-';
  const formattedAmount = formatNumber(amount || '0');

  const currentStepIndex = Math.max(
    0,
    stepLabels.findIndex((s) => s.key === currentStep),
  );
  
  const ActiveIcon = stepLabels[currentStepIndex]?.Icon || MailOpen;

  return (
    <View style={styles.container}>
      <HeaderToolbar title="" titlePosition="left" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfo}>
          <View style={styles.bankRow}>
            <Image source={{ uri: logoUrl }} style={styles.bankLogo} />
            <Text style={styles.bankNameText}>{bankName}</Text>
          </View>

          <Text style={styles.sendToText}>
            Mengirim ke <Text style={styles.sendToName}>{ownerName}</Text>
          </Text>
          <Text style={styles.amountText}>Rp {formattedAmount}</Text>
        </View>

        <View style={styles.iconVisualContainer}>
          <View style={styles.iconCircle}>
            <ActiveIcon size={32} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.stepperWrapper}>
          <View style={styles.progressLineContainer}>
            {stepLabels.map((step, index) => (
              <View
                key={`line-${step.key}`}
                style={[
                  styles.progressSegment,
                  index <= currentStepIndex ? styles.segmentActive : styles.segmentInactive,
                ]}
              />
            ))}
          </View>

          <View style={styles.labelContainer}>
            {stepLabels.map((step, index) => (
              <Text
                key={`label-${step.key}`}
                style={[
                  styles.stepLabel,
                  index <= currentStepIndex ? styles.labelActive : styles.labelInactive,
                ]}>
                {step.label}
              </Text>
            ))}
          </View>

          <View style={styles.statusBadgeContainer}>
            <View style={styles.statusBadge}>
              <View style={styles.blueDot} />
              <Text style={styles.statusBadgeText}>{statusTextMap[currentStep]}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TransferProcessingView;