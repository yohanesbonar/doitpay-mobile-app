import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { PersonalDataFormValues } from '../../authEntry';

interface InputFullNameProps {
  styles: any;
}

const InputFullName: React.FC<InputFullNameProps> = ({ styles }) => {
  const { t } = useTranslation();

  const { handleChange, handleBlur, values, errors } = useFormikContext<PersonalDataFormValues>();

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <Text style={styles.titleStep}>{t('authEntry.personalDataTitle')}</Text>
      <Text style={styles.descStep}>{t('authEntry.descPersonalData')}</Text>

      <View style={styles.formWrapper}>
        <Text style={styles.label}>{t('authEntry.fullNameLabel')}</Text>

        <TextInput
          style={[styles.inputText, errors.fullName && styles.inputError]}
          placeholder={t('authEntry.fullNamePlaceholder')}
          placeholderTextColor="#A9A9A9"
          autoCapitalize="words"
          onChangeText={handleChange('fullName')}
          onBlur={handleBlur('fullName')}
          value={values.fullName}
          autoFocus
        />

        {errors.fullName && <Text style={styles.errorText}>{errors.fullName as string}</Text>}
      </View>
    </View>
  );
};

export default InputFullName;
