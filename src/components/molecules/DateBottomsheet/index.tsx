import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Picker } from 'react-native-wheel-pick';

interface DateBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: { month: number; year: number };
  onSelect: (date: { month: number; year: number }) => void;
}

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
  }, [isVisible, selectedDate]);

  const months = [
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

  const years = [2024, 2025, 2026].map((y) => ({ label: y.toString(), value: y }));

  const handleConfirm = () => {
    onSelect(tempDate);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.indicator} />
          <Text style={styles.title}>Bulan</Text>

          <View style={styles.pickerContainer}>
            <Picker
              style={styles.pickerColumn}
              selectedValue={tempDate.month}
              pickerData={months}
              onValueChange={(value: any) => setTempDate({ ...tempDate, month: value })}
              textColor="#D1D1D1"
              selectTextColor="#1A1A1A"
              itemSpace={45}
            />

            <Picker
              style={styles.pickerColumn}
              selectedValue={tempDate.year}
              pickerData={years}
              onValueChange={(value: any) => setTempDate({ ...tempDate, year: value })}
              textColor="#D1D1D1"
              selectTextColor="#1A1A1A"
              itemSpace={45}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.buttonText}>Pilih Tanggal</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    alignItems: 'center',
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    marginBottom: 20,
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
    height: 200,
    justifyContent: 'center',
  },
  pickerColumn: {
    flex: 1,
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
