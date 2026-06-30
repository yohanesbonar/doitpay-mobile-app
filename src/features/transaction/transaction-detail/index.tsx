import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Linking,
  PermissionsAndroid,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Clock, XCircle, FlagIcon, Share2 } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { styles, receiptStyles } from './styles';
import { formatNumber } from '@/utils/Common';
import ViewShot from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import Share from 'react-native-share';
import { TransactionStatus, TransactionType } from '@/features/transaction/types';
import { useTransactionReceiptQuery } from '@/features/transaction/hooks/useTransactionReceiptQuery';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; Icon: React.ComponentType<any> }
> = {
  [TransactionStatus.SUCCESS_TRANSFER]: {
    label: 'Transfer Berhasil',
    color: '#3B82F6',
    Icon: CheckCircle2,
  },
  [TransactionStatus.SUCCESS_RECEIVE]: {
    label: 'Dana Berhasil Diterima',
    color: '#16A34A',
    Icon: CheckCircle2,
  },
  [TransactionStatus.PENDING]: {
    label: 'Transaksi Diproses',
    color: '#D97706',
    Icon: Clock,
  },
  [TransactionStatus.CANCELED]: {
    label: 'Transaksi Dibatalkan',
    color: '#6B7280',
    Icon: XCircle,
  },
  [TransactionStatus.FAILED]: {
    label: 'Transaksi Gagal',
    color: '#EF4444',
    Icon: XCircle,
  },
};

const deriveStatus = (type: string, status?: string): string => {
  if (status && STATUS_CONFIG[status]) return status;
  if (type === TransactionType.RECEIVE_IN) return TransactionStatus.SUCCESS_RECEIVE;
  return TransactionStatus.SUCCESS_TRANSFER;
};

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year}, ${hours}:${minutes} WIB`;
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const formatDateTimeReceipt = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${day} ${month} ${year}  ${hours}:${minutes}:${seconds}`;
};

export interface TransactionDetailProps {
  transactionId: string;
  referenceId: string;
  type: string;
  status?: string;
  onPressBack: () => void;
  onContinuePayment?: () => void;
  isLoadingContinue?: boolean;
}

