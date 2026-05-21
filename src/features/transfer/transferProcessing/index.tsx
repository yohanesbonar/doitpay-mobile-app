import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Inbox, Scan, Send, CheckCircle2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles } from './styles';

const stepsOrder = ['received', 'verifying', 'sending', 'done'] as const;

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
  // currentStep = 'received', temporary comment
  onPressBack,
  onFinish,
}: TransferProcessingViewProps) => {
  console.log('currentStep:', currentStep);
  console.log('statusTextMap[currentStep]:', statusTextMap[currentStep]);

  // state local for temporary waiting for api ready
  const [currentStep, setCurrentStep] = useState<'received' | 'verifying' | 'sending' | 'done'>(
    'received',
  );

  const bankName = bankData?.name || 'Bank Central Asia';
  const ownerName = accountData?.name || 'Prabu Suwito';
  const formattedAmount = amount;

  const currentStepIndex = Math.max(
    0,
    stepLabels.findIndex((s) => s.key === currentStep),
  );
  const ActiveIcon = stepLabels[currentStepIndex]?.Icon || Inbox;

  // temporary comment waiting for api ready
  // useEffect(() => {
  //   if (currentStep === 'done' && onFinish) {
  //     const timer = setTimeout(() => {
  //       onFinish();
  //     }, 1500);
  //     return () => clearTimeout(timer);
  //   }
  // }, [currentStep, onFinish]);

  useEffect(() => {
    // if (currentStepIndex < stepsOrder.length - 1) {
    //   const stepTimer = setTimeout(() => {
    //     setCurrentStep(stepsOrder[currentStepIndex + 1]);
    //   }, 2000);
    //   return () => clearTimeout(stepTimer);
    // }
    // if (currentStep === 'done' && onFinish) {
    //   const finishTimer = setTimeout(() => {
    //     onFinish();
    //   }, 1500);
    //   return () => clearTimeout(finishTimer);
    // }
  }, [currentStep, currentStepIndex, onFinish]);

  return (
    <View style={styles.container}>
      <HeaderToolbar title="" titlePosition="left" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topInfo}>
          <View style={styles.bankRow}>
            <Image source={require('../../../assets/images/ic-BCA.png')} style={styles.bankLogo} />
            <Text style={styles.bankNameText}>{bankName}</Text>
          </View>

          <Text style={styles.sendToText}>
            Mengirim ke <Text style={styles.sendToName}>{ownerName}</Text>
          </Text>
          <Text style={styles.amountText}>Rp {formattedAmount}</Text>
        </View>

        <View style={styles.iconVisualContainer}>
          <View style={styles.iconCircle}>
            <ActiveIcon size={32} color="#3B82F6" />
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
                  index === currentStepIndex ? styles.labelActive : styles.labelInactive,
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
