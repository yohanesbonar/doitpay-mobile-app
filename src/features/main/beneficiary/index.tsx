import React, { FC, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import { IconNotification } from '@/assets/icons';
import { SearchBar } from '@/components/molecules/SearchBar';
import BeneficiaryItem from './components/BeneficiaryItem';
import { useTranslation } from 'react-i18next';
import { useGetBeneficiariesQuery } from './hooks/useGetBeneficiariesQuery';
import { useUpdateBeneficieryMutation } from './hooks/useUpdateBeneficieryMutation';
import { BeneficiaryListSkeleton } from './components/BeneficiaryItemSkeleton';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { Beneficiary as BeneficiaryType } from './types';

const BeneficiaryItemRow = ({
  item,
  goToTransferDetail,
}: {
  item: BeneficiaryType;
  goToTransferDetail: () => void;
}) => {
  const { mutate: updateBeneficiary } = useUpdateBeneficieryMutation(item.id);

  return (
    <BeneficiaryItem
      item={item}
      onFavoritePress={() => updateBeneficiary({ isFavorite: !item.isFavorite })}
      onPress={goToTransferDetail}
    />
  );
};

interface BeneficiaryProps {
  goToTransferDetail: (params: { bankData: any; accountData: any }) => void;
  goToNotification: () => void;
}

export const Beneficiary: FC<BeneficiaryProps> = ({ goToTransferDetail, goToNotification }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearch = useDebounce(searchQuery);

  const [activeTab, setActiveTab] = useState<'Favorit' | 'Semua'>('Favorit');

  const {
    data: beneficiaryData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetBeneficiariesQuery({
    isFavorite: activeTab === 'Favorit' ? true : undefined,
    search: debouncedSearch || undefined,
    limit: 6,
  });

  const parsedBeneficiaries =
    beneficiaryData?.pages.flatMap((page) => page?.data?.items ?? []) ?? [];

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>{t('beneficiary.title')}</Text>
          <TouchableOpacity onPress={goToNotification}>
            <IconNotification />
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.searchContainer}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('beneficiary.search')}
            />
          </View>

          <View style={styles.tabContainer}>
            {['Favorit', 'Semua'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                onPress={() => setActiveTab(tab as any)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {isLoading ? (
          <BeneficiaryListSkeleton />
        ) : (
          <FlatList
            data={parsedBeneficiaries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BeneficiaryItemRow
                item={item}
                goToTransferDetail={() => {
                  goToTransferDetail({
                    bankData: { shortName: item.bankCode, logoUrl: null },
                    accountData: {
                      accountHolderName: item.accountHolderName,
                      accountNumber: item.accountNumber,
                    },
                  });
                }}
              />
            )}
            contentContainerStyle={[
              styles.listContent,
              {
                backgroundColor: parsedBeneficiaries.length === 0 ? '#FFF' : colors.pageBackground,
                paddingTop: parsedBeneficiaries.length > 0 ? 12 : 0,
              },
            ]}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage();
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#4F84F6" style={{ paddingVertical: 16 }} />
              ) : null
            }
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Image
                  source={require('../../../assets/images/ic-empty-beneficiary.png')}
                  style={{ width: 191, height: 208, resizeMode: 'contain' }}
                />
                <Text style={styles.emptyText}>{t('beneficiary.beneficiaryNotFound')}</Text>
                <Text style={styles.emptyTextDesc}>{t('beneficiary.descBeneficiaryNotFound')}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Beneficiary;
