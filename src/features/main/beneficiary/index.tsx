import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import { IconNotification } from '@/assets/icons';
import { SearchBar } from '@/components/molecules/SearchBar';
import BeneficiaryItem from './components/BeneficiaryItem';
import { handleLogout } from '@/utils/Common';

const DATA_BENEFICIARY = [
  { id: '1', name: 'Joni Wahyu', bank: 'BCA', accountNumber: '7453023301', isFavorite: true },
  { id: '2', name: 'Silvester', bank: 'BCA', accountNumber: '987654738', isFavorite: true },
  { id: '3', name: 'Bonar', bank: 'BCA', accountNumber: '9389476372', isFavorite: true },
  { id: '4', name: 'Joshua', bank: 'BCA', accountNumber: '0974576294', isFavorite: true },
  { id: '5', name: 'Jordan', bank: 'BCA', accountNumber: '03874924', isFavorite: true },
  { id: '6', name: 'Kunto', bank: 'BCA', accountNumber: '132323', isFavorite: false },
  { id: '7', name: 'Jessica', bank: 'BCA', accountNumber: '5433123', isFavorite: false },
  { id: '8', name: 'Jocelline', bank: 'BCA', accountNumber: '5435243', isFavorite: false },
];

export const Beneficiary = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Favorit' | 'Semua'>('Favorit');

  const [beneficiaries, setBeneficiaries] = useState(DATA_BENEFICIARY);

  const toggleFavorite = (id: string) => {
    setBeneficiaries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item)),
    );
  };

  const filteredData = useMemo(() => {
    return beneficiaries.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.accountNumber.includes(searchQuery);

      if (activeTab === 'Favorit') {
        return matchesSearch && item.isFavorite;
      }
      return matchesSearch;
    });
  }, [searchQuery, activeTab, beneficiaries]);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Text style={styles.headerTitle}>Penerima</Text>
          <TouchableOpacity onPress={() => handleLogout()}>
            <IconNotification />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari Penerima"
          />
        </View>

        <View style={styles.tabContainer}>
          {['Favorit', 'Semua'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab as any)}>
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BeneficiaryItem
              item={item}
              onPress={() => console.log('Transfer to:', item.name)}
              onFavoritePress={() => toggleFavorite(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Beneficiary;
