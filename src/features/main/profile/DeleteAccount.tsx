import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CheckSquare, CreditCard, History, Square, Trash2, User } from 'lucide-react-native';
import { useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles as createAuthStyles } from '@/features/onboarding/authEntry/styles';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import InputOTPNumber from '@/features/onboarding/authEntry/components/InputOTPNumber';
import {
  useDeleteAccount,
  useDeleteAccountRequestOtp,
  useDeleteAccountVerifyOtp,
} from '@/hooks/useAuthMutation';
import { useAuthStore } from '@/storage/useAuthStore';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery';
import AccountDeletionIcon from '@/assets/icons/ic-account-deletion.svg';

const CELL_COUNT_OTP = 6;
const PIN_LENGTH = 6;

export const DeleteAccount = () => {
  const { colors } = useTheme();
  const authStyles = createAuthStyles(colors);
  const navigation = useNavigation<any>();
  const logout = useAuthStore((state) => state.logout);

  const { data: profileData } = useGetProfileMeQuery();
  const phoneNumber = profileData?.data?.phoneNumber ?? '';

  const [currentStep, setCurrentStep] = useState(1);
  const [isChecked, setIsChecked] = useState(false);

  const [valueOTP, setValueOTP] = useState('');
  const [timerOTP, setTimerOTP] = useState(30);
  const [otpFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: valueOTP,
    setValue: setValueOTP,
  });
  useBlurOnFulfill({ value: valueOTP, cellCount: CELL_COUNT_OTP });

  const [pin, setPin] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const inputRef = useRef<TextInput>(null);

  const { mutate: requestOtp, isPending: isRequesting } = useDeleteAccountRequestOtp();
  const { mutate: verifyOtp, isPending: isVerifying } = useDeleteAccountVerifyOtp();
  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount();

  useEffect(() => {
    if (currentStep === 2) setValueOTP('');
    if (currentStep === 3) setPin('');
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== 2) return;
    const interval = setInterval(() => {
      setTimerOTP((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

  useEffect(() => {
    if (valueOTP.length !== CELL_COUNT_OTP || currentStep !== 2) return;
    verifyOtp(
      { otpCode: valueOTP },
      {
        onSuccess: (res) => {
          setVerifyToken(res.data.verificationToken);
          setCurrentStep(3);
        },
        onError: (err: any) => {
          Toast.show({ type: 'error', text1: err?.message || 'Kode OTP salah' });
          setValueOTP('');
        },
      },
    );
  }, [valueOTP]);

  const handleRequestOtp = () => {
    requestOtp(
      { method: 'SMS' },
      {
        onSuccess: (res) => {
          setTimerOTP(res.data.retryAfterSeconds || 30);
          setCurrentStep(2);
        },
        onError: (err: any) => {
          Toast.show({ type: 'error', text1: err?.message || 'Gagal mengirim OTP' });
        },
      },
    );
  };

  const handleResendOtp = () => {
    requestOtp(
      { method: 'SMS' },
      {
        onSuccess: (res) => setTimerOTP(res.data.retryAfterSeconds || 30),
        onError: (err: any) => {
          Toast.show({ type: 'error', text1: err?.message || 'Gagal mengirim OTP' });
        },
      },
    );
  };

  const handlePINChange = (text: string) => {
    if (text.length > PIN_LENGTH) return;
    setPin(text);
    if (text.length === PIN_LENGTH) {
      deleteAccount(
        { pin: text, reason: 'No longer needed', verifyToken },
        {
          onSuccess: () => {
            Keyboard.dismiss();
            setCurrentStep(4);
          },
          onError: (err: any) => {
            setPin('');
            Toast.show({ type: 'error', text1: err?.message || 'PIN salah atau sesi kadaluarsa' });
          },
        },
      );
    }
  };

  const renderDots = () =>
    Array.from({ length: PIN_LENGTH }).map((_, i) => (
      <View key={i} style={[authStyles.dot, i < pin.length && authStyles.dotFilled]} />
    ));

  const titleMap: Record<number, string> = {
    1: 'Hapus Akun',
    2: 'Hapus Akun',
    3: 'Verifikasi PIN',
    4: 'Hapus Akun',
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ScrollView
            contentContainerStyle={styles.stepOneContent}
            showsVerticalScrollIndicator={false}>
            <View style={styles.illustrationContainer}>
              <AccountDeletionIcon />
            </View>

            <Text style={styles.stepTitle}>Hapus Akun Permanen</Text>
            <Text style={styles.stepDesc}>Akun doitpay dan seluruh data berikut akan dihapus</Text>

            <View style={styles.itemsList}>
              <View style={styles.listItem}>
                <History size={20} color="#737373" strokeWidth={1.5} />
                <Text style={styles.listItemText}>Riwayat Transaksi</Text>
              </View>
              <View style={styles.listItem}>
                <CreditCard size={20} color="#737373" strokeWidth={1.5} />
                <Text style={styles.listItemText}>Rekening Tersimpan</Text>
              </View>
              <View style={styles.listItem}>
                <User size={20} color="#737373" strokeWidth={1.5} />
                <Text style={styles.listItemText}>Data Profil</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsChecked((v) => !v)}
              activeOpacity={0.7}>
              {isChecked ? (
                <CheckSquare size={22} color="#4A80F0" />
              ) : (
                <Square size={22} color="#737373" />
              )}
              <Text style={styles.checkboxText}>
                Saya memahami bahwa semua data akan dihapus secara permanen dan tidak dapat
                dipulihkan
              </Text>
            </TouchableOpacity>
          </ScrollView>
        );

      case 2:
        return (
          <InputOTPNumber
            styles={authStyles}
            valueOTP={valueOTP}
            setValueOTP={setValueOTP}
            timerOTP={timerOTP}
            phoneNumbData={{ countryCode: '+', phoneNumber }}
            CELL_COUNT_OTP={CELL_COUNT_OTP}
            otpFieldProps={otpFieldProps}
            getCellOnLayoutHandler={getCellOnLayoutHandler}
            onResendOtp={handleResendOtp}
            isPending={isRequesting || isVerifying}
          />
        );

      case 3:
        return (
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <Text style={authStyles.titleStep}>Verifikasi PIN</Text>
            <Text style={authStyles.descStep}>Masukkan PIN saat ini untuk melanjutkan</Text>
            <Pressable style={authStyles.dotsContainer} onPress={() => inputRef.current?.focus()}>
              {renderDots()}
            </Pressable>
            <TextInput
              ref={inputRef}
              value={pin}
              onChangeText={handlePINChange}
              keyboardType="number-pad"
              maxLength={PIN_LENGTH}
              style={authStyles.hiddenInput}
              autoFocus={true}
              editable={!isDeleting}
            />
          </View>
        );

      case 4:
        return (
          <View style={styles.successContainer}>
            <View style={styles.successIconWrapper}>
              <Trash2 size={56} color="#E25C5C" strokeWidth={1.5} />
            </View>
            <Text style={styles.successTitle}>Permintaan Penghapusan Diterima</Text>
            <Text style={styles.successDesc}>
              Akun kamu telah masuk ke proses penghapusan. Kamu masih dapat membatalkan penghapusan
              sebagai berikut:
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  const handleBack = () => {
    if (currentStep === 4) {
      logout();
      return;
    }
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: '#FFF' }}
        enabled>
        <HeaderToolbar
          title={titleMap[currentStep] ?? 'Hapus Akun'}
          onPressBack={handleBack}
          titlePosition="center"
          titleStyle="regular"
        />

        <View style={{ flex: 1 }}>{renderStep()}</View>

        {currentStep === 1 && (
          <View style={styles.footer}>
            <Button
              type="regular"
              onPress={handleRequestOtp}
              loading={isRequesting}
              title="Hapus Akun"
              color="#E25C5C"
              textColor="white"
              disable={!isChecked || isRequesting}
            />
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.footer}>
            <Button
              type="regular"
              onPress={() => logout()}
              title="Lihat Status"
              color="#4A80F0"
              textColor="white"
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  stepOneContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  illustrationCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 22,
    fontFamily: 'Switzer-Semibold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  stepDesc: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    marginBottom: 16,
  },
  itemsList: {
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 20,
    gap: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listItemText: {
    fontSize: 14,
    fontFamily: 'Switzer-Medium',
    color: '#1A1A1A',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 4,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Switzer-Regular',
    color: '#1A1A1A',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  successIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: 'Switzer-Semibold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDesc: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    textAlign: 'center',
    lineHeight: 22,
  },
});
