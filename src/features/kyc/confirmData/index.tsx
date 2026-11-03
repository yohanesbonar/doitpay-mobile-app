import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from 'react-native-wheel-pick';
import { Calendar } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { AppBottomSheet } from '@/components/molecules/AppBottomSheet';
import { KycGender } from '@/features/kyc/api/kyc';
import { createStyles } from './styles';

export interface ConfirmDataFormValues {
  fullName: string;
  nik: string;
  birthDate: Date | null;
  gender: KycGender | '';
  addressLine: string;
}

interface ConfirmDataViewProps {
  onPressBack: () => void;
  onSubmitData: (values: ConfirmDataFormValues) => void;
  isSubmitting?: boolean;
}

const NIK_LENGTH = 16;
const MIN_BIRTH_YEAR = 1900;

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const clampBirthDate = (year: number, month: number, day: number, today: Date) => {
  const safeMonth = year === today.getFullYear() ? Math.min(month, today.getMonth()) : month;
  const maxDay =
    year === today.getFullYear() && safeMonth === today.getMonth()
      ? today.getDate()
      : getDaysInMonth(year, safeMonth);

  return new Date(year, safeMonth, Math.min(day, maxDay));
};

const GENDER_OPTIONS: { label: string; value: KycGender }[] = [
  { label: 'Laki-laki', value: 'M' },
  { label: 'Perempuan', value: 'F' },
];

const validationSchema = Yup.object({
  fullName: Yup.string().trim().required('Wajib diisi'),
  nik: Yup.string()
    .required('Wajib diisi')
    .matches(new RegExp(`^\\d{${NIK_LENGTH}}$`), `NIK harus ${NIK_LENGTH} digit angka`),
  birthDate: Yup.date().nullable().required('Wajib diisi'),
  gender: Yup.string().required('Wajib dipilih'),
  addressLine: Yup.string().trim().required('Wajib diisi'),
});

const formatDisplayDate = (date: Date) =>
  date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

