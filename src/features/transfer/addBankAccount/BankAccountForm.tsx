import React, { useEffect } from 'react';
import { View, Text, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';

interface BankAccountFormProps {
  setFieldValue: (field: string, value: any) => void;
  handleChange: (field: string) => any;
  handleBlur: (field: string) => any;
  values: { accountNumber: string };
  errors: any;
  touched: any;
  showResult: boolean;
  searchData: any[];
  onSelectItem: (item: any) => void;
  selectedId: string | null;
}

const BankAccountForm = ({
  setFieldValue,
  handleChange,
  handleBlur,
  values,
  errors,
  touched,
  showResult,
  searchData,
  onSelectItem,
  selectedId,
}: BankAccountFormProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const handleAccountNumberChange = (text: string) => {
    const numericValue = text.replace(/\D/g, '').slice(0, 16);
    setFieldValue('accountNumber', numericValue);
  };

  const renderRecipientItem = ({ item }: { item: any }) => {
    const isSelected = item.id === selectedId;
    console.log('Rendering item:', item, 'Selected ID:', selectedId, 'Is Selected:', isSelected);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onSelectItem(item)}
        style={[
          styles.cardRecipientBankAccount,
          {
            borderColor: isSelected ? colors.buttonBlue : '#F0F0F0',
            borderWidth: isSelected ? 1.5 : 1,
            backgroundColor: isSelected ? '#F0F5FF' : '#FFF',
          },
        ]}>
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
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.content}>
        <Text style={styles.label}>{t('bankAccountForm.accountNumber')}</Text>
        <TextInput
          style={[styles.input, touched.accountNumber && errors.accountNumber && styles.inputError]}
          placeholder={t('bankAccountForm.8DigitAccountNumber')}
          keyboardType="number-pad"
          onChangeText={handleAccountNumberChange}
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
            extraData={selectedId}
          />
        )}
      </View>
    </View>
  );
};

export default BankAccountForm;
