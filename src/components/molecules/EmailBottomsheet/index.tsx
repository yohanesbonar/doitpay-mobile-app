import React, { useCallback, useMemo, forwardRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { ShieldCheck } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from './styles';
import Toast from 'react-native-toast-message';

export const EmailBottomsheet = forwardRef(({ onDismiss }: any, ref: any) => {
  const snapPoints = useMemo(() => ['65%'], []);
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (text: string) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (text.length === 0) {
      setError('');
    } else if (!emailRegex.test(text)) {
      setError('Format email tidak valid');
    } else {
      setError('');
    }
  };

  const isValid = email.length > 0 && error === '';

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      stackBehavior="replace"
      backdropComponent={renderBackdrop}
      snapPoints={snapPoints}
      enablePanDownToClose
      onDismiss={onDismiss}
      handleIndicatorStyle={{ backgroundColor: '#E5E5E5', width: 40 }}>
      <BottomSheetView style={styles.contentContainer}>
        <Text style={styles.title}>Amankan akun kamu</Text>
        <Text style={styles.description}>
          Tambahkan email untuk melindungi akun dari SIM dan sebagai metode pemulihan jika kamu lupa
          PIN
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, error ? { borderColor: '#EF4444' } : {}]}
            placeholder="nama@email.com"
            placeholderTextColor="#A3A3A3"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={validateEmail}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <View style={styles.infoBox}>
          <ShieldCheck size={20} color="#1A1A1A" style={styles.infoIcon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Perlindungan SIM Swap</Text>
            <Text style={styles.infoText}>
              Email sebagai faktor keamanan kedua untuk PIN reset dan login perangkat baru.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.buttonPrimary, !isValid && { backgroundColor: '#E5E5E5' }]}
          activeOpacity={0.8}
          disabled={!isValid}
          onPress={() => {
            setTimeout(() => {
              ref.current?.dismiss();
            }, 100);
            setTimeout(() => {
              Toast.show({
                type: 'success',
                text1: 'Submit Email Berhasil!',
              });
            }, 200);
            setEmail('');
            setError('');
          }}>
          <Text style={[styles.buttonTextPrimary, !isValid && { color: '#A3A3A3' }]}>
            Verifikasi Email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={() => ref.current?.dismiss()}>
          <Text style={styles.buttonTextSecondary}>Nanti Saja</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
});
