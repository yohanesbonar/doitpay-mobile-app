import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { styles } from './styles';
import PaymentMethod from './components/PaymentMethod';
import QuickAmount from './components/QuickAmount';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { formatNumber } from '@/utils/Common';
import { useReceive, useTransfer } from '../../../hooks/useTransferMutation';
import _ from 'lodash';
import Button from '../../../components/atoms/Button/index.tsx';
import Toast from 'react-native-toast-message';
import { paymentApi, PaymentCalculatePayload } from './api/payment-calculate-api';
import { Info, TriangleAlert } from 'lucide-react-native';

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
  const [note, setNote] = useState('');
  const [methodPayment, setMethodPayment] = useState<'VA' | 'QRIS'>(initialPaymentMethod || 'VA');
  const [bankPayment, setBankPayment] = useState(initialBankPayment || null);
  const [isDisableConfirm, setIsDisableConfirm] = useState(true);

  const [calculateData, setCalculateData] = useState<any>(null);
  const [isLoadingCalculate, setIsLoadingCalculate] = useState(false);

  const { mutate: postTransfer, isPending: isLoadingTransfer } = useTransfer();

  useEffect(() => {
    console.log('bankPayment ->>>', bankPayment);
  }, [bankPayment]);

  const isFocused = useIsFocused();
  const isFirstMount = useRef(true);
  const prevMethodPayment = useRef(methodPayment);
  const prevBankPayment = useRef(bankPayment?.code);

  useEffect(() => {
    if (!isFocused) return;

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
  }, [amount, methodPayment, bankPayment, isFocused]);

  const onPressConfirm = () => {
    let payload = {
      amount: parseInt(amount),
      inquiryId: accountData?.id,
      beneficiaryId: props.beneficiaryId,
      payChannel: methodPayment == 'VA' ? bankPayment?.code : methodPayment,
      payMethod: methodPayment == 'VA' ? 'VIRTUAL_ACCOUNT' : methodPayment,
      remark: note,
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

    if (numericAmount < 10000) {
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
  }, [methodPayment, bankPayment, amount, numericAmount, isLoadingCalculate]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <HeaderToolbar
        title={'Jumlah & Konfirmasi'}
        onPressBack={onPressBack}
        titleStyle="regular"
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

        <QuickAmount currentAmount={amount} onAmountPress={(val) => setAmount(val)} />

        <Text style={[styles.label, { marginTop: 10, paddingHorizontal: 20 }]}>
          Catatan (Opsional)
        </Text>
        <TextInput
          style={{
            borderColor: '#E5E5E5',
            borderWidth: 1,
            backgroundColor: '#FFF',
            padding: 16,
            borderRadius: 12,
            fontFamily: 'Switzer-Regular',
            minHeight: 50,
            marginHorizontal: 20,
          }}
          placeholder="Contoh: uang bulanan"
          placeholderTextColor={'#737373'}
          value={note}
          onChangeText={setNote}
        />

        <PaymentMethod
          selectedMethod={methodPayment}
          onSelect={(val) => setMethodPayment(val)}
          onSelectBank={(val) => setBankPayment(val)}
          initialBankPayment={initialBankPayment}
          styleProps={{}}
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
