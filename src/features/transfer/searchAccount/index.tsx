import React, { useRef, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import HeaderToolbar from '../../../components/molecules/HeaderToolbar';
import Input from '../../../components/atoms/Input';
import FastImage from 'react-native-fast-image';
import { useDebounce } from '@/utils/hooks/useDebounce';
import { useGetBeneficiariesQuery } from '@/features/main/beneficiary/hooks/useGetBeneficiariesQuery';
import { Beneficiary } from '@/features/main/beneficiary/types';
import { SearchAccountListSkeleton } from './SearchAccountSkeleton';

interface SearchAccountViewProps {
  onPressBack: () => void;
  goToTransferDetail: (params: { bankData: any; accountData: any }) => void;
}

const SearchAccountView = ({ onPressBack, goToTransferDetail }: SearchAccountViewProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery);
  const hasScrolledRef = useRef(false);

  const {
    data: beneficiaryData,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetBeneficiariesQuery({
    search: debouncedSearch || undefined,
  });

  const parsedBeneficiaries =
    beneficiaryData?.pages.flatMap((page) => page?.data?.items ?? []) ?? [];

  const renderItem = ({ item }: { item: Beneficiary }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        goToTransferDetail({
          bankData: { shortName: item.bankCode, logoUrl: null },
          accountData: {
            accountHolderName: item.accountHolderName,
            accountNumber: item.accountNumber,
          },
        })
      }>
      <View style={styles.listLogoContainer}>
        <FastImage
          style={styles.logo}
          source={require('../../../assets/images/ic-BCA.png')}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.userName}>{item.accountHolderName}</Text>
        <Text style={styles.accountInfo}>
          {item.bankCode} {item.accountNumber}
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
        titleStyle="regular"
      />

      <View style={styles.content}>
        <Text style={styles.labelInput}>{t('searchAccount.labelName') || 'Nama'}</Text>
        <Input
          showClearIcon={true}
          placeholder={t('searchAccount.searchName')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onPressClear={() => setSearchQuery('')}
          returnKeyType="search"
        />

        {isLoading ? (
          <SearchAccountListSkeleton />
        ) : (
          <FlatList
            data={parsedBeneficiaries}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPadding}
            showsVerticalScrollIndicator={false}
            refreshing={isRefetching}
            onRefresh={refetch}
            onScrollBeginDrag={() => {
              hasScrolledRef.current = true;
            }}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage && hasScrolledRef.current) fetchNextPage();
            }}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? (
                <ActivityIndicator size="small" color="#4F84F6" style={{ paddingVertical: 16 }} />
              ) : null
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                {t('searchAccount.notFound') || 'Tidak ada hasil'}
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
};

export default SearchAccountView;
