import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import PaymentMethod from './components/PaymentMethod';
import QuickAmount from './components/QuickAmount';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { formatNumber } from '@/utils/Common';
import { useReceive, useTransfer } from '../../../hooks/useTransferMutation';
import _ from 'lodash';
import Button from '../../../components/atoms/Button/index.tsx';

interface TransferDetailViewProps {
  accountData: {
    accountNumber: string;
    bankName: string;
    ownerName: string;
    accountHolderName: string;
  };
  bankData: any;
  fromTabBar: boolean;
  isLoginState: boolean;
  method: 'send' | 'receive';
  onPressBack: () => void;
  gotoPaymentInstruction: (
    paymentMethod: 'VA' | 'QRIS',
    amount: string,
    transferData: any,
    bankPayment: any,
  ) => void;
}

const TransferDetailView = (props: TransferDetailViewProps) => {
  const navigation = useNavigation<any>();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const handleFocusInput = () => {
    inputRef.current?.focus();
  };
  console.log('TransferDetailView Props:', props);
  const {
    onPressBack,
    bankData,
    fromTabBar,
    isLoginState,
    method,
    gotoPaymentInstruction,
    accountData,
  } = props;
  const { accountNumber, bankName, accountHolderName } = accountData || {};

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [methodPayment, setMethodPayment] = useState<'VA' | 'QRIS'>('VA');
  const [bankPayment, setBankPayment] = useState(null);
  const [isDisableConfirm, setIsDisableConfirm] = useState(true);

  const { mutate: postTransfer, isPending: isLoadingTransfer } = useTransfer();

  useEffect(() => {
    console.log('bankPayment ->>>', bankPayment);
  }, [bankPayment]);

  const onPressConfirm = () => {
    let payload = {
      amount: parseInt(amount),
      inquiryId: accountData?.id,
      payChannel:
        methodPayment == 'VA' ? bankPayment?.shortName + '_' + methodPayment : methodPayment,
      payMethod: methodPayment,
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
          let transferData = data?.data;
          console.log('postTransfer onSuccess bankPayment', bankPayment);
          gotoPaymentInstruction(methodPayment, amount, transferData, bankPayment);
        },
        onError: (error) => {
          console.error('Transfer gagal ->>> ', error);
        },
      },
    );
  };

  useEffect(() => {
    let isDisable = true;

    if (methodPayment == 'QRIS' && !amount) {
      isDisable = true;
      console.log('a');
    } else if (methodPayment == 'VA' && (_.isEmpty(bankPayment) || !amount)) {
      isDisable = true;
      console.log('b');
    } else {
      isDisable = false;
    }
    setIsDisableConfirm(isDisable);
  }, [methodPayment, bankPayment, amount]);

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
            <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
              <TextInput
                ref={inputRef}
                style={[styles.inputAmount, { fontSize: amount.length > 0 ? 32 : 16 }]}
                placeholder="Nominal Transfer"
                keyboardType="numeric"
                value={formatNumber(amount)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChangeText={(val) => setAmount(val.replace(/[^0-9]/g, ''))}
                blurOnSubmit={false}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

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
        />
      </ScrollView>

      <View style={styles.footerOverlay}>
        <View style={styles.footerContent}>
          <View style={styles.rowBetween}>
            <Text style={{ fontFamily: 'Switzer-Regular', color: '#666', fontSize: 14 }}>
              Biaya transfer
            </Text>
            <Text style={{ color: '#27AE60', fontFamily: 'Switzer-Medium', fontSize: 16 }}>
              GRATIS
            </Text>
          </View>
          <View style={[styles.rowBetween, { marginTop: 4 }]}>
            <Text style={{ fontFamily: 'Switzer-Regular', color: '#666', fontSize: 14 }}>
              Total Bayar
            </Text>
            <Text style={styles.totalText}>Rp {amount ? formatNumber(amount) : '0'}</Text>
          </View>
          <Button
            type="regular"
            onPress={() => onPressConfirm()}
            title="Konfirmasi & Bayar"
            textStyle={{ color: '#FFF', fontFamily: 'Switzer-Bold', fontSize: 16 }}
            style={[styles.confirmButton, isDisableConfirm && styles.disabledButton]}
            disable={isDisableConfirm}
            loading={isLoadingTransfer}
          />
        </View>
      </View>
    </View>
  );
};

export default TransferDetailView;
