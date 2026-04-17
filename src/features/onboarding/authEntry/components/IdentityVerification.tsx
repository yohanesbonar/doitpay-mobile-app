import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { CreditCard, Sun, User, AlertCircle } from 'lucide-react-native';

interface IdentityVerificationProps {
  styles: any;
  onVerifyNow: () => void;
  onMaybeLater: () => void;
}

const IdentityVerification = ({ styles, onVerifyNow, onMaybeLater }: IdentityVerificationProps) => {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <Text style={styles.titleStep}>{t('authEntry.identityVerification')}</Text>
      <Text style={styles.descStep}>
        {t('authEntry.descIdentityVerification')}{' '}
        <Text style={styles.boldText}>{t('authEntry.descIdentityVerification2')}</Text>
      </Text>

      <TouchableOpacity style={[styles.cardVerif, styles.activeCardVerif]} onPress={onVerifyNow}>
        <View style={[styles.iconBoxVerif, styles.blueIconBoxVerif]}>
          <CreditCard color="#FFF" size={24} />
        </View>
        <View style={styles.cardTextContentVerif}>
          <Text style={styles.cardTitleVerif}>{t('authEntry.verifyNow')}</Text>
          <Text style={styles.cardSubtitleVerif}>{t('authEntry.idCardSelfie')}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cardVerif} onPress={onMaybeLater}>
        <View style={[styles.iconBoxVerif, styles.yellowIconBoxVerif]}>
          <AlertCircle color="#EAB308" size={24} />
        </View>
        <View style={styles.cardTextContentVerif}>
          <Text style={styles.cardTitleVerif}>{t('authEntry.maybeLater')}</Text>
          <Text style={styles.cardSubtitleVerif}>{t('authEntry.limitDaily')}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.infoContainerVerif}>
        <Text style={styles.infoTitleVerif}>{t('authEntry.thingsToPrepare')}</Text>
        <View style={styles.infoRowVerif}>
          <CreditCard color="#666" size={22} style={styles.infoIconVerif} />
          <Text style={styles.infoTextVerif}>{t('authEntry.originalIDCard')}</Text>
        </View>
        <View style={styles.infoRowVerif}>
          <Sun color="#666" size={22} style={styles.infoIconVerif} />
          <Text style={styles.infoTextVerif}>{t('authEntry.lightRoom')}</Text>
        </View>
        <View style={styles.infoRowVerif}>
          <User color="#666" size={22} style={styles.infoIconVerif} />
          <Text style={styles.infoTextVerif}>{t('authEntry.clearFace')}</Text>
        </View>
      </View>
    </View>
  );
};

export default IdentityVerification;
