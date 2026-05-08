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
  onGoToBankList: () => void;
  accountData: any;
}

const SuccessBottomSheet = ({
  isVisible,
  onClose,
  onContinue,
  onGoToBankList,
  accountData,
}: SuccessBottomSheetProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.bottomSheet}>
              {/* Handle Bar untuk visual BottomSheet */}
              <View style={styles.handleBar} />

              <Text style={styles.successTitle}>{t('successBottomSheet.successAddAccount')}</Text>
              <Text style={styles.successSubtitle}>{t('successBottomSheet.readyToTransfer')}</Text>

              <View style={styles.cardRecipientSuccess}>
                <View style={styles.bankLogoContainer}>
                  <Image
                    source={require('../../../assets/images/ic-BCA.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.bankNameText}>
                    {accountData?.bank?.shortName ?? accountData?.bank?.name ?? ''}
                  </Text>
                  <Text style={styles.recipientNameText}>
                    {accountData?.accountHolderName ?? ''}
                  </Text>
                  <Text style={styles.accountNumberText}>{accountData?.accountNumber ?? ''}</Text>
                </View>
              </View>

              <View style={styles.footerButtons}>
                <Button
                  type="regular"
                  onPress={onGoToBankList}
                  title={t('successBottomSheet.continueToBankList') || 'Lanjut ke Rekening Bank'}
                  color={colors.buttonBlue}
                  textStyle={{ color: colors.white }}
                  style={styles.primaryButton}
                />

                {/* Tombol Sekunder: Lanjut ke Homepage */}
                <TouchableOpacity style={styles.secondaryButton} onPress={onContinue}>
                  <Text style={styles.secondaryButtonText}>
                    {t('successBottomSheet.continueToHomepage') || 'Lanjut ke Homepage'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SuccessBottomSheet;
