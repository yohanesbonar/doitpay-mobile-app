import { Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import SizedBox from '../../../components/SizedBox';
import { StackActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconNotification } from '../../../assets/icons/index.ts';
import { handleLogout } from '@/utils/Common/index.ts';

import { TransferLimitCard } from './components/TransferLimitCard.tsx';
import { BillCard } from './components/BillCard.tsx';
import { RecentActivityItem } from './components/RecentActivityItem.tsx';
import { RecentRecipient } from './components/RecentRecipient.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { UnprotectedAccount } from './components/UnprotectedAccount.tsx';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { EmailBottomsheet } from '@/components/molecules/EmailBottomsheet';
import { storage, StorageKey } from '../../../storage/index.ts';
import { CompleteAccountPopup } from '@/components/molecules/CompleteAccountPopup';

interface HomeViewProps {
  goToSearchAccount: () => void;
  onPressBack: () => void;
  goToBankAccounts: () => void;
}

export const HomeView = (props: HomeViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [isSheetMounted, setIsSheetMounted] = useState(false);
  const emailSheetRef = useRef<BottomSheetModal>(null);
  const [isAccountSheetMounted, setIsAccountSheetMounted] = useState(false);

  const handleOpenEmailSheet = useCallback(() => {
    setIsSheetMounted(true);

    requestAnimationFrame(() => {
      emailSheetRef.current?.present();
    });
  }, []);

  useEffect(() => {
    const hasShown = storage.getBoolean(StorageKey.HAS_SHOWN_COMPLETE_ACCOUNT_HOME);

    if (!hasShown) {
      handleOpenAccountSheet();

      storage.set(StorageKey.HAS_SHOWN_COMPLETE_ACCOUNT_HOME, true);
    }
  }, []);

  const handleOpenAccountSheet = useCallback(() => {
    setIsAccountSheetMounted(true);
  }, []);

  const handleGoToAddBank = () => {
    setIsAccountSheetMounted(false);
    storage.set(StorageKey.HAS_SHOWN_COMPLETE_ACCOUNT_HOME, true);
    props.goToBankAccounts();
  };

  const onCloseCompleteModal = () => {
    setIsAccountSheetMounted(false);
    storage.set(StorageKey.HAS_SHOWN_COMPLETE_ACCOUNT_HOME, true);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={[styles.headerContainer, { flex: 1 }]}>
        <View style={styles.headerWrapper}>
          <Image
            source={require('../../../assets/images/ic-doitpay-home.png')}
            style={{ width: 100, height: 30, resizeMode: 'contain' }}
          />
          <TouchableOpacity onPress={() => handleLogout()}>
            <IconNotification />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <UnprotectedAccount onPress={() => handleOpenEmailSheet()} isShow={true} />
          <View style={styles.dailyLimitWrapper}>
            <Text style={{ fontSize: 22, fontFamily: 'Switzer-Semibold' }}>
              {t('home.dailyLimitTransfer')}
            </Text>
            <TransferLimitCard usedAmount={500000} maxAmount={25000000} percentage={5} />
          </View>
          <View style={styles.mainWrapper}>
            <SearchBar onPress={props.goToSearchAccount} />
            <SizedBox height={20} />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <BillCard title="Bayar kos" accountInfo="Joni Wahyu  BCA ****3910" />
              <BillCard title="Tagihan Listrik" accountInfo="PLN  BCA ****3910" />
            </View>
            <SizedBox height={24} />
            <View style={{ marginRight: -24 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                {t('home.lastSend')}
              </Text>
              <RecentRecipient />
            </View>
            <SizedBox height={24} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
              {t('home.lastActivity')}
            </Text>
            <View style={{ paddingBottom: 75 }}>
              {[{}, {}, {}, {}].map((item, index) => (
                <RecentActivityItem
                  key={index}
                  initial="JW"
                  name="Joni Wahyu"
                  bank="BCA"
                  time="14:00 WIB"
                  amount="Rp 500,000"
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
      {isSheetMounted && (
        <EmailBottomsheet ref={emailSheetRef} onDismiss={() => setIsSheetMounted(false)} />
      )}
      {isAccountSheetMounted && (
        <CompleteAccountPopup
          onClose={onCloseCompleteModal}
          onAddAccount={handleGoToAddBank}
          withButtonClose={true}
        />
      )}
    </SafeAreaView>
  );
};
