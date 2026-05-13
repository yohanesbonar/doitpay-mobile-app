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
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from './styles';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '../../../components/atoms/Button/index.tsx';
import { formatNumber } from '@/utils/Common';
import { useTranslation } from 'react-i18next';

const QUICK_AMOUNTS = ['50000', '100000', '200000', '500000', '1000000', '2000000'];

interface RequestPaymentViewProps {
  onPressBack: () => void;
  onGenerateQR: (amount: string) => void;
}

export const RequestPaymentView = ({ onPressBack, onGenerateQR }: RequestPaymentViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [amount, setAmount] = useState('');
  const [isErrorMinimumReached, setIsErrorMinimumReached] = useState(false);
  const { t } = useTranslation();

  const isInputEmpty = amount === '';

  const handleGenerateQR = () => {
    if (!isErrorMinimumReached) {
      onGenerateQR(amount);
    }
  };

  useEffect(() => {
    let amountInt = parseInt(amount);
    if (amountInt >= 10000) {
      setIsErrorMinimumReached(false);
    } else {
      setIsErrorMinimumReached(true);
    }
  }, [amount]);

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

          <View style={styles.content}>
            <Text style={styles.title}>{t('requestPayment.inputNominal')}</Text>
            <Text style={styles.subtitle}>{t('requestPayment.descInputNominal')}</Text>

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
          </View>

          {!isErrorMinimumReached && (
            <View style={styles.footer}>
              <Button
                type="regular"
                title="Generate QR"
                onPress={handleGenerateQR}
                color={colors.buttonBlue}
                textStyle={{ color: colors.textWhite }}
                sourceIcon={require('../../../assets/images/ic-qr-small-button.png')}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RequestPaymentView;
