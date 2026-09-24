import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppBottomSheet } from '@/components/molecules/AppBottomSheet';
import { WheelPicker, type WheelPickerItem } from '@/components/molecules/WheelPicker';

interface DateBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: { month: number; year: number };
  onSelect: (date: { month: number; year: number }) => void;
}

const MONTHS: WheelPickerItem[] = [
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
const YEARS: WheelPickerItem[] = Array.from(
  { length: 3 },
  (_, index) => currentYear - 2 + index,
).map((year) => ({ label: year.toString(), value: year }));

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
          <WheelPicker
            style={styles.pickerColumn}
            data={MONTHS}
            selectedValue={tempDate.month}
            onValueChange={(month) => setTempDate((current) => ({ ...current, month }))}
          />

          <WheelPicker
            style={styles.pickerColumn}
            data={YEARS}
            selectedValue={tempDate.year}
            onValueChange={(year) => setTempDate((current) => ({ ...current, year }))}
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
    justifyContent: 'center',
  },
  pickerColumn: {
    flex: 1,
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
