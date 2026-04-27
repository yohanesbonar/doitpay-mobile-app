import React from 'react';
import { View, Text, TextInput, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { PhoneNumberFormValues } from '../../authEntry';

interface InputPhoneNumberProps {
  styles: any;
}

const InputPhoneNumber: React.FC<InputPhoneNumberProps> = ({ styles }) => {
  const { t } = useTranslation();

  const { handleChange, handleBlur, setFieldValue, values, errors } =
    useFormikContext<PhoneNumberFormValues>();

  const countryData = [
    {
      label: 'Indonesia (+62)',
      value: '+62',
      flag: require('../../../../assets/images/ic-indonesia-flag.png'),
    },
  ];

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <Text style={styles.titleStep}>{t('authEntry.enterPhoneNumber')}</Text>
      <Text style={styles.descStep}>{t('authEntry.descEnterPhoneNumber')}</Text>

      <View style={styles.formWrapper}>
        <Text style={styles.label}>{t('authEntry.phoneNumberLabel')}</Text>

        <View style={styles.inputGroup}>
          <Dropdown
            style={styles.dropdown}
            containerStyle={styles.dropdownContainer}
            data={countryData}
            search
            searchPlaceholder="Search"
            labelField="value"
            valueField="value"
            value={values.countryCode}
            onChange={(item) => setFieldValue('countryCode', item.value)}
            renderLeftIcon={() => (
              <View>
                <Image
                  source={require('../../../../assets/images/ic-indonesia-flag.png')}
                  style={{ marginRight: 5 }}
                />
              </View>
            )}
            renderItem={(item) => (
              <View style={styles.item}>
                <Image source={item.flag} />
                <Text style={styles.itemText}>{item.label}</Text>
              </View>
            )}
          />

          <TextInput
            style={[styles.input, errors.phoneNumber && styles.inputError]}
            placeholder="Value"
            placeholderTextColor="#A9A9A9"
            keyboardType="phone-pad"
            onChangeText={handleChange('phoneNumber')}
            onBlur={handleBlur('phoneNumber')}
            value={values.phoneNumber}
            autoFocus
          />
        </View>

        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber as string}</Text>}
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          {t('authEntry.descTerms1')} <Text style={styles.link}>{t('authEntry.descTerms2')}</Text>{' '}
          {t('authEntry.descTerms3')} <Text style={styles.link}>{t('authEntry.descTerms4')}</Text>{' '}
          {t('authEntry.descTerms5')}
        </Text>
      </View>
    </View>
  );
};

export default InputPhoneNumber;
