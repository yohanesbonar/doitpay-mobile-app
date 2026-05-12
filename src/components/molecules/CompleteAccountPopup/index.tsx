import React from 'react';
import { X } from 'lucide-react-native';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles';
import Button from '../../../components/atoms/Button/index.tsx';
import { useTranslation } from 'react-i18next';

export const CompleteAccountPopup = ({
  isVisible,
  onClose,
  onAddAccount,
  withButtonClose = false,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.white }]}>
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <Text style={styles.title}>{t('completeAccountPopup.title')}</Text>
            {withButtonClose && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={colors.black} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.description}>{t('completeAccountPopup.desc')}</Text>

          <View style={styles.footer}>
            <Button
              type="regular"
              title={t('completeAccountPopup.addAccount')}
              onPress={onAddAccount}
              textColor="white"
              style={{ backgroundColor: colors.buttonBlue }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
