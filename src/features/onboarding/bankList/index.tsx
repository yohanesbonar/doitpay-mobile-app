import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { createStyles } from './styles';
import { useTranslation } from 'react-i18next';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar';
import Button from '../../../components/atoms/Button/index.tsx';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { Formik } from 'formik';
import { Search } from 'lucide-react-native';

interface BankListViewProps {
  onPressBack: (values: any) => void;
  onSelectBank: (id: string) => void;
  onPressNext: (values: any) => void;
  isLoginState: boolean;
}

export const BankListView = ({
  onPressBack,
  onSelectBank,
  onPressNext,
  isLoginState,
}: BankListViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const POPULAR_BANKS = [
    { id: '1', name: 'blu', logo: require('../../../assets/images/ic-BCA.png') },
    { id: '2', name: 'BCA', logo: require('../../../assets/images/ic-BCA.png') },
    { id: '3', name: 'BRI', logo: require('../../../assets/images/ic-BCA.png') },
    { id: '4', name: 'BNI', logo: require('../../../assets/images/ic-BCA.png') },
    { id: '5', name: 'blu', logo: require('../../../assets/images/ic-BCA.png') },
    { id: '6', name: 'BCA', logo: require('../../../assets/images/ic-BCA.png') },
    { id: '7', name: 'BRI', logo: require('../../../assets/images/ic-BCA.png') },
    { id: '8', name: 'BNI', logo: require('../../../assets/images/ic-BCA.png') },
  ];

  const ALL_BANKS = [
    { id: 'bca', name: 'Bank Central Asia', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'blu', name: 'Blu BCA Digital', logo: require('../../../assets/images/ic-BCA.png') },
    {
      id: 'bsi',
      name: 'Bank Syariah Indonesia',
      logo: require('../../..//assets/images/ic-BCA.png'),
    },
    { id: 'mandiri', name: 'Mandiri', logo: require('../../..//assets/images/ic-BCA.png') },
    { id: 'bca', name: 'Bank Central Asia', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'blu', name: 'Blu BCA Digital', logo: require('../../../assets/images/ic-BCA.png') },
    {
      id: 'bsi',
      name: 'Bank Syariah Indonesia',
      logo: require('../../../assets/images/ic-BCA.png'),
    },
    { id: 'mandiri', name: 'Mandiri', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'bca', name: 'Bank Central Asia', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'blu', name: 'Blu BCA Digital', logo: require('../../../assets/images/ic-BCA.png') },
    {
      id: 'bsi',
      name: 'Bank Syariah Indonesia',
      logo: require('../../../assets/images/ic-BCA.png'),
    },
    { id: 'mandiri', name: 'Mandiri', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'bca', name: 'Bank Central Asia', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'blu', name: 'Blu BCA Digital', logo: require('../../../assets/images/ic-BCA.png') },
    {
      id: 'bsi',
      name: 'Bank Syariah Indonesia',
      logo: require('../../../assets/images/ic-BCA.png'),
    },
    { id: 'mandiri', name: 'Mandiri', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'bca', name: 'Bank Central Asia', logo: require('../../../assets/images/ic-BCA.png') },
    { id: 'blu', name: 'Blu BCA Digital', logo: require('../../../assets/images/ic-BCA.png') },
    {
      id: 'bsi',
      name: 'Bank Syariah Indonesia',
      logo: require('../../../assets/images/ic-BCA.png'),
    },
    { id: 'mandiri', name: 'Mandiri', logo: require('../../../assets/images/ic-BCA.png') },
  ];

  return (
    <View style={styles.container}>
      <HeaderToolbar title={t('bankList.rekening')} onPressBack={onPressBack} />
      <Formik initialValues={{ selectedBank: '', searchQuery: '' }} onSubmit={onPressNext}>
        {({ values, setFieldValue, handleSubmit }) => (
          <View style={{ flex: 1 }}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#A9A9A9" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('bankList.nameBankAccount')}
                value={values.searchQuery}
                onChangeText={(text) => setFieldValue('searchQuery', text)}
              />
            </View>

            <FlatList
              data={ALL_BANKS}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={
                <View>
                  <Text style={[styles.sectionTitle, { marginTop: 10 }]}>
                    {t('bankList.populerBank')}
                  </Text>
                  <View style={styles.gridContainer}>
                    {POPULAR_BANKS.map((bank, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.gridBox,
                          values.selectedBank === bank.id && styles.selectedBox,
                        ]}
                        onPress={() => {
                          setFieldValue('selectedBank', bank.id);
                          onSelectBank(bank.id); // Panggil fungsi navigasi dari props
                        }}>
                        <Image source={bank.logo} style={styles.logoGrid} resizeMode="contain" />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={styles.sectionTitle}>{t('bankList.allBank')}</Text>
                </View>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => {
                    setFieldValue('selectedBank', item.id);
                    onSelectBank(item.id);
                  }}>
                  <View style={styles.listLogoContainer}>
                    <Image source={item.logo} style={styles.logoList} resizeMode="contain" />
                  </View>
                  <Text style={styles.listText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listPadding}
            />

            <View style={styles.footer}>
              <Button
                type="regular"
                onPress={handleSubmit}
                title={t('bankList.next')}
                style={{ borderWidth: 1, borderColor: '#D4D4D4' }}
                color={colors.white}
                textColor="black"
              />
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};
