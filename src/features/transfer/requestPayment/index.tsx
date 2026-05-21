import React, { useEffect, useState } from 'react';
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
import _ from 'lodash';

const QUICK_AMOUNTS = ['50000', '100000', '200000', '500000', '1000000', '2000000'];

interface RequestPaymentViewProps {
  onPressBack: () => void;
  onGenerateQR: (amount: string, receiveData: any) => void;
  gotoPaymentInstruction: (
    paymentMethod: 'VA' | 'QRIS',
    amount: string,
    transferData: any,
    bankPayment: any,
  ) => void;
}

export const RequestPaymentView = ({
  onPressBack,
  onGenerateQR,
  gotoPaymentInstruction,
}: RequestPaymentViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [amount, setAmount] = useState('');
  const { t } = useTranslation();
  const [methodPayment, setMethodPayment] = useState<'VA' | 'QRIS'>('VA');
  const [bankPayment, setBankPayment] = useState(null);
  const [isDisableConfirm, setIsDisableConfirm] = useState(false);
  const [isErrorMinimumReached, setIsErrorMinimumReached] = useState(false);

  const isInputEmpty = amount === '';
  const { mutate: postReceive, isPending: isLoadingReceive } = useReceive();

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
        payload,
        idempotencyKey,
      },
      {
        onSuccess: (data) => {
          let receiveData = data?.data ?? {};
          if (methodPayment == 'QRIS') onGenerateQR(methodPayment, amount, receiveData);
          else gotoPaymentInstruction(methodPayment, amount, receiveData, bankPayment);
        },
        onError: (error) => {
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
      console.log('a');
    } else if (methodPayment == 'VA' && (_.isEmpty(bankPayment) || errorMinimumReached)) {
      isDisable = true;
      console.log('b');
    } else {
      isDisable = false;
    }

    console.log('setIsDisableConfirm ', isDisable);
    setIsDisableConfirm(isDisable);
  }, [amount, methodPayment, bankPayment]);

  const handleInputChange = (val: string) => {
    const cleanNumber = val.replace(/[^0-9]/g, '');
    console.log('val', cleanNumber);
    setAmount(cleanNumber);
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <HeaderToolbar title="Terima Pembayaran" onPressBack={onPressBack} titlePosition="left" />

          <ScrollView style={styles.content}>
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
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button
              type="withIcon"
              title={methodPayment != 'VA' ? 'Generate QR' : 'Generate VA'}
              onPress={onPressConfirm}
              color={colors.buttonBlue}
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
