import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Inbox, Scan, Send, CheckCircle2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';

interface TransferProcessingViewProps {
  accountData?: {
    accountNumber: string;
    bankName: string;
    name: string;
  };
  bankData?: any;
  amount?: string;
  paymentMethod?: 'VA' | 'QRIS';
  currentStep?: 'received' | 'verifying' | 'sending' | 'done';
  onPressBack: () => void;
  onFinish?: () => void;
}

const stepLabels = [
  { key: 'received', label: 'Diterima', Icon: Inbox },
  { key: 'verifying', label: 'Verifikasi', Icon: Scan },
  { key: 'sending', label: 'Mengirim', Icon: Send },
  { key: 'done', label: 'Selesai', Icon: CheckCircle2 },
] as const;

const statusTextMap = {
  received: 'Transfer diterima',
  verifying: 'Memverifikasi transfer',
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
  console.log('currentStep:', currentStep);
  console.log('statusTextMap[currentStep]:', statusTextMap[currentStep]);
  const bankName = bankData?.name;
  const ownerName = accountData?.name || 'Prabu Suwito';
  const formattedAmount = amount;

  const currentStepIndex = Math.max(
    0,
    stepLabels.findIndex((s) => s.key === currentStep),
  );
  const ActiveIcon = stepLabels[currentStepIndex]?.Icon || Inbox;

  return (
    <View style={styles.container}>
      <HeaderToolbar title="" titlePosition="left" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfo}>
          <View style={styles.bankRow}>
            <View style={styles.bankLogoPlaceholder}>
              <Text style={styles.bankInitial}>BCA</Text>
            </View>
            <Text style={styles.bankNameText}>{bankName}</Text>
          </View>

          <Text style={styles.sendToText}>
            Mengirim ke <Text style={styles.sendToName}>{ownerName}</Text>
          </Text>
          <Text style={styles.amountText}>Rp {formattedAmount}</Text>
        </View>

        <View style={styles.iconVisualContainer}>
          <View style={styles.iconCircle}>
            <ActiveIcon size={32} color="#FFF" />
          </View>
        </View>

        <View style={styles.stepperWrapper}>
          <View style={styles.stepperRow}>
            {stepLabels.map((step, index) => (
              <View key={step.key} style={styles.stepColumn}>
                <View
                  style={[
                    styles.progressSegment,
                    index <= currentStepIndex ? styles.segmentActive : styles.segmentInactive,
                  ]}
                />
                <Text
                  style={[
                    styles.stepLabel,
                    index === currentStepIndex ? styles.labelActive : styles.labelInactive,
                  ]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statusBadgeContainer}>
          <View style={styles.statusBadge}>
            <View style={styles.blueDot} />
            <Text style={styles.statusBadgeText}>{statusTextMap[currentStep]}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TransferProcessingView;
