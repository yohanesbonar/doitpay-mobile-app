import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar/index.tsx';
import Button from '../../../components/atoms/Button/index.tsx';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { Formik } from 'formik';
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react-native';

interface BankListViewProps {
  onPressBack: () => void;
  onSelectBank: (bank: any) => void;
  onPressNext: (values: any) => void;
  isLoginState: boolean;
  fromTabBar: boolean;
}

export const BankListView = ({
  onPressBack,
  onSelectBank,
  onPressNext,
  isLoginState,
  fromTabBar,
}: BankListViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'kirim' | 'terima'>('kirim');

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
      <HeaderToolbar
        title={t('bankList.rekening')}
        onPressBack={onPressBack}
        titlePosition={fromTabBar ? 'left' : 'center'}
        titleStyle="normal"
      />
      <Formik initialValues={{ selectedBank: '', searchQuery: '' }} onSubmit={onPressNext}>
        {({ values, setFieldValue, handleSubmit }) => (
          <View style={{ flex: 1 }}>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'kirim' && styles.activeTab]}
                onPress={() => setActiveTab('kirim')}>
                <ArrowUpRight size={18} color={activeTab === 'kirim' ? '#FFF' : '#000'} />
                <Text style={[styles.tabText, activeTab === 'kirim' && styles.activeTabText]}>
                  Kirim
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabButton, activeTab === 'terima' && styles.activeTab]}
                onPress={() => setActiveTab('terima')}>
                <ArrowDownLeft size={18} color={activeTab === 'terima' ? '#FFF' : '#000'} />
                <Text style={[styles.tabText, activeTab === 'terima' && styles.activeTabText]}>
                  Terima
                </Text>
              </TouchableOpacity>
            </View>

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
                          setFieldValue('selectedBank', bank);
                          onSelectBank(bank);
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
                    setFieldValue('selectedBank', item);
                    onSelectBank(item);
                  }}>
                  <View style={styles.listLogoContainer}>
                    <Image source={item.logo} style={styles.logoList} resizeMode="contain" />
                  </View>
                  <Text style={styles.listText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listPadding}
            />

            {!fromTabBar && (
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
            )}
          </View>
        )}
      </Formik>
    </View>
  );
};
