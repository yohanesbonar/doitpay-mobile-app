import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

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
  const [tempFilters, setTempFilters] = useState(filters);

  useEffect(() => {
    if (isVisible) {
      setTempFilters(filters);
    }
  }, [isVisible, filters]);

  const paymentOptions = ['Semua', 'QRIS', 'Virtual Account'];
  const transactionOptions = ['Semua', 'Pengeluaran', 'Pemasukan'];

  const handleApply = () => {
    setFilters(tempFilters);
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter</Text>
            <TouchableOpacity onPress={onClose}>
              <X color="#000" size={24} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Tipe Pembayaran</Text>
          <View style={styles.chipContainer}>
            {paymentOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, tempFilters.paymentType === opt && styles.activeChip]}
                onPress={() => setTempFilters({ ...tempFilters, paymentType: opt })}>
                <Text
                  style={[
                    styles.chipText,
                    tempFilters.paymentType === opt && styles.activeChipText,
                  ]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Tipe Transaksi</Text>
          <View style={styles.chipContainer}>
            {transactionOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.chip, tempFilters.transactionType === opt && styles.activeChip]}
                onPress={() => setTempFilters({ ...tempFilters, transactionType: opt })}>
                <Text
                  style={[
                    styles.chipText,
                    tempFilters.transactionType === opt && styles.activeChipText,
                  ]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyText}>Terapkan Filter</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold' },
  label: { fontSize: 14, color: '#666', marginBottom: 10, marginTop: 10 },
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  activeChip: { backgroundColor: '#0066FF', borderColor: '#0066FF' },
  chipText: { color: '#000' },
  activeChipText: { color: '#FFF' },
  applyButton: {
    backgroundColor: '#0066FF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  applyText: { color: '#FFF', fontWeight: 'bold' },
});