export const TransactionDetail = ({
  transactionId,
  referenceId,
  type,
  status,
  onPressBack,
  onContinuePayment,
  isLoadingContinue,
}: TransactionDetailProps) => {
  const viewShotRef = useRef<any>(null);

  const { data: receiptResponse, isLoading } = useTransactionReceiptQuery(referenceId, type);
  const receipt = receiptResponse?.data;

  const { data: profileResponse } = useGetProfileMeQuery();
  const profile = profileResponse?.data;

  const resolvedStatus = deriveStatus(type, status);
  const {
    label: statusLabel,
    color: statusColor,
    Icon: StatusIcon,
  } = STATUS_CONFIG[resolvedStatus] ?? STATUS_CONFIG[TransactionStatus.SUCCESS_TRANSFER];

  const isReceiveIn = type === TransactionType.RECEIVE_IN;

  const senderName = isReceiveIn
    ? (receipt?.senderName ?? receipt?.beneficiaryName ?? '-')
    : (receipt?.senderName ?? profile?.fullName ?? '-');
  const senderBank = isReceiveIn
    ? (receipt?.senderBankName ?? receipt?.paymentMethod ?? '-')
    : (receipt?.senderBankName ?? 'DoitPay');
  const senderLogoUri = isReceiveIn
    ? (receipt?.senderBankLogoUrl ?? receipt?.paymentMethodLogoUrl)
    : receipt?.senderBankLogoUrl;

  const recipientName = isReceiveIn
    ? (profile?.fullName ?? '-')
    : (receipt?.beneficiaryName ?? '-');
  const recipientBank = isReceiveIn ? 'DoitPay' : (receipt?.paymentMethod ?? '-');
  const recipientLogoUri = isReceiveIn ? undefined : receipt?.paymentMethodLogoUrl;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const doitpayLogo = require('../../../assets/images/ic-doitpay-white.png');

  const normalizeUri = (uri: string) => (uri.startsWith('file://') ? uri : `file://${uri}`);

  const handleShare = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      await Share.open({
        url: normalizeUri(uri),
        title: 'Bagikan Bukti',
        message: `Bukti Transaksi sebesar Rp ${formatNumber((receipt?.amount ?? 0).toString())}`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const renderReceiptContent = () => (
    <>
      <View style={[styles.statusCard, { backgroundColor: statusColor }]}>
        <View style={styles.statusIcon}>
          <StatusIcon size={65} color="#FFFFFF" />
        </View>
        <Text style={styles.statusTitle}>{statusLabel}</Text>
        <Text style={styles.statusAmount}>
          Rp {formatNumber((receipt?.amount ?? 0).toString())}
        </Text>
        <View style={styles.curveCutout} />
      </View>

      <View style={styles.recipientBox}>
        <View style={styles.recipientLeft}>
          <View style={styles.bankLogoWrapper}>
            <Image
              source={{ uri: receipt?.paymentMethodLogoUrl }}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.recipientInfo}>
            <Text style={styles.recipientName} numberOfLines={1}>
              {receipt?.beneficiaryName ?? '-'}
            </Text>
            <Text style={styles.recipientMethod}>
              {receipt?.paymentMethod ? receipt.paymentMethod : '-'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.sectionTitle}>Detail Transaksi</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>ID Transaksi</Text>
          <Text style={styles.detailValue}>{transactionId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Tanggal & Waktu</Text>
          <Text style={styles.detailValue}>
            {receipt?.createdAt ? formatDateTime(receipt.createdAt) : '-'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Metode Pembayaran</Text>
          <Text style={styles.detailValue}>
            {receipt?.paymentMethod ? receipt.paymentMethod : '-'}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Jumlah</Text>
          <Text style={styles.detailValue}>
            Rp {formatNumber((receipt?.amount ?? 0).toString())}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Biaya Admin</Text>
          <Text style={styles.detailValue}>Rp {formatNumber((receipt?.fee ?? 0).toString())}</Text>
        </View>
        <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
          <Text style={styles.detailLabel}>Total</Text>
          <Text style={styles.detailValue}>
            Rp {formatNumber((receipt?.totalAmount ?? 0).toString())}
          </Text>
        </View>
      </View>
    </>
  );

  const renderReceiptForCapture = () => (
    <View style={receiptStyles.container}>
      <View style={[receiptStyles.header, { backgroundColor: statusColor }]}>
        <Image source={doitpayLogo} style={receiptStyles.logo} resizeMode="contain" />
        <Text style={receiptStyles.statusText}>{statusLabel}</Text>
      </View>

      <View style={receiptStyles.nominalCard}>
        <Text style={receiptStyles.nominalLabel}>Nominal</Text>
        <View style={receiptStyles.nominalRow}>
          <Text style={receiptStyles.nominalCurrency}>Rp</Text>
          <Text style={receiptStyles.nominalAmount}>
            {formatNumber((receipt?.amount ?? 0).toString())}
          </Text>
        </View>
      </View>

      {!isReceiveIn && (
        <View style={receiptStyles.partySection}>
          <View style={receiptStyles.partyRow}>
            <View style={receiptStyles.partyLogo}>
              {senderLogoUri ? (
                <Image
                  source={{ uri: senderLogoUri }}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={doitpayLogo}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              )}
            </View>
            <View style={receiptStyles.partyInfo}>
              <Text style={receiptStyles.partyName} numberOfLines={1}>
                {senderName}
              </Text>
              <Text style={receiptStyles.partyBank}>{senderBank}</Text>
            </View>
          </View>

          <View style={receiptStyles.dashedConnector} />

          <View style={receiptStyles.partyRow}>
            <View style={receiptStyles.partyLogo}>
              {recipientLogoUri ? (
                <Image
                  source={{ uri: recipientLogoUri }}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={doitpayLogo}
                  style={{ width: 30, height: 30 }}
                  resizeMode="contain"
                />
              )}
            </View>
            <View style={receiptStyles.partyInfo}>
              <Text style={receiptStyles.partyName} numberOfLines={1}>
                {recipientName}
              </Text>
              <Text style={receiptStyles.partyBank}>{recipientBank}</Text>
            </View>
          </View>
        </View>
      )}

      <View style={receiptStyles.detailSection}>
        <Text style={receiptStyles.receiptSectionTitle}>Detail Transaksi</Text>

        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>ID Transaksi</Text>
          <Text style={receiptStyles.receiptDetailValue}>{transactionId}</Text>
        </View>
        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>Tanggal & Waktu</Text>
          <Text style={receiptStyles.receiptDetailValue}>
            {receipt?.createdAt ? formatDateTimeReceipt(receipt.createdAt) : '-'}
          </Text>
        </View>
        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>Metode Pembayaran</Text>
          <Text style={receiptStyles.receiptDetailValue}>{receipt?.paymentMethod ?? '-'}</Text>
        </View>
        <View style={receiptStyles.receiptDetailRow}>
          <Text style={receiptStyles.receiptDetailLabel}>Jumlah</Text>
          <Text style={receiptStyles.receiptDetailValue}>
            Rp {formatNumber((receipt?.amount ?? 0).toString())}
          </Text>
        </View>
        {receipt?.fee != null && (
          <View style={receiptStyles.receiptDetailRow}>
            <Text style={receiptStyles.receiptDetailLabel}>Biaya Admin</Text>
            <Text style={receiptStyles.receiptDetailValue}>
              Rp {formatNumber(receipt.fee.toString())}
            </Text>
          </View>
        )}
        {receipt?.totalAmount != null && (
          <View style={receiptStyles.receiptDetailRow}>
            <Text style={receiptStyles.receiptDetailLabel}>Total</Text>
            <Text style={receiptStyles.receiptDetailValue}>
              Rp {formatNumber(receipt.totalAmount.toString())}
            </Text>
          </View>
        )}
      </View>

      <View style={receiptStyles.footer}>
        <Text style={receiptStyles.footerText}>PT Indoraya Sehati Remmitance</Text>
        <Text style={receiptStyles.footerText}>©{new Date().getFullYear()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <HeaderToolbar title="Detail Transaksi" onPressBack={onPressBack} titlePosition="left" />

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <>
            <ViewShot
              ref={viewShotRef}
              options={{ format: 'png', quality: 1.0 }}
              style={{
                position: 'absolute',
                top: -9999,
                left: 0,
                width: SCREEN_WIDTH,
                backgroundColor: '#FFFFFF',
              }}>
              {renderReceiptForCapture()}
            </ViewShot>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              {renderReceiptContent()}
            </ScrollView>
          </>
        )}

        <View style={styles.footerContainer}>
          {status === 'PENDING' ? (
            <TouchableOpacity
              style={[styles.continuePaymentButton, isLoadingContinue && { opacity: 0.6 }]}
              onPress={onContinuePayment}
              disabled={isLoadingContinue}>
              {isLoadingContinue ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.continuePaymentButtonText}>Lanjutkan Pembayaran</Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton}>
                <FlagIcon size={16} color="#111827" style={{ marginRight: 8 }} />
                <Text style={[styles.actionText, { marginBottom: 2 }]}>Laporkan Masalah</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share2 size={18} color="#111827" style={{ marginRight: 8 }} />
                <Text style={styles.actionText}>Bagikan</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={onPressBack}>
            <Text style={styles.backButtonText}>Kembali ke Daftar Transaksi</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
