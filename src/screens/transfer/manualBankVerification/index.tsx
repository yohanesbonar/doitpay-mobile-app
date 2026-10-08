import React, { useEffect, useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import { transferApi, GetTransferDetailResponse } from '@/api/transfer';
import { formatApiDateToLocal, formatNumber } from '@/utils/Common';
import type { ManualBankTransferData } from '@/api/transfer';

type VerificationStatus = 'VERIFYING' | 'SUCCESS' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

interface RouteParams {
  transferData: Pick<ManualBankTransferData, 'id'> & Partial<Omit<ManualBankTransferData, 'id'>>;
  accountData?: {
    accountNumber?: string;
    bankName?: string;
    ownerName?: string;
    accountHolderName?: string;
  };
  bankData?: {
    name?: string;
    shortName?: string;
    logoUrl?: string;
    logo?: number | string;
  };
}

const SUCCESS_TRANSFER_STATUSES = ['SUCCESS_TRANSFER', 'COMPLETED'];
const TERMINAL_STATUSES = [
  ...SUCCESS_TRANSFER_STATUSES,
  'SUCCESS',
  'VERIFIED',
  'APPROVED',
  'PAID',
  'REJECTED',
  'EXPIRED',
  'CANCELLED',
];

const getTransferStatus = (transfer?: {
  status?: string;
  manualBank?: { status?: string } | null;
}) => {
  const statuses = [transfer?.status, transfer?.manualBank?.status];
  const successfulStatus = statuses.find((status) =>
    SUCCESS_TRANSFER_STATUSES.includes(status?.toUpperCase() ?? ''),
  );

  return successfulStatus ?? transfer?.manualBank?.status ?? transfer?.status;
};

const getVerificationStatus = (status?: string): VerificationStatus => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
    case 'SUCCESS_TRANSFER':
    case 'COMPLETED':
    case 'VERIFIED':
    case 'APPROVED':
    case 'PAID':
      return 'SUCCESS';
    case 'REJECTED':
      return 'REJECTED';
    case 'EXPIRED':
      return 'EXPIRED';
    case 'CANCELLED':
      return 'CANCELLED';
    default:
      return 'VERIFYING';
  }
};

const ManualBankVerificationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { transferData, accountData, bankData } = (route.params || {}) as RouteParams;
  const transferId = transferData?.id;
  const hasNavigatedToReceipt = useRef(false);

  const { data } = useQuery<GetTransferDetailResponse>({
    queryKey: ['manualBankTransferStatus', transferId],
    queryFn: () => transferApi.getTransferDetailById({ id: transferId! }),
    enabled: Boolean(transferId) && isFocused,
    retry: false,
    refetchInterval: (query) => {
      if (!isFocused) return false;

      const detail = query.state.data?.data;
      const statuses = [detail?.status, detail?.manualBank?.status].map((status) =>
        status?.toUpperCase(),
      );
      return statuses.some((status) => TERMINAL_STATUSES.includes(status ?? '')) ? false : 5000;
    },
    refetchIntervalInBackground: false,
    staleTime: 0,
  });

  const apiStatus = getTransferStatus(data?.data) ?? getTransferStatus(transferData);
  const status = getVerificationStatus(apiStatus || 'VERIFYING');
  const recipientName =
    accountData?.ownerName || accountData?.accountHolderName || 'Penerima Transfer';
  const recipientBank = bankData?.shortName || bankData?.name || accountData?.bankName || 'Bank';
  const accountNumber = accountData?.accountNumber;
  const maskedAccountNumber = accountNumber ? `*******${accountNumber.slice(-3)}` : '*******';

  const openHistory = () => navigation.navigate('MainTabs', { screen: t('mainTabNav.history') });
  const startNewTransfer = () =>
    navigation.navigate('BankList', { returnHomeOnBack: true, fromTabBar: false });

  useEffect(() => {
    if (status !== 'SUCCESS' || hasNavigatedToReceipt.current) return;
    hasNavigatedToReceipt.current = true;

    const now = new Date();
    const receiptTransfer = data?.data ?? transferData;
    const manualBank = receiptTransfer?.manualBank;
    const bankName = manualBank?.bankName || bankData?.shortName || bankData?.name || 'Bank';
    const paymentMethod = `Transfer Bank - ${bankName}`;
    const recipientName =
      manualBank?.accountName || accountData?.ownerName || accountData?.accountHolderName || '-';
    const recipientAccountNumber = manualBank?.accountNumber || accountData?.accountNumber || '';
    const recipientBankName =
      manualBank?.bankName || accountData?.bankName || bankData?.name || bankName;
    const createdAt = receiptTransfer?.createdAt || now.toISOString();

    navigation.replace('PaymentReceipt', {
      accountData: {
        ...accountData,
        accountNumber: recipientAccountNumber,
        bankName: recipientBankName,
        name: recipientName,
        accountHolderName: recipientName,
      },
      bankData,
      paymentMethod,
      amount: String(receiptTransfer?.amount ?? 0),
      transactionId: receiptTransfer?.id || transferId,
      dateTime: formatApiDateToLocal(createdAt),
      method: 'manualBank',
      manualBankReceiptData: {
        id: receiptTransfer?.id || transferId,
        amount: receiptTransfer?.amount ?? 0,
        createdAt,
        paymentMethod,
        paymentMethodName: paymentMethod,
        paymentMethodLogoUrl: manualBank?.logoUrl || bankData?.logoUrl,
        beneficiaryName: recipientName,
        beneficiaryBankName: recipientBankName,
        beneficiaryBankLogo: manualBank?.logoUrl || bankData?.logoUrl,
        beneficiaryAccountNumber: recipientAccountNumber,
        uniqueCode: manualBank?.uniqueCode,
        totalAmount: manualBank?.totalAmount ?? receiptTransfer?.amount ?? 0,
      },
    });
  }, [status, navigation, accountData, bankData, data, transferData, transferId]);

  const isVerifying = status === 'VERIFYING';
  const title =
    status === 'REJECTED'
      ? 'Bukti Transfer Ditolak'
      : status === 'EXPIRED'
        ? 'Waktu Pembayaran sudah Habis'
        : status === 'CANCELLED'
          ? 'Transaksi Dibatalkan'
          : 'Bukti Transfer kamu sedang kami periksa';
  const description =
    status === 'REJECTED'
      ? 'Bukti transfer tidak sesuai dengan data transaksi atau nominal tidak cocok. Jika ada kendala, kamu dapat mengajukan permintaan untuk ditinjau kembali.'
      : status === 'EXPIRED'
        ? 'Batas waktu untuk pembayaran telah berakhir. Transaksi ini dibatalkan secara otomatis.'
        : status === 'CANCELLED'
          ? 'Kami telah membatalkan transaksi ini. Tidak ada pembayaran yang diproses.'
          : 'Tim Finance kami sedang memeriksa bukti transfer dan memverifikasi bukti transfer kamu secara manual. Kami akan menginformasikan melalui notifikasi.';

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <View style={styles.container}>
        <HeaderToolbar
          title="Verifikasi Transfer"
          onPressBack={() => navigation.goBack()}
          titlePosition="left"
          titleStyle="medium"
        />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <StatusIllustration status={status} />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.transferCard}>
            <View style={styles.amountSection}>
              <Text style={styles.sectionLabel}>Nominal Transfer</Text>
              <View style={styles.amountRow}>
                <Text style={styles.currency}>Rp</Text>
                <Text style={styles.amount}>{formatNumber(transferData?.amount ?? 0)}</Text>
              </View>
            </View>
            <View style={styles.recipientSection}>
              <View style={styles.bankLogoWrap}>
                {getBankLogo(bankData, recipientBank) ? (
                  <Image
                    source={getBankLogo(bankData, recipientBank)!}
                    style={styles.bankLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.bankLogoText}>{recipientBank.slice(0, 3).toUpperCase()}</Text>
                )}
              </View>
              <View style={styles.recipientDetails}>
                <Text style={styles.recipientName} numberOfLines={1}>
                  {recipientName}
                </Text>
                <Text style={styles.recipientBank} numberOfLines={1}>
                  {recipientBank}　{maskedAccountNumber}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          {isVerifying ? (
            <Button
              title="Cek Semua Transaksi kamu"
              onPress={openHistory}
              type="regular"
              color="#3478F6"
              textColor="white"
              style={styles.primaryButton}
            />
          ) : (
            <>
              <Button
                title="Buat Transfer Baru"
                onPress={startNewTransfer}
                type="regular"
                color="#3478F6"
                textColor="white"
                style={styles.primaryButton}
              />
              <Button
                title="Daftar Transaksi"
                onPress={openHistory}
                type="regular"
                color="#FFFFFF"
                textColor="black"
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const getBankLogo = (
  bankData: RouteParams['bankData'],
  bankName: string,
): number | { uri: string } | null => {
  const remoteLogo = bankData?.logoUrl;
  if (remoteLogo) return { uri: remoteLogo };
  const logo = bankData?.logo;
  if (typeof logo === 'number') return logo;
  if (typeof logo === 'string' && logo) return { uri: logo };
  if (/bca|central asia/i.test(bankName)) return require('../../../assets/images/ic-BCA.png');
  if (/cimb/i.test(bankName)) return require('../../../assets/images/ic-CIMB.png');
  return null;
};

const StatusIllustration = ({ status }: { status: VerificationStatus }) => {
  if (status !== 'VERIFYING') {
    const source =
      status === 'REJECTED'
        ? require('../../../assets/images/ic-verif-timeout.png')
        : status === 'EXPIRED'
          ? require('../../../assets/images/ic-verif-rejected.png')
          : require('../../../assets/images/ic-verif-canceled.png');

    return (
      <View style={styles.simpleIllustration}>
        <Image source={source} style={styles.statusIllustrationImage} resizeMode="contain" />
      </View>
    );
  }

  return (
    <View style={styles.verifyingIllustration}>
      <Image
        source={require('../../../assets/images/ic-verif-transfer.png')}
        style={styles.verificationImage}
        resizeMode="contain"
        accessibilityLabel="Ilustrasi verifikasi transfer"
      />
    </View>
  );
};

export default ManualBankVerificationScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 20, paddingBottom: 20, flexGrow: 1 },
  verifyingIllustration: {
    height: 260,
    marginTop: 16,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationImage: { width: '100%', height: 236 },
  simpleIllustration: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  statusIllustrationImage: { width: 240, height: 199 },
  title: {
    color: '#080808',
    fontFamily: 'Switzer-Bold',
    fontSize: 24,
    lineHeight: 31,
    textAlign: 'center',
    marginTop: 4,
  },
  description: {
    color: '#161B24',
    fontFamily: 'Switzer-Regular',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  transferCard: { borderWidth: 1, borderColor: '#D5D5D5', borderRadius: 12, overflow: 'hidden' },
  amountSection: { paddingHorizontal: 16, paddingVertical: 16 },
  sectionLabel: { color: '#111111', fontFamily: 'Switzer-Regular', fontSize: 15 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 3 },
  currency: { color: '#737373', fontFamily: 'Switzer-Regular', fontSize: 19, marginRight: 8 },
  amount: { color: '#080808', fontFamily: 'Switzer-Bold', fontSize: 29 },
  recipientSection: {
    minHeight: 88,
    borderTopWidth: 1,
    borderTopColor: '#D5D5D5',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLogoWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    padding: 8,
  },
  bankLogo: { width: '100%', height: '100%' },
  bankLogoText: { color: '#3478F6', fontFamily: 'Switzer-Bold', fontSize: 14 },
  recipientDetails: { flex: 1 },
  recipientName: { color: '#111111', fontFamily: 'Switzer-Medium', fontSize: 18 },
  recipientBank: { color: '#111111', fontFamily: 'Switzer-Regular', fontSize: 15, marginTop: 3 },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 0, gap: 10 },
  primaryButton: { minHeight: 56, borderRadius: 32 },
  secondaryButton: {
    minHeight: 54,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#D5D5D5',
  },
  secondaryButtonText: { fontFamily: 'Switzer-Medium' },
});
