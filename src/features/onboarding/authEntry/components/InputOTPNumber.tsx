import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CodeField, Cursor } from 'react-native-confirmation-code-field';
import { formatOTPTimer } from '../../../../utils/Common/index';

interface InputOTPNumberProps {
  styles: any;
  valueOTP: string;
  setValueOTP: (val: string) => void;
  timerOTP: number;
  phoneNumbData: { phoneNumber: string; countryCode: string };
  CELL_COUNT_OTP: number;
  otpFieldProps: any;
  getCellOnLayoutHandler: (index: number) => (event: any) => void;
  onResendOtp: () => void;
  isPending: boolean;
  errorMessage?: string;
}

const InputOTPNumber: React.FC<InputOTPNumberProps> = ({
  styles,
  valueOTP,
  setValueOTP,
  timerOTP,
  phoneNumbData,
  CELL_COUNT_OTP,
  otpFieldProps,
  getCellOnLayoutHandler,
  onResendOtp,
  isPending,
  errorMessage,
}) => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <Text style={styles.titleStep}>{t('authEntry.enterOTPNumber')}</Text>
      <Text style={styles.descStep}>
        {t('authEntry.descEnterOTPNumber') +
          phoneNumbData?.countryCode +
          phoneNumbData?.phoneNumber}
      </Text>

      <CodeField
        {...otpFieldProps}
        value={valueOTP}
        onChangeText={setValueOTP}
        cellCount={CELL_COUNT_OTP}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoFocus={true}
        renderCell={({ index, symbol, isFocused }) => {
          const isFilled = !!symbol;
          return (
            <View
              key={index}
              style={[
                styles.cell,
                isFocused && styles.focusCell,
                isFilled && styles.filledCell,
                !!errorMessage && styles.cellError,
              ]}
              onLayout={getCellOnLayoutHandler(index)}>
              <Text style={[styles.cellText, isFilled && styles.filledCellText]}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          );
        }}
      />

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Tidak menerima ? </Text>
        <TouchableOpacity disabled={timerOTP > 0 || isPending} onPress={onResendOtp}>
          <Text style={[styles.resendLink, (timerOTP > 0 || isPending) && styles.resendDisabled]}>
            {isPending ? 'Mengirim...' : `Kirim ulang `}
            <Text style={styles.resendLink}>({formatOTPTimer(timerOTP)})</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputOTPNumber;
