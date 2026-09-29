import React from 'react';
import { Keyboard } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ConfirmDataView, { ConfirmDataFormValues } from '@/features/kyc/confirmData';
import { KycGender } from '@/features/kyc/api/kyc';
import { useSubmitKyc } from '@/hooks/useKycMutation';

type ConfirmDataRouteParams = {
  ktpUri: string;
  selfieUri: string;
};

// Local date, not toISOString(): that converts to UTC and can shift the day back in WIB.
const toApiDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const ConfirmDataScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { ktpUri, selfieUri } = (route.params || {}) as ConfirmDataRouteParams;
  const { mutate: submitKyc, isPending } = useSubmitKyc();

  const handleSubmit = (values: ConfirmDataFormValues) => {
    if (!ktpUri || !selfieUri) {
      Toast.show({ type: 'error', text1: 'Foto KTP atau selfie tidak ditemukan, silakan ulangi.' });
      return;
    }

    Keyboard.dismiss();
    submitKyc(
      {
        fullName: values.fullName.trim(),
        nik: values.nik,
        // Form validation guarantees these are set.
        birthDate: toApiDate(values.birthDate as Date),
        gender: values.gender as KycGender,
        addressLine: values.addressLine.trim(),
        ktpImageUri: ktpUri,
        selfieImageUri: selfieUri,
      },
      {
        // Reset so back (incl. Android hardware back) cannot return to the submitted form.
        onSuccess: () =>
          navigation.reset({
            index: 1,
            routes: [{ name: 'MainTabs' }, { name: 'KycDataSubmitted' }],
          }),
        onError: (err: any) => {
          Toast.show({
            type: 'error',
            text1:
              err?.response?.data?.error?.message ??
              err?.response?.data?.message ??
              'Gagal mengirim data KYC',
          });
        },
      },
    );
  };

  return (
    <ConfirmDataView
      onPressBack={() => navigation.goBack()}
      onSubmitData={handleSubmit}
      isSubmitting={isPending}
    />
  );
};

export default ConfirmDataScreen;
