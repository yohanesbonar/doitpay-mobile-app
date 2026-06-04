import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface FilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  filters: { paymentType: string; transactionType: string };
  setFilters: (filters: any) => void;
}

export const FilterBottomSheet = ({
  isVisible,
  onClose,
  filters,
  setFilters,
}: FilterBottomSheetProps) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['75%'], []);
  const [isMounted, setIsMounted] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showTransactionOptions, setShowTransactionOptions] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTempFilters(filters);
      setShowPaymentOptions(false);
      setShowTransactionOptions(false);
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

  const paymentOptions = ['Semua', 'QRIS', 'Virtual Account'];
  const transactionOptions = ['Semua', 'Pengeluaran', 'Pemasukan'];

  const handleApply = () => {
    setFilters(tempFilters);
    onClose();
  };

  const renderDropdown = (
    label: string,
    options: string[],
    currentValue: string,
    isOpen: boolean,
    onToggle: () => void,
    onSelect: (val: string) => void,
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dropdownHeader, isOpen && styles.dropdownHeaderActive]}
        onPress={onToggle}
        activeOpacity={0.7}>
        <Text style={styles.dropdownText}>
          {currentValue === 'Semua'
            ? label === 'Tipe Pembayaran'
              ? 'QRIS/VA'
              : 'Pengeluaran / Pemasukan'
            : currentValue}
        </Text>
        {isOpen ? <ChevronUp size={20} color="#666" /> : <ChevronDown size={20} color="#666" />}
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.optionsContainer}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[styles.optionItem, currentValue === opt && styles.activeOptionItem]}
              onPress={() => {
                onSelect(opt);
                onToggle();
              }}>
              <Text style={[styles.optionText, currentValue === opt && styles.activeOptionText]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return isMounted ? (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      onDismiss={handleDismiss}
      handleIndicatorStyle={{ backgroundColor: '#E5E5E5', width: 40 }}>
      <BottomSheetView style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter</Text>
        </View>

        {renderDropdown(
          'Tipe Pembayaran',
          paymentOptions,
          tempFilters.paymentType,
          showPaymentOptions,
          () => setShowPaymentOptions(!showPaymentOptions),
          (val) => setTempFilters({ ...tempFilters, paymentType: val }),
        )}

        {renderDropdown(
          'Tipe Transaksi',
          transactionOptions,
          tempFilters.transactionType,
          showTransactionOptions,
          () => setShowTransactionOptions(!showTransactionOptions),
          (val) => setTempFilters({ ...tempFilters, transactionType: val }),
        )}

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyText}>Terapkan Filter</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  ) : null;
};

const styles = StyleSheet.create({
  sheet: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  filterSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FFF',
  },
  dropdownHeaderActive: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: '#E5E5E5',
  },
  dropdownText: {
    fontSize: 14,
    color: '#666',
  },
  optionsContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E5E5E5',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
  },
  activeOptionItem: {
    backgroundColor: '#D1E3FF',
  },
  optionText: {
    fontSize: 14,
    color: '#000',
  },
  activeOptionText: {
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#4F84F6',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  applyText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
