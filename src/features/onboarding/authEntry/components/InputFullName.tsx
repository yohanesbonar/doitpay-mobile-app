import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { Dropdown } from 'react-native-element-dropdown';
import { PersonalDataFormValues } from '../../authEntry';
import { useOccupationOptions } from '../../../../hooks/useOccupationQuery';

interface InputFullNameProps {
  styles: any;
  onPersonalDataChange: (data: { fullName: string; occupationId: string }) => void;
}

const InputFullName: React.FC<InputFullNameProps> = ({ styles, onPersonalDataChange }) => {
  const { t } = useTranslation();

  const { handleChange, handleBlur, setFieldValue, values, errors } =
    useFormikContext<PersonalDataFormValues>();

  const { data: occupationResponse, isLoading, isError, refetch } = useOccupationOptions();

  const occupationOptions = (occupationResponse?.data?.items ?? []).map((item) => ({
    label: item.name,
    value: String(item.id),
  }));

  React.useEffect(() => {
    onPersonalDataChange({
      fullName: values.fullName,
      occupationId: values.occupationId,
    });
  }, [onPersonalDataChange, values.fullName, values.occupationId]);

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

      <View style={styles.formWrapper}>
        <Text style={styles.label}>{t('authEntry.occupationLabel')}</Text>

        <Dropdown
          style={[styles.occupationDropdown, errors.occupationId && styles.inputError]}
          containerStyle={styles.occupationDropdownContainer}
          placeholderStyle={styles.occupationPlaceholder}
          selectedTextStyle={styles.occupationSelectedText}
          itemTextStyle={styles.occupationItemText}
          data={occupationOptions}
          labelField="label"
          valueField="value"
          value={values.occupationId}
          disable={isLoading}
          maxHeight={300}
          placeholder={
            isLoading
              ? t('authEntry.loadingOccupation')
              : t('authEntry.occupationPlaceholder')
          }
          onChange={(item) => setFieldValue('occupationId', item.value)}
        />

        {errors.occupationId && <Text style={styles.errorText}>{errors.occupationId as string}</Text>}

        {isError && (
          <View style={styles.occupationErrorRow}>
            <Text style={styles.occupationErrorText}>{t('authEntry.occupationLoadError')}</Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={styles.occupationRetryText}>{t('authEntry.retry')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default InputFullName;
