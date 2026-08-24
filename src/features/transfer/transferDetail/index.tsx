import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { styles } from './styles';
import PaymentMethod from './components/PaymentMethod';
import QuickAmount from './components/QuickAmount';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { formatNumber } from '@/utils/Common';
import {
  useReceive,
  useTransfer,
  useTransactionPurposes,
} from '../../../hooks/useTransferMutation';
import _ from 'lodash';
import Button from '../../../components/atoms/Button/index.tsx';
import Toast from 'react-native-toast-message';
import { paymentApi, PaymentCalculatePayload } from './api/payment-calculate-api';
import { Info, TriangleAlert, ChevronDown, Check } from 'lucide-react-native';
import { usePaymentMethodAvailability } from '../hooks/usePaymentMethodAvailability';
import { useQuickAmounts } from '../hooks/useQuickAmounts';
import { getAmountRange, trackPostHogEvent } from '@/analytics/posthog';

interface TransferDetailViewProps {
  accountData: {
    id: string;
    accountNumber: string;
    bankName: string;
    ownerName: string;
    accountHolderName: string;
  };
  bankData: any;
  fromTabBar: boolean;
  isLoginState: boolean;
  beneficiaryId?: string;
  method: 'send' | 'receive';
  onPressBack: () => void;
  gotoPaymentInstruction: (
    paymentMethod: 'VA' | 'QRIS',
    amount: string,
    transferData: any,
    bankPayment: any,
  ) => void;
  initialAmount?: string;
  initialPaymentMethod?: 'VA' | 'QRIS';
  initialBankPayment?: any;
}

