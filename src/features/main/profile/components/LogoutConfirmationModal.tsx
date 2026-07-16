import React from 'react';
import { View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { X } from 'lucide-react-native';

interface LogoutConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDismiss?: () => void;
  styles: any;
  colors: any;
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  styles,
  colors,
  onDismiss,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      onDismiss={onDismiss}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Keluar dari Akun?</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <X size={20} color={colors.text || '#000'} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDescription}>
                Pastikan semua aktivitas kamu sudah selesai.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalButton, styles.btnBatal]} onPress={onClose}>
                  <Text style={styles.textBatal}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.btnKeluar]}
                  onPress={onConfirm}>
                  <Text style={styles.textKeluar}>Keluar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LogoutConfirmationModal;