export const ConfirmDataView = ({
  onPressBack,
  onSubmitData,
  isSubmitting = false,
}: ConfirmDataViewProps) => {
  const styles = createStyles();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [tempBirthDate, setTempBirthDate] = useState<Date>(new Date(1990, 0, 1));
  const today = new Date();
  const years = Array.from(
    { length: today.getFullYear() - MIN_BIRTH_YEAR + 1 },
    (_, index) => MIN_BIRTH_YEAR + index,
  );

  return (
    <Formik<ConfirmDataFormValues>
      initialValues={{ fullName: '', nik: '', birthDate: null, gender: '', addressLine: '' }}
      validationSchema={validationSchema}
      onSubmit={onSubmitData}>
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        handleSubmit,
      }) => {
        const showError = (field: keyof ConfirmDataFormValues) =>
          touched[field] && errors[field] ? (errors[field] as string) : undefined;

        const openDatePicker = () => {
          const initial = values.birthDate ?? new Date(1990, 0, 1);

          setTempBirthDate(initial);
          setIsDatePickerVisible(true);
        };

        const birthYear = tempBirthDate.getFullYear();
        const birthMonth = tempBirthDate.getMonth();
        const birthDay = tempBirthDate.getDate();
        const availableMonths = MONTHS.map((label, value) => ({ label, value })).filter(
          ({ value }) => birthYear < today.getFullYear() || value <= today.getMonth(),
        );
        const availableDays = Array.from(
          {
            length:
              birthYear === today.getFullYear() && birthMonth === today.getMonth()
                ? today.getDate()
                : getDaysInMonth(birthYear, birthMonth),
          },
          (_, index) => index + 1,
        ).map((value) => ({ label: String(value), value }));

        const renderError = (field: keyof ConfirmDataFormValues) => {
          const message = showError(field);
          return message ? <Text style={styles.errorText}>{message}</Text> : null;
        };

        return (
          <View style={styles.container}>
            <HeaderToolbar
              title="Konfirmasi Data"
              titlePosition="center"
              titleStyle="medium"
              backgroundColor="#FFF"
              onPressBack={onPressBack}
              onPressRightButton={onPressBack}
            />

            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <ScrollView
                style={styles.flex}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled">
                <Text style={styles.sectionTitle}>Lengkapi data sesuai KTP</Text>

                <View style={styles.field}>
                  <Text style={styles.label}>Nama Lengkap</Text>
                  <TextInput
                    style={[styles.input, showError('fullName') && styles.inputError]}
                    placeholder="Nama sesuai KTP"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    value={values.fullName}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                  />
                  {renderError('fullName')}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>NIK</Text>
                  <TextInput
                    style={[styles.input, showError('nik') && styles.inputError]}
                    placeholder={`${NIK_LENGTH} digit NIK`}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="number-pad"
                    maxLength={NIK_LENGTH}
                    value={values.nik}
                    onChangeText={(text) => setFieldValue('nik', text.replace(/\D/g, ''))}
                    onBlur={handleBlur('nik')}
                  />
                  {renderError('nik')}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Tanggal Lahir</Text>
                  <TouchableOpacity
                    style={[
                      styles.input,
                      styles.inputRow,
                      showError('birthDate') && styles.inputError,
                    ]}
                    onPress={openDatePicker}
                    activeOpacity={0.8}>
                    <Text style={values.birthDate ? styles.inputText : styles.placeholderText}>
                      {values.birthDate
                        ? formatDisplayDate(values.birthDate)
                        : 'Pilih tanggal lahir'}
                    </Text>
                    <Calendar size={20} color="#6B7280" />
                  </TouchableOpacity>
                  {renderError('birthDate')}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Jenis Kelamin</Text>
                  <View style={styles.genderRow}>
                    {GENDER_OPTIONS.map((option) => {
                      const isSelected = values.gender === option.value;
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[styles.genderOption, isSelected && styles.genderOptionSelected]}
                          onPress={() => setFieldValue('gender', option.value)}
                          activeOpacity={0.8}>
                          <Text
                            style={[
                              styles.genderOptionText,
                              isSelected && styles.genderOptionTextSelected,
                            ]}>
                            {option.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {renderError('gender')}
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Alamat</Text>
                  <TextInput
                    style={[
                      styles.input,
                      styles.inputMultiline,
                      showError('addressLine') && styles.inputError,
                    ]}
                    placeholder="Alamat sesuai KTP"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    textAlignVertical="top"
                    value={values.addressLine}
                    onChangeText={handleChange('addressLine')}
                    onBlur={handleBlur('addressLine')}
                  />
                  {renderError('addressLine')}
                </View>

                <Text style={styles.note}>
                  Nama terverifikasi akan menjadi nama pengirim di semua transfer kamu
                </Text>
              </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.buttonPrimary, isSubmitting && styles.buttonDisabled]}
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
                activeOpacity={0.85}>
                {isSubmitting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Submit Data</Text>
                )}
              </TouchableOpacity>
            </View>

            <AppBottomSheet
              isVisible={isDatePickerVisible}
              onClose={() => {
                setIsDatePickerVisible(false);
                setFieldTouched('birthDate', true);
              }}>
              <View style={styles.dateSheet}>
                <Text style={styles.dateSheetTitle}>Tanggal Lahir</Text>
                <View style={styles.datePickerContainer}>
                  <Picker
                    style={styles.datePickerDayColumn}
                    selectedValue={birthDay}
                    pickerData={availableDays}
                    onValueChange={(day: number | string) =>
                      setTempBirthDate(
                        clampBirthDate(birthYear, birthMonth, Number(day), today),
                      )
                    }
                    itemStyle={styles.datePickerItem}
                    selectionColor="#FFFFFF"
                    textColor="#1A1A1A"
                    selectTextColor="#1A1A1A"
                  />
                  <Picker
                    style={styles.datePickerMonthColumn}
                    selectedValue={birthMonth}
                    pickerData={availableMonths}
                    onValueChange={(month: number | string) =>
                      setTempBirthDate(
                        clampBirthDate(birthYear, Number(month), birthDay, today),
                      )
                    }
                    itemStyle={styles.datePickerItem}
                    selectionColor="#FFFFFF"
                    textColor="#1A1A1A"
                    selectTextColor="#1A1A1A"
                    numberOfLines={1}
                  />
                  <Picker
                    style={styles.datePickerYearColumn}
                    selectedValue={birthYear}
                    pickerData={years.map((value) => ({ label: String(value), value }))}
                    onValueChange={(year: number | string) =>
                      setTempBirthDate(
                        clampBirthDate(Number(year), birthMonth, birthDay, today),
                      )
                    }
                    itemStyle={styles.datePickerItem}
                    selectionColor="#FFFFFF"
                    textColor="#1A1A1A"
                    selectTextColor="#1A1A1A"
                  />
                </View>
                <TouchableOpacity
                  style={styles.buttonPrimary}
                  onPress={() => {
                    setFieldValue('birthDate', tempBirthDate);
                    setFieldTouched('birthDate', true, false);
                    setIsDatePickerVisible(false);
                  }}
                  activeOpacity={0.85}>
                  <Text style={styles.buttonText}>Pilih Tanggal</Text>
                </TouchableOpacity>
              </View>
            </AppBottomSheet>
          </View>
        );
      }}
    </Formik>
  );
};

export default ConfirmDataView;
