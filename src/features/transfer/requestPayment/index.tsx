import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from './styles';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '../../../components/atoms/Button/index.tsx';
import { formatNumber } from '@/utils/Common';
import { useTranslation } from 'react-i18next';
import { useReceive } from '@/hooks/useTransferMutation.ts';
import Toast from 'react-native-toast-message';
import PaymentMethod from '../transferDetail/components/PaymentMethod.tsx';
import {
  paymentApi,
  PaymentCalculatePayload,
} from '../transferDetail/api/payment-calculate-api.ts';
import { Info, TriangleAlert } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';

const QUICK_AMOUNTS = ['50000', '100000', '200000', '500000', '1000000', '2000000'];

interface RequestPaymentViewProps {
  onPressBack: () => void;
  onGenerateQR: (
    methodPayment: string,
    amount: string,
    receiveData: any,
    bankPayment?: any,
  ) => void;
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

export const RequestPaymentView = ({
  onPressBack,
  onGenerateQR,
  gotoPaymentInstruction,
  initialAmount,
  initialPaymentMethod,
  initialBankPayment,
}: RequestPaymentViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [amount, setAmount] = useState(initialAmount || '');
  const { t } = useTranslation();
  const [methodPayment, setMethodPayment] = useState<'VA' | 'QRIS'>(initialPaymentMethod || 'VA');
  const [bankPayment, setBankPayment] = useState(initialBankPayment || null);
  const [isDisableConfirm, setIsDisableConfirm] = useState(false);
  const [isErrorMinimumReached, setIsErrorMinimumReached] = useState(false);
  const [calculateData, setCalculateData] = useState<any>(null);
  const [isLoadingCalculate, setIsLoadingCalculate] = useState(false);

  const isInputEmpty = amount === '';
  const { mutate: postReceive, isPending: isLoadingReceive } = useReceive();
  const isFocused = useIsFocused();
  const isFirstMount = useRef(true);
  const prevMethodPayment = useRef(methodPayment);
  const prevBankPayment = useRef(bankPayment?.code);

  const onPressConfirm = () => {
    let payload = {
      amount: parseInt(amount),
      payChannel: methodPayment == 'VA' ? bankPayment?.code : methodPayment,
      payMethod: methodPayment == 'VA' ? 'VIRTUAL_ACCOUNT' : methodPayment,
      remark: '',
    };
    let idempotencyKey = new Date().getTime().toString();

    postReceive(
      {
        payload: payload as any,
        idempotencyKey,
      },
      {
        onSuccess: (data) => {
          let receiveData = data?.data ?? {};
          if (methodPayment == 'QRIS')
            onGenerateQR(methodPayment, amount, receiveData, bankPayment);
          else gotoPaymentInstruction(methodPayment, amount, receiveData, bankPayment);
        },
        onError: (error: any) => {
          console.error('error postReceive', error?.error?.message);
          Toast.show({
            type: 'error',
            text1: error?.error?.message ?? '',
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!isFocused) return;

    const numericAmt = amount ? parseInt(amount, 10) : 0;

    const getCalculatePayload = (amt: number): PaymentCalculatePayload => {
      return {
        amount: amt,
        productType: 'RECEIVE',
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
        console.log('Receive calculate error:', error);
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

  useEffect(() => {
    let errorMinimumReached;
    let amountInt = parseInt(amount);
    if (amountInt >= 10000) {
      errorMinimumReached = false;
    } else {
      errorMinimumReached = true;
    }
    setIsErrorMinimumReached(errorMinimumReached);

    let isDisable;
    if (methodPayment == 'QRIS' && errorMinimumReached) {
      isDisable = true;
    } else if (methodPayment == 'VA' && (!bankPayment || errorMinimumReached)) {
      isDisable = true;
    } else if (isLoadingCalculate) {
      isDisable = true;
    } else {
      isDisable = false;
    }

    setIsDisableConfirm(isDisable);
  }, [amount, methodPayment, bankPayment, isLoadingCalculate]);

  const handleInputChange = (val: string) => {
    const cleanNumber = val.replace(/[^0-9]/g, '');
    setAmount(cleanNumber);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <HeaderToolbar title="Terima Pembayaran" onPressBack={onPressBack} titlePosition="left" />

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={styles.title}>{t('requestPayment.inputNominal')}</Text>
              <Text style={styles.subtitle}>{t('requestPayment.descInputNominal')}</Text>
            </View>

            <View
              style={[
                styles.inputAmountWrapper,
                { marginBottom: isErrorMinimumReached && !isInputEmpty ? 0 : 16 },
              ]}>
              <Text style={styles.inputCurrencyPrefix}>Rp</Text>
              <TextInput
                style={[
                  styles.amountInput,
                  amount.length === 0 ? styles.amountInputPlaceholder : styles.amountInputActive,
                  isErrorMinimumReached && !isInputEmpty && {},
                ]}
                placeholder="Masukkan Nominal"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={formatNumber(amount)}
                onChangeText={handleInputChange}
              />
            </View>

            {isErrorMinimumReached && !isInputEmpty && (
              <Text style={styles.textError}>{t('requestPayment.minimal')}</Text>
            )}

            <View style={styles.chipContainer}>
              {QUICK_AMOUNTS.map((item) => (
                <TouchableOpacity key={item} style={styles.chip} onPress={() => setAmount(item)}>
                  <Text style={styles.chipText}>{formatNumber(item)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <PaymentMethod
              selectedMethod={methodPayment}
              styleProps={{ backgroundColor: '#FFF' }}
              onSelect={(val) => setMethodPayment(val)}
              onSelectBank={(val) => setBankPayment(val)}
              initialBankPayment={initialBankPayment}
            />
          </ScrollView>

          <View style={styles.footer}>
            {calculateData && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Biaya terima</Text>
                {calculateData.isFreeTransfer || calculateData.fee === 0 ? (
                  <Text style={styles.summaryFreeText}>GRATIS</Text>
                ) : (
                  <Text
                    style={styles.summaryLabel}>{`Rp ${formatNumber(calculateData?.fee)}`}</Text>
                )}
              </View>
            )}

            {calculateData && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Bayar</Text>
                <Text style={styles.totalText}>
                  {`Rp ${calculateData?.totalAmount ? formatNumber(calculateData.totalAmount) : '-'}`}
                </Text>
              </View>
            )}

            <Button
              type="withIcon"
              title={methodPayment != 'VA' ? 'Generate QR' : 'Generate VA'}
              onPress={onPressConfirm}
              color={colors.buttonBlue}
              textColor="white"
              textStyle={{ color: colors.textWhite }}
              sourceIcon={
                methodPayment != 'VA'
                  ? require('../../../assets/images/ic-qr-small-button.png')
                  : require('../../../assets/images/ic-va-small-button.png')
              }
              iconStyle={{
                width: 15,
                height: 15,
                alignSelf: 'center',
              }}
              style={[styles.confirmButton, isDisableConfirm && styles.disabledButton]}
              disable={isDisableConfirm}
              loading={isLoadingReceive}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RequestPaymentView;
