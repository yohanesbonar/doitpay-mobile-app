import React from 'react';
import { View, Text, TextInput, Image, FlatList } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';

interface BankAccountFormProps {
  handleChange: (field: string) => any;
  handleBlur: (field: string) => any;
  values: { accountNumber: string };
  errors: any;
  touched: any;
  showResult: boolean;
  searchData: any[];
}

const BankAccountForm = ({
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
  showResult,
  searchData,
}: BankAccountFormProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const renderRecipientItem = ({ item }: { item: any }) => (
    <View style={styles.cardRecipientBankAccount}>
      <View style={styles.bankLogoContainer}>
        <Image
          source={require('../../../assets/images/ic-BCA.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text style={styles.recipientName}>{item.ownerName}</Text>
        <Text style={styles.bankDetails}>
          {item.bankName} {item.accountNumber}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.label}>{t('bankAccountForm.accountNumber')}</Text>
        <TextInput
          style={[styles.input, touched.accountNumber && errors.accountNumber && styles.inputError]}
          placeholder={t('bankAccountForm.8DigitAccountNumber')}
          keyboardType="number-pad"
          onChangeText={handleChange('accountNumber')}
          onBlur={handleBlur('accountNumber')}
          value={values.accountNumber}
        />
        {touched.accountNumber && errors.accountNumber && (
          <Text style={styles.errorText}>{errors.accountNumber}</Text>
        )}
        {showResult && !errors.accountNumber && (
          <FlatList
            data={searchData}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipientItem}
            contentContainerStyle={{}}
            style={{ marginTop: 22 }}
          />
        )}
      </View>
    </View>
  );
};

export default BankAccountForm;
