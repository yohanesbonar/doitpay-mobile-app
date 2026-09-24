import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Picker } from 'react-native-wheel-pick';

interface DateBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDate: { month: number; year: number };
  onSelect: (date: { month: number; year: number }) => void;
}

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

const PICKER_TEXT_COLOR = Platform.OS === 'ios' ? '#1A1A1A' : '#D1D1D1';

export const DateBottomSheet = ({
  isVisible,
  onClose,
  selectedDate,
  onSelect,
}: DateBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['55%'], []);
  const [tempDate, setTempDate] = useState(selectedDate);

  const [isSheetSettled, setIsSheetSettled] = useState(false);
  const [pickerSession, setPickerSession] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setTempDate(selectedDate);
      bottomSheetRef.current?.present();
    }
  }, [isVisible]);

  const handleSheetChange = useCallback((index: number) => {
    setIsSheetSettled(index >= 0);
  }, []);

  const handleDismiss = () => {
    setIsSheetSettled(false);
    setPickerSession((session) => session + 1);
    onClose();
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    [],
  );

  const handleConfirm = () => {
    onSelect(tempDate);
    bottomSheetRef.current?.dismiss();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      onChange={handleSheetChange}
      onDismiss={handleDismiss}
      handleIndicatorStyle={{ backgroundColor: '#E5E5E5', width: 40 }}>
      <BottomSheetView style={styles.sheet}>
        <Text style={styles.title}>Bulan</Text>

        <View style={styles.pickerContainer}>
          {isSheetSettled ? (
            <>
              <Picker
                key={`month-${pickerSession}`}
                style={styles.pickerColumn}
                selectedValue={tempDate.month}
                pickerData={MONTHS}
                onValueChange={(value: any) => setTempDate({ ...tempDate, month: value })}
                textColor={PICKER_TEXT_COLOR}
                selectTextColor="#1A1A1A"
              />

              <Picker
                key={`year-${pickerSession}`}
                style={styles.pickerColumn}
                selectedValue={tempDate.year}
                pickerData={YEARS}
                onValueChange={(value: any) => setTempDate({ ...tempDate, year: value })}
                textColor={PICKER_TEXT_COLOR}
                selectTextColor="#1A1A1A"
              />
            </>
          ) : (
            <>
              <View style={styles.pickerColumn} />
              <View style={styles.pickerColumn} />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Pilih Tanggal</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
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
    height: 200,
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
