import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

interface UpdateAppBottomSheetProps {
  visible: boolean;
  onUpdatePress: () => void;
}

export const UpdateAppBottomSheet = ({ visible, onUpdatePress }: UpdateAppBottomSheetProps) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.sheetContainer}>
        <Text style={styles.title}>Perbarui Aplikasi untuk Melanjutkan</Text>
        <Text style={styles.description}>
          Versi aplikasi yang Anda gunakan sudah tidak didukung. Silakan update Doitpay ke versi
          terbaru
        </Text>

        <TouchableOpacity style={styles.updateButton} onPress={onUpdatePress} activeOpacity={0.85}>
          <Text style={styles.updateButtonText}>Update Aplikasi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
