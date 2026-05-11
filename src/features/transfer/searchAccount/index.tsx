import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar';
import Input from '../../../components/atoms/Input';
import FastImage from 'react-native-fast-image';
import { useBankInquiry } from '@/hooks/useBankMutation';
import { ChevronRight } from 'lucide-react-native';

interface SearchAccountViewProps {
  onPressBack: () => void;
  goToTransferDetail: (params: { bankData: any; accountData: any }) => void;
}

const SearchAccountView = ({ onPressBack, goToTransferDetail }: SearchAccountViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const { mutate: performInquiry, isPending } = useBankInquiry();

  const handleSearch = (values: { query: string }) => {
    console.log('Searching for:', values.query);
    //temporary mock search result, replace with actual API call

    // setSearchResults(mockSearchResults);
  };

  const mockSearchResults = [
    {
      id: 1,
      bankData: {
        shortName: 'Bank ABC',
        logoUrl: null,
      },
      accountData: { accountHolderName: 'John Doe', accountNumber: '1234567890' },
    },
    {
      id: 2,
      bankData: {
        shortName: 'Bank XYZ',
        logoUrl: null,
      },
      accountData: {
        accountHolderName: 'Brown Smith',
        accountNumber: '98765439210',
      },
    },
    {
      id: 3,
      bankData: {
        shortName: 'Bank DFG',
        logoUrl: null,
      },
      accountData: {
        accountHolderName: 'Jane Smith',
        accountNumber: '9876543210',
      },
    },
  ];

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        goToTransferDetail({ bankData: item.bankData, accountData: item.accountData })
      }>
      <View style={styles.listLogoContainer}>
        <FastImage
          style={styles.logo}
          source={
            item.bankData?.logoUrl
              ? { uri: item.bankData?.logoUrl }
              : require('../../../assets/images/ic-BCA.png')
          }
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{item.accountData.accountHolderName}</Text>
        <Text style={styles.accountInfo}>
          {item.bankData?.shortName} {item.accountData.accountNumber}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title={t('searchAccount.searchName')}
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="Regular"
      />

      <View style={styles.content}>
        <Text style={styles.labelInput}>{t('searchAccount.labelName') || 'Nama'}</Text>
        <Formik initialValues={{ query: '' }} onSubmit={handleSearch}>
          {(formikProps) => (
            <Input
              showClearIcon={true}
              placeholder={t('searchAccount.searchName')}
              value={formikProps.values.query}
              onChangeText={(text) => {
                formikProps.setFieldValue('query', text);
                // if (showResult) setShowResult(false);
              }}
              onPressClear={() => formikProps.setFieldValue('query', '')}
              returnKeyType="search"
              onSubmitEditing={() => formikProps.handleSubmit()}
            />
          )}
        </Formik>

        <FlatList
          data={mockSearchResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listPadding}
        />
      </View>
    </View>
  );
};

export default SearchAccountView;
