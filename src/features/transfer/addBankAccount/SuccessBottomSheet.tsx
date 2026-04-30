import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import Button from '../../../components/atoms/Button/index.tsx';
import { useTranslation } from 'react-i18next';

interface SuccessBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const SuccessBottomSheet = ({ isVisible, onClose, onContinue }: SuccessBottomSheetProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.bottomSheet}>
              <Text style={styles.successTitle}>{t('successBottomSheet.successAddAccount')}</Text>
              <Text style={styles.successSubtitle}>{t('successBottomSheet.readyToTransfer')}</Text>

              <View style={[styles.cardRecipient, { borderColor: '#E0E0E0' }]}>
                <View style={styles.bankLogoContainer}>
                  <Image
                    source={require('../../../assets/images/ic-BCA.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.recipientName}>Bank BCA</Text>
                  <Text style={styles.bankDetails}>Prabu Suwito</Text>
                  <Text style={styles.bankDetails}>0498374820</Text>
                </View>
              </View>

              <View style={{ marginTop: 'auto', paddingTop: 20 }}>
                <Button
                  type="regular"
                  onPress={onContinue}
                  title={t('successBottomSheet.continueToHomepage')}
                  style={{
                    borderWidth: 1,
                    borderColor: '#D4D4D4',
                  }}
                  textStyle={{ color: colors.white }}
                  color={colors.buttonBlue}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SuccessBottomSheet;
