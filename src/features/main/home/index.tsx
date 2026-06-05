import { Image, Text, View, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../theme/ThemeProvider.tsx';
import { createStyles } from './styles.ts';
import { useTranslation } from 'react-i18next';
import SizedBox from '../../../components/SizedBox';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TransferLimitCard } from './components/TransferLimitCard.tsx';
import { RecentActivityItem } from './components/RecentActivityItem.tsx';
import { RecentRecipient } from './components/RecentRecipient.tsx';
import { SearchBar } from './components/SearchBar.tsx';
import { UnprotectedAccount } from './components/UnprotectedAccount.tsx';
import { DeletionInProgressBanner } from './components/DeletionInProgressBanner.tsx';
import { RecentActivitySkeleton, RecentBeneficiarySkeleton } from './components/HomeSkeletons.tsx';
import { NotificationIconWithBadge } from '@/components/molecules/NotificationIconWithBadge';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { EmailBottomsheet } from '@/components/molecules/EmailBottomsheet';
import { storage, StorageKey } from '../../../storage/index.ts';
import { CompleteAccountPopup } from '@/components/molecules/CompleteAccountPopup';
import { useAuthStore } from '@/storage/useAuthStore.ts';
import { useGetHomeAggregateQuery } from './hooks/useGetHomeAggregateQuery.ts';
import { useGetProfile } from '@/hooks/useMeMutation.ts';
import { useGetProfileMeQuery } from '@/features/user/hooks/useGetProfileMeQuery.ts';
import LogoDoitpay from '@/assets/icons/ic-logo.svg';
import EmptyHomeIcon from '@/assets/icons/ic-empty-home.svg';

interface HomeViewProps {
  goToSearchAccount: () => void;
  onPressBack: () => void;
  goToBankAccounts: () => void;
  goToNotification: () => void;
  goToTransactionDetail: (params: {
    id: string;
    referenceId?: string;
    type?: string;
    status?: string;
  }) => void;
  goToTransferDetail: (params: { bankData: any; accountData: any }) => void;
}

export const HomeView = (props: HomeViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [isSheetMounted, setIsSheetMounted] = useState(false);
  const emailSheetRef = useRef<BottomSheetModal>(null);
  const [isAccountSheetMounted, setIsAccountSheetMounted] = useState(false);
  const { isNewUser, setIsNewUser } = useAuthStore();

  const { data: homeAggregate, isLoading, isRefetching, refetch } = useGetHomeAggregateQuery();
  const { data: profile } = useGetProfileMeQuery();

  const homeData = homeAggregate?.data;
  const transferLimit = homeData?.transferLimit;
  const recentTransactions = homeData?.recentTransactions ?? [];
  const recentBeneficiaries = homeData?.recentBeneficiaries ?? [];
  const hasKycPending = homeData?.pendingActions.some((a) => a.code === 'KYC_INCOMPLETE') ?? false;

  console.log(homeData, 'HOME');

  const handleOpenEmailSheet = useCallback(() => {
    setIsSheetMounted(true);
    requestAnimationFrame(() => {
      emailSheetRef.current?.present();
    });
  }, []);

  useEffect(() => {
    if (isNewUser) {
      setIsNewUser(false);
    }
  }, [isNewUser]);

  useEffect(() => {
    const hasShown = false;
    if (!hasShown && isNewUser) {
      setTimeout(() => {
        handleOpenAccountSheet();
      }, 500);
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
          <LogoDoitpay />
          <NotificationIconWithBadge onPress={props.goToNotification} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}>
          {/* <UnprotectedAccount onPress={() => handleOpenEmailSheet()} isShow={hasKycPending} /> */}
          <DeletionInProgressBanner isShow={profile?.data?.isRequestDeleteAccount ?? false} />
          <View style={styles.dailyLimitWrapper}>
            <Text style={{ fontSize: 20, marginBottom: 4, fontFamily: 'Switzer-Semibold' }}>
              {t('home.dailyLimitTransfer')}
            </Text>
            <TransferLimitCard
              usedAmount={transferLimit?.usage ?? 0}
              maxAmount={transferLimit?.maxAmount ?? 0}
              percentage={transferLimit?.usagePercentage ?? 0}
              amountReceived={transferLimit?.amountReceived ?? 0}
            />
          </View>
          <View style={styles.mainWrapper}>
            {recentBeneficiaries.length > 0 || recentTransactions.length > 0 ? (
              <View style={{ flex: 1 }}>
                <SearchBar onPress={props.goToSearchAccount} />
                <SizedBox height={24} />
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                    {t('home.lastSend')}
                  </Text>
                  {isLoading ? (
                    <RecentBeneficiarySkeleton />
                  ) : recentBeneficiaries.length === 0 ? (
                    <View style={styles.sectionEmptyContainer}>
                      <Image
                        source={require('../../../assets/images/ic-empty-beneficiary.png')}
                        style={styles.sectionEmptyImage}
                      />
                      <Text style={styles.sectionEmptyText}>Belum ada penerima terakhir</Text>
                    </View>
                  ) : (
                    <View style={{ marginRight: -24 }}>
                      <RecentRecipient
                        data={recentBeneficiaries}
                        onPressItem={(b) =>
                          props.goToTransferDetail({
                            bankData: { shortName: b.bankCode, logoUrl: null },
                            accountData: {
                              accountHolderName: b.name,
                              accountNumber: b.accountNumber,
                            },
                          })
                        }
                      />
                    </View>
                  )}
                </View>

                <SizedBox height={24} />
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                  {t('home.lastActivity')}
                </Text>
                <View style={{ paddingBottom: 75 }}>
                  {isLoading ? (
                    <RecentActivitySkeleton />
                  ) : recentTransactions.length === 0 ? (
                    <View style={styles.sectionEmptyContainer}>
                      <Text style={styles.sectionEmptyText}>Belum ada aktivitas transaksi</Text>
                    </View>
                  ) : (
                    recentTransactions.map((item) => (
                      <RecentActivityItem
                        key={item.id}
                        item={item}
                        onPress={() =>
                          props.goToTransactionDetail({
                            id: item.id,
                            referenceId: item.referenceId,
                            type: item.type,
                            status: item.status,
                          })
                        }
                      />
                    ))
                  )}
                </View>
              </View>
            ) : (
              <View style={styles.sectionEmptyContainer}>
                <EmptyHomeIcon />
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: 'Switzer-Semibold',
                    fontSize: 22,
                  }}>
                  Belum ada aktivitas
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.text,
                    fontFamily: 'Switzer-Regular',
                    fontSize: 14,
                    marginTop: 6,
                    lineHeight: 20,
                  }}>
                  Lakukan transfer, atau terima uang untuk melihat aktivitas terbaru di sini
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
      {isSheetMounted && (
        <EmailBottomsheet ref={emailSheetRef} onDismiss={() => setIsSheetMounted(false)} />
      )}
      {isAccountSheetMounted && (
        <CompleteAccountPopup
          isVisible={false}
          onClose={onCloseCompleteModal}
          onAddAccount={handleGoToAddBank}
          withButtonClose={true}
        />
      )}
    </SafeAreaView>
  );
};