const TransferDetailView = (props: TransferDetailViewProps) => {
  const navigation = useNavigation<any>();
  const [isFocusedInput, setIsFocusedInput] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const handleFocusInput = () => {
    inputRef.current?.focus();
  };

  const {
    onPressBack,
    bankData,
    fromTabBar,
    isLoginState,
    method,
    gotoPaymentInstruction,
    accountData,
    initialAmount,
    initialPaymentMethod,
    initialBankPayment,
  } = props;
  const { accountNumber, bankName, accountHolderName } = accountData || {};

  const [amount, setAmount] = useState(initialAmount || '');
  const [selectedPurpose, setSelectedPurpose] = useState<{ code: string; name: string } | null>(
    null,
  );
  const [isPurposeModalVisible, setIsPurposeModalVisible] = useState(false);
  const [methodPayment, setMethodPayment] = useState<'VA' | 'QRIS'>(initialPaymentMethod || 'VA');
  const [bankPayment, setBankPayment] = useState(initialBankPayment || null);
  const [isDisableConfirm, setIsDisableConfirm] = useState(true);

  const [calculateData, setCalculateData] = useState<any>(null);
  const [isLoadingCalculate, setIsLoadingCalculate] = useState(false);
  const paymentMethodAvailability = usePaymentMethodAvailability('TRANSFER');
  const quickAmounts = useQuickAmounts('TRANSFER');

  const { mutate: postTransfer, isPending: isLoadingTransfer } = useTransfer();
  const {
    data: purposesData,
    isLoading: isLoadingPurposes,
    isError: isPurposesError,
    error: purposesError,
    isFetching: isFetchingPurposes,
    refetch: refetchPurposes,
  } = useTransactionPurposes();
  const purposes = purposesData?.data?.items ?? [];

  useEffect(() => {
    if (isPurposesError) {
      console.log('useTransactionPurposes error', purposesError);
    }
  }, [isPurposesError, purposesError]);

  const hasTrackedValidAmountRef = useRef(false);
  const hasTrackedReviewViewRef = useRef(false);

  useEffect(() => {
    console.log('bankPayment ->>>', bankPayment);
  }, [bankPayment]);

  useEffect(() => {
    if (hasTrackedReviewViewRef.current) return;

    trackPostHogEvent('transfer_review_viewed', {
      amount_range: getAmountRange(amount),
      destination_bank: bankData?.shortName || bankData?.name || 'unknown',
      source_bank: bankPayment?.code || bankData?.shortName || 'unknown',
      pay_method: methodPayment,
    });

    hasTrackedReviewViewRef.current = true;
  }, [amount, bankData?.name, bankData?.shortName, bankPayment?.code, methodPayment]);

  useEffect(() => {
    const numericAmount = amount ? parseInt(amount, 10) : 0;

    if (numericAmount >= 10000 && !hasTrackedValidAmountRef.current) {
      trackPostHogEvent('transfer_amount_entered', {
        amount_range: getAmountRange(numericAmount),
        destination_bank: bankData?.shortName || bankData?.name || 'unknown',
        pay_method: methodPayment,
      });

      hasTrackedValidAmountRef.current = true;
    }
  }, [amount, bankData?.name, bankData?.shortName, methodPayment]);

  useEffect(() => {
    const { vaEnabled, qrisEnabled, defaultMethod } = paymentMethodAvailability;

    if ((methodPayment === 'VA' && !vaEnabled) || (methodPayment === 'QRIS' && !qrisEnabled)) {
      if (defaultMethod) {
        setMethodPayment(defaultMethod);
      }
    }
  }, [methodPayment, paymentMethodAvailability]);

  const isFocused = useIsFocused();
  const isFirstMount = useRef(true);
  const prevMethodPayment = useRef(methodPayment);
  const prevBankPayment = useRef(bankPayment?.code);

  useEffect(() => {
    if (!isFocused) return;
    if (paymentMethodAvailability.isLoading) return;

    const numericAmt = amount ? parseInt(amount, 10) : 0;

    const getCalculatePayload = (amt: number): PaymentCalculatePayload => {
      return {
        amount: amt,
        productType: 'TRANSFER',
        payMethod: methodPayment === 'VA' ? 'VIRTUAL_ACCOUNT' : methodPayment,
        payChannel: methodPayment === 'VA' ? bankPayment?.code || '' : 'QRIS',
      };
    };

    const fetchCalculation = async (amt: number) => {
      if (methodPayment === 'VA' && !bankPayment?.code && amt >= 10000) return;

      setIsLoadingCalculate(true);
      try {
        const payload = getCalculatePayload(amt);
        const res = await paymentApi.calculatePayment(payload);
        if (res && res.status === 'success') {
          setCalculateData(res.data);
        }
      } catch (error) {
        console.log('Calculate error:', error);
      } finally {
        setIsLoadingCalculate(false);
      }
    };

    const isMethodChanged = prevMethodPayment.current !== methodPayment;
    const isBankChanged = prevBankPayment.current !== bankPayment?.code;

    if (isFirstMount.current || isMethodChanged || isBankChanged) {
      isFirstMount.current = false;
      prevMethodPayment.current = methodPayment;
      prevBankPayment.current = bankPayment?.code;

      fetchCalculation(numericAmt);
      return;
    }

    const isQrisReady = methodPayment === 'QRIS';
    const isVaReady = methodPayment === 'VA' && !!bankPayment?.code;
    const isPaymentMethodReady = isQrisReady || isVaReady;

    if (numericAmt >= 10000 && isPaymentMethodReady) {
      setIsLoadingCalculate(true);

      const delayDebounceFn = setTimeout(() => {
        fetchCalculation(numericAmt);
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [amount, methodPayment, bankPayment, isFocused, paymentMethodAvailability.isLoading]);

  const onPressConfirm = () => {
    if (!selectedPurpose) {
      setIsPurposeModalVisible(true);
      return;
    }

    trackPostHogEvent('transfer_confirmed', {
      amount_range: getAmountRange(amount),
      destination_bank: bankData?.shortName || bankData?.name || 'unknown',
      source_bank: bankPayment?.code || bankData?.shortName || 'unknown',
      pay_method: methodPayment,
      fee_status: calculateData?.isFreeTransfer || calculateData?.fee === 0 ? 'free_quota' : 'paid',
    });

    let payload = {
      amount: parseInt(amount),
      inquiryId: accountData?.id,
      beneficiaryId: props.beneficiaryId,
      payChannel: methodPayment == 'VA' ? bankPayment?.code : methodPayment,
      payMethod: methodPayment == 'VA' ? 'VIRTUAL_ACCOUNT' : methodPayment,
      transactionPurpose: selectedPurpose?.code,
    };
    let idempotencyKey = new Date().getTime().toString();

    postTransfer(
      {
        payload,
        idempotencyKey,
      },
      {
        onSuccess: (data) => {
          let transferData = data?.data ?? {};
          console.log('postTransfer onSuccess bankPayment', bankPayment);
          gotoPaymentInstruction(methodPayment, amount, transferData, bankPayment);
        },
        onError: (error) => {
          console.log('postTransfer onError', error);
          if (error?.error?.message) {
            Toast.show({
              type: 'error',
              text1: error?.error?.message,
            });
          }
        },
      },
    );
  };

  const numericAmount = amount ? parseInt(amount, 10) : 0;
  const showMinAmountError = amount !== '' && numericAmount > 0 && numericAmount < 10000;

  useEffect(() => {
    let isDisable = true;

    if (paymentMethodAvailability.isLoading) {
      isDisable = true;
    } else if (!paymentMethodAvailability.hasAnyEnabled) {
      isDisable = true;
    } else if (numericAmount < 10000) {
      isDisable = true;
    } else if (methodPayment == 'QRIS' && !amount) {
      isDisable = true;
    } else if (methodPayment == 'VA' && (_.isEmpty(bankPayment) || !amount)) {
      isDisable = true;
    } else if (isLoadingCalculate) {
      isDisable = true;
    } else {
      isDisable = false;
    }
    setIsDisableConfirm(isDisable);
  }, [
    methodPayment,
    bankPayment,
    amount,
    numericAmount,
    isLoadingCalculate,
    paymentMethodAvailability.isLoading,
    paymentMethodAvailability.hasAnyEnabled,
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <HeaderToolbar
        title={'Jumlah & Konfirmasi'}
        onPressBack={onPressBack}
        titleStyle="medium"
        titlePosition={'left'}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 190 }} style={styles.container}>
        <View style={styles.recipientCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {accountHolderName?.substring(0, 2).toUpperCase() || 'N/A'}
            </Text>
          </View>
          <View>
            <Text style={styles.recipientName}>{accountHolderName || 'Nama tidak tersedia'}</Text>
            <Text style={styles.recipientBank}>
              {bankData?.shortName || ''} •{' '}
              {accountNumber ? `${accountNumber.replace(/^.{3}/, '***')}` : ''}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={[styles.labelRp, { marginRight: 12 }]}>Rp</Text>

          <TouchableWithoutFeedback onPress={handleFocusInput}>
            <View style={[styles.inputContainer, isFocusedInput && styles.inputContainerFocused]}>
              <TextInput
                ref={inputRef}
                style={[styles.inputAmount, { fontSize: amount.length > 0 ? 32 : 16 }]}
                placeholder="Nominal Transfer"
                keyboardType="numeric"
                value={formatNumber(amount)}
                onFocus={() => setIsFocusedInput(true)}
                onBlur={() => setIsFocusedInput(false)}
                onChangeText={(val) => setAmount(val.replace(/[^0-9]/g, ''))}
                blurOnSubmit={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        {showMinAmountError ? (
          <Text
            style={{
              color: '#D32F2F',
              marginLeft: 20,
              marginTop: 8,
              fontFamily: 'Switzer-Regular',
            }}>
            Minimal transfer Rp 10.000
          </Text>
        ) : null}

        <QuickAmount
          currentAmount={amount}
          onAmountPress={(val) => setAmount(val)}
          amounts={quickAmounts}
        />

        <Text style={[styles.label, { marginTop: 10, paddingHorizontal: 20 }]}>
          Tujuan Transaksi <Text style={{ color: '#9CA3AF' }}>(wajib)</Text>
        </Text>
        <TouchableOpacity
          style={{
            borderColor: '#E5E5E5',
            borderWidth: 1,
            backgroundColor: '#FFF',
            padding: 16,
            borderRadius: 12,
            marginHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: 50,
          }}
          onPress={() => setIsPurposeModalVisible(true)}
          activeOpacity={0.7}>
          <Text
            style={{
              fontFamily: 'Switzer-Regular',
              color: selectedPurpose ? '#0A0A0A' : '#737373',
              fontSize: 15,
              flex: 1,
            }}>
            {selectedPurpose ? selectedPurpose.name : 'Pilih Tujuan'}
          </Text>
          {isLoadingPurposes ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <ChevronDown size={18} color="#9CA3AF" />
          )}
        </TouchableOpacity>

        <Modal
          visible={isPurposeModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsPurposeModalVisible(false)}>
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
            activeOpacity={1}
            onPress={() => setIsPurposeModalVisible(false)}
          />
          <View
            style={{
              backgroundColor: '#FFF',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingBottom: 32,
              maxHeight: '60%',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
            }}>
            <View
              style={{
                alignItems: 'center',
                paddingTop: 12,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}>
              <View
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#E5E7EB',
                  marginBottom: 12,
                }}
              />
              <Text style={{ fontFamily: 'Switzer-Bold', fontSize: 16, color: '#0A0A0A' }}>
                Tujuan Transaksi
              </Text>
            </View>
            <FlatList
              data={purposes}
              keyExtractor={(item) => item.code}
              ListEmptyComponent={
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 24,
                    paddingHorizontal: 20,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Switzer-Regular',
                      fontSize: 14,
                      color: '#737373',
                      textAlign: 'center',
                    }}>
                    {isLoadingPurposes
                      ? 'Memuat tujuan transaksi...'
                      : isPurposesError
                        ? 'Gagal memuat tujuan transaksi. Silakan coba lagi.'
                        : 'Tujuan transaksi tidak tersedia.'}
                  </Text>
                  {isPurposesError && (
                    <TouchableOpacity
                      onPress={() => refetchPurposes()}
                      disabled={isFetchingPurposes}
                      style={{ marginTop: 12, paddingVertical: 8, paddingHorizontal: 16 }}>
                      {isFetchingPurposes ? (
                        <ActivityIndicator size="small" color="#3B82F6" />
                      ) : (
                        <Text
                          style={{
                            fontFamily: 'Switzer-Bold',
                            fontSize: 14,
                            color: '#3B82F6',
                          }}>
                          Coba Lagi
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F9FAFB',
                  }}
                  onPress={() => {
                    setSelectedPurpose({ code: item.code, name: item.name });
                    setIsPurposeModalVisible(false);
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Switzer-Regular',
                      fontSize: 15,
                      color: '#0A0A0A',
                      flex: 1,
                    }}>
                    {item.name}
                  </Text>
                  {selectedPurpose?.code === item.code && <Check size={18} color="#3B82F6" />}
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <PaymentMethod
          selectedMethod={methodPayment}
          onSelect={(val) => setMethodPayment(val)}
          onSelectBank={(val) => setBankPayment(val)}
          initialBankPayment={initialBankPayment}
          styleProps={{}}
          isVAEnabled={paymentMethodAvailability.vaEnabled}
          isQRISEnabled={paymentMethodAvailability.qrisEnabled}
          isLoading={paymentMethodAvailability.isLoading}
        />
      </ScrollView>

      <View style={styles.footerOverlay}>
        <View style={styles.footerContent}>
          <View
            style={[
              styles.rowBetween,
              {
                marginBottom: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              },
            ]}>
            <Text style={{ fontFamily: 'Switzer-Regular', color: '#000000', fontSize: 14 }}>
              Limit Harian:
            </Text>

            <Text style={{ fontFamily: 'Switzer-Regular', color: '#1F2937', fontSize: 14 }}>
              {calculateData ? (
                <>
                  <Text style={{ fontFamily: 'Switzer-Bold' }}>
                    {`  Rp ${formatNumber(calculateData.dailyLimitUsed)}`}
                  </Text>
                  {/* Bagian total limit tetap Regular */}
                  {` / Rp ${formatNumber(calculateData.dailyLimitTotal)}`}
                </>
              ) : (
                '  -'
              )}
            </Text>
          </View>

          {calculateData && (
            <View
              style={[
                styles.rowBetween,
                { marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' },
              ]}>
              <Text style={{ fontFamily: 'Switzer-Regular', color: '#000000', fontSize: 14 }}>
                Biaya transfer
              </Text>
              {calculateData.isFreeTransfer || calculateData.fee === 0 ? (
                <Text style={{ fontFamily: 'Switzer-Medium', color: '#16A34A', fontSize: 14 }}>
                  GRATIS
                </Text>
              ) : (
                <Text style={{ fontFamily: 'Switzer-Regular', color: '#000000', fontSize: 14 }}>
                  {`Rp ${formatNumber(calculateData?.fee)}`}
                </Text>
              )}
            </View>
          )}

          {calculateData && (
            <View style={[styles.rowBetween, { marginTop: 8, alignItems: 'center' }]}>
              <Text style={{ fontFamily: 'Switzer-Regular', color: '#000000', fontSize: 14 }}>
                Total Bayar
              </Text>
              <Text style={styles.totalText}>
                {`Rp ${calculateData?.totalAmount ? formatNumber(calculateData.totalAmount) : '-'}`}
              </Text>
            </View>
          )}

          <Button
            type="regular"
            onPress={() => onPressConfirm()}
            title="Konfirmasi & Bayar"
            color="#1F2937"
            textColor="white"
            textStyle={{ color: '#FFF', fontFamily: 'Switzer-Bold', fontSize: 16 }}
            style={[styles.confirmButton, isDisableConfirm && styles.disabledButton]}
            disable={isDisableConfirm}
            loading={isLoadingTransfer}
          />
          <View style={{ marginTop: 12 }}>
            {isLoadingCalculate ? (
              <ActivityIndicator
                size="small"
                color="#1F2937"
                style={{ alignSelf: 'flex-start', marginVertical: 2 }}
              />
            ) : calculateData ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {calculateData.freeQuotaRemaining === 1 ? (
                  <>
                    <TriangleAlert size={20} color="#D97706" />
                    <Text style={{ fontFamily: 'Switzer-Medium', fontSize: 14, color: '#000000' }}>
                      Kuota transfer gratis tersisa 1 dari {calculateData.freeQuotaTotal}
                    </Text>
                  </>
                ) : calculateData.freeQuotaRemaining > 0 ? (
                  <>
                    <Info size={20} color="#525252" />
                    <Text style={{ fontFamily: 'Switzer-Medium', fontSize: 14, color: '#1F2937' }}>
                      Kuota transfer gratis tersisa {calculateData.freeQuotaRemaining} dari{' '}
                      {calculateData.freeQuotaTotal}
                    </Text>
                  </>
                ) : (
                  <>
                    <Info size={20} color="#525252" />
                    <Text style={{ fontFamily: 'Switzer-Medium', fontSize: 14, color: '#000000' }}>
                      Kuota gratis habis biaya transfer Rp{' '}
                      {formatNumber(calculateData.feePerTransaction)}/transaksi
                    </Text>
                  </>
                )}
              </View>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Info size={14} color="#666" />
                <Text style={{ fontFamily: 'Switzer-Regular', fontSize: 14, color: '#666' }}>
                  Kuota transfer gratis tersisa 5 dari 5
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransferDetailView;
