import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar/index.tsx';
import Button from '../../../components/atoms/Button/index.tsx';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { Formik } from 'formik';
import { ArrowDownLeft, ArrowUpRight, Search } from 'lucide-react-native';
import { useBanks } from '@/hooks/useBankMutation.ts';
import FastImage from 'react-native-fast-image';
import { storage, StorageKey } from '@/storage/index.ts';
import { CompleteAccountPopup } from '@/components/molecules/CompleteAccountPopup/index.tsx';
import { useFocusEffect } from '@react-navigation/native';
import { useGetProfile } from '@/hooks/useMeMutation.ts';
import _ from 'lodash';
import { BankListSkeleton } from './BankListSkeleton.tsx';

interface BankListViewProps {
  onPressBack: () => void;
  onSelectBank: (bank: any, method: 'send' | 'receive') => void;
  onPressNext: (values: any) => void;
  isLoginState: boolean;
  fromTabBar: boolean;
  fromProfile: boolean;
  goToBankAccounts: () => void;
  goToRequestPayment: () => void;
}

export const BankListView = ({
  onPressBack,
  onSelectBank,
  onPressNext,
  isLoginState,
  fromTabBar,
  fromProfile,
  goToBankAccounts,
  goToRequestPayment,
}: BankListViewProps) => {
  console.log('BankListView Props:', {
    onPressBack,
    onSelectBank,
    onPressNext,
    isLoginState,
    fromTabBar,
    fromProfile,
    goToBankAccounts,
    goToRequestPayment,
  });
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  const [allBanks, setAllBanks] = useState<any[]>([]);
  const [popularBanks, setPopularBanks] = useState<any[]>([]);

  const { mutate: mutateBanks, isPending: isPendingBank } = useBanks();
  const [isAccountSheetMounted, setIsAccountSheetMounted] = useState(false);

  const { mutate: getProfile, isPending: isLoadingProfile } = useGetProfile();

  const fetchBanksFromApi = useCallback(
    (searchQuery: string) => {
      mutateBanks(
        { name: searchQuery.trim() },
        {
          onSuccess: (data) => {
            setAllBanks(data?.data?.all || []);
            setPopularBanks(data?.data?.popular || []);
          },
          onError: (error) => {
            console.error('Error fetching banks:', error);
          },
        },
      );
    },
    [mutateBanks],
  );

  const debouncedSearch = useCallback(
    _.debounce((text: string) => {
      fetchBanksFromApi(text);
    }, 500),
    [fetchBanksFromApi],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useFocusEffect(
    useCallback(() => {
      setActiveTab('send');
      fetchBanksFromApi('');

      getProfile(
        {},
        {
          onSuccess: (data) => {
            console.log('getProfile data', data);
            if (!data?.data?.hasBankAccount && !fromProfile) {
              setTimeout(() => {
                handleOpenAccountSheet();
              }, 500);
            }
          },
          onError: (error) => {
            console.log('getProfile error', error);
          },
        },
      );
    }, [fetchBanksFromApi, getProfile, fromProfile]),
  );

  useEffect(() => {
    const hasShown = storage.getBoolean(StorageKey.HAS_SHOWN_COMPLETE_ACCOUNT_BANK_LIST);
    if (!hasShown && !fromProfile) {
      storage.set(StorageKey.HAS_SHOWN_COMPLETE_ACCOUNT_BANK_LIST, true);
    }
  }, [fromProfile]);

  const handleOpenAccountSheet = useCallback(() => {
    setIsAccountSheetMounted(true);
  }, []);

  const handleGoToAddBank = () => {
    setIsAccountSheetMounted(false);
    goToBankAccounts();
  };

  const onCloseCompleteModal = () => {
    setIsAccountSheetMounted(false);
    onPressBack();
  };

  const onPressReceive = () => {
    setActiveTab('receive');
    setTimeout(() => {
      goToRequestPayment();
    }, 300);
  };

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title={t('bankList.rekening')}
        onPressBack={onPressBack}
        titlePosition={fromTabBar || fromProfile ? 'left' : 'center'}
        titleStyle="normal"
      />
      <Formik initialValues={{ selectedBank: '', searchQuery: '' }} onSubmit={onPressNext}>
        {({ values, setFieldValue, handleSubmit }) => {
          return (
            <View style={{ flex: 1 }}>
              {!fromProfile && (
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'send' && styles.activeTab]}
                    onPress={() => setActiveTab('send')}>
                    <ArrowUpRight size={18} color={activeTab === 'send' ? '#FFF' : '#000'} />
                    <Text style={[styles.tabText, activeTab === 'send' && styles.activeTabText]}>
                      Kirim
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'receive' && styles.activeTab]}
                    onPress={() => onPressReceive()}>
                    <ArrowDownLeft size={18} color={activeTab === 'receive' ? '#FFF' : '#000'} />
                    <Text style={[styles.tabText, activeTab === 'receive' && styles.activeTabText]}>
                      Terima
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.searchContainer}>
                <Search size={20} color="#A9A9A9" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder={t('bankList.nameBankAccount')}
                  value={values.searchQuery}
                  onChangeText={(text) => {
                    setFieldValue('searchQuery', text);
                    debouncedSearch(text);
                  }}
                />
              </View>

              {isPendingBank ? (
                <BankListSkeleton styles={styles} t={t} />
              ) : (
                <FlatList
                  data={allBanks}
                  keyExtractor={(item, index) => index.toString()}
                  ListHeaderComponent={
                    <View>
                      {popularBanks.length > 0 && (
                        <Text style={[styles.sectionTitle, { marginTop: 2 }]}>
                          {t('bankList.populerBank')}
                        </Text>
                      )}
                      <View style={styles.gridContainer}>
                        {popularBanks.map((bank, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.gridBox,
                              values.selectedBank === bank.id && styles.selectedBox,
                            ]}
                            onPress={() => {
                              setFieldValue('selectedBank', bank);
                              onSelectBank(bank, activeTab);
                            }}>
                            <FastImage
                              style={styles.logoGrid}
                              source={{
                                uri: bank?.logoUrl,
                                priority: FastImage.priority.normal,
                                cache: FastImage.cacheControl.immutable,
                              }}
                              resizeMode={FastImage.resizeMode.contain}
                            />
                          </TouchableOpacity>
                        ))}
                      </View>
                      {allBanks.length > 0 && (
                        <Text style={styles.sectionTitle}>{t('bankList.allBank')}</Text>
                      )}
                    </View>
                  }
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => {
                        setFieldValue('selectedBank', item);
                        onSelectBank(item, activeTab);
                      }}>
                      <View style={styles.listLogoContainer}>
                        <FastImage
                          style={styles.logoList}
                          source={{
                            uri: item?.logoUrl,
                            priority: FastImage.priority.normal,
                            cache: FastImage.cacheControl.immutable,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      </View>
                      <Text style={styles.listText} numberOfLines={2} ellipsizeMode="tail">
                        {item?.shortName}
                      </Text>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.listPadding}
                />
              )}

              {!fromTabBar && !fromProfile && (
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
              {isAccountSheetMounted && (
                <CompleteAccountPopup
                  onClose={onCloseCompleteModal}
                  onAddAccount={handleGoToAddBank}
                  withButtonClose={true}
                />
              )}
            </View>
          );
        }}
      </Formik>
    </View>
  );
};

export default BankListView;
