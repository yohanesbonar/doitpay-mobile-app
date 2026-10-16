import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Picker } from 'react-native-wheel-pick';
import { AppBottomSheet } from '@/components/molecules/AppBottomSheet';

interface DateBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: { month: number; year: number };
  onSelect: (date: { month: number; year: number }) => void;
}

const PICKER_HEIGHT = 220;

const MONTHS = [
  { label: 'Januari', value: 0 },
  { label: 'Februari', value: 1 },
  { label: 'Maret', value: 2 },
  { label: 'April', value: 3 },
  { label: 'Mei', value: 4 },
  { label: 'Juni', value: 5 },
  { label: 'Juli', value: 6 },
  { label: 'Agustus', value: 7 },
  { label: 'September', value: 8 },
  { label: 'Oktober', value: 9 },
  { label: 'November', value: 10 },
  { label: 'Desember', value: 11 },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 3 }, (_, index) => currentYear - 2 + index).map((year) => ({
  label: year.toString(),
  value: year,
}));

// Di iOS, Picker ini memakai UIPickerView yang mewarnai semua baris dengan
// `textColor` dan tidak mengenal `selectTextColor` (prop itu Android-only),
// jadi #D1D1D1 membuat seluruh isi picker nyaris tidak terbaca di atas putih.
const PICKER_TEXT_COLOR = Platform.OS === 'ios' ? '#1A1A1A' : '#D1D1D1';

export const DateBottomSheet = ({
  isVisible,
  onClose,
  selectedDate,
  onSelect,
}: DateBottomSheetProps) => {
  const [tempDate, setTempDate] = useState(selectedDate);

  useEffect(() => {
    if (isVisible) {
      setTempDate(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleConfirm = () => {
    onSelect(tempDate);
    onClose();
  };

  return (
    <AppBottomSheet isVisible={isVisible} onClose={onClose}>
      <View style={styles.sheet}>
        <Text style={styles.title}>Bulan</Text>

        <View style={styles.pickerContainer}>
          <Picker
            style={styles.pickerColumn}
            selectedValue={tempDate.month}
            pickerData={MONTHS}
            onValueChange={(month: any) => setTempDate((current) => ({ ...current, month }))}
            textColor={PICKER_TEXT_COLOR}
            selectTextColor="#1A1A1A"
          />

          <Picker
            style={styles.pickerColumn}
            selectedValue={tempDate.year}
            pickerData={YEARS}
            onValueChange={(year: any) => setTempDate((current) => ({ ...current, year }))}
            textColor={PICKER_TEXT_COLOR}
            selectTextColor="#1A1A1A"
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Pilih Tanggal</Text>
        </TouchableOpacity>
      </View>
    </AppBottomSheet>
  );
};

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Switzer-Bold',
    color: '#1A1A1A',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    width: '100%',
    // Tinggi dikunci dan disamakan dengan tiap kolom. Versi lama memberi
    // container 200 tapi picker-nya 220, jadi ukurannya saling bertabrakan.
    height: PICKER_HEIGHT,
    justifyContent: 'center',
  },
  pickerColumn: {
    flex: 1,
    height: PICKER_HEIGHT,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#4A81FB',
    width: '100%',
    padding: 16,
    borderRadius: 30,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Switzer-Semibold',
  },
});
