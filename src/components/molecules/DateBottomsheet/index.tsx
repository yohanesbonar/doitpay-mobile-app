import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
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
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);
  const [isMounted, setIsMounted] = useState(false);
  const [tempDate, setTempDate] = useState(selectedDate);

  useEffect(() => {
    if (isVisible) {
      setTempDate(selectedDate);
      setIsMounted(true);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isMounted) {
      requestAnimationFrame(() => {
        bottomSheetRef.current?.present();
      });
    }
  }, [isMounted]);

  const handleDismiss = () => {
    setIsMounted(false);
    onClose();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

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
    bottomSheetRef.current?.dismiss();
  };

  return isMounted ? (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
      handleIndicatorStyle={{ backgroundColor: '#E5E5E5', width: 40 }}>
      <BottomSheetView style={styles.sheet}>
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
      </BottomSheetView>
    </BottomSheetModal>
  ) : null;
};

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 4,
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
