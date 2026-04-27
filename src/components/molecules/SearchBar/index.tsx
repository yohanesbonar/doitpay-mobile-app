import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  containerStyle?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Cari Transaksi',
  value,
  onChangeText,
  containerStyle,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <View style={[styles.searchBar, { borderColor: '#737373' }, containerStyle]}>
      <Search size={18} color={colors.textSecondary || '#7C7C7C'} style={styles.searchIcon} />
      <TextInput
        placeholder={placeholder}
        style={styles.searchInput}
        placeholderTextColor={colors.textSecondary || '#7C7C7C'}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};
