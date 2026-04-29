import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';

interface FilterButtonProps {
  onPress: () => void;
  label?: string;
  style?: ViewStyle;
  count?: number;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onPress,
  label = 'Filter',
  style,
  count = 0,
}) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.filterButton, { borderColor: '#737373' }, style]}
      onPress={onPress}
      activeOpacity={0.7}>
      <SlidersHorizontal size={18} color="#1A1A1A" />
      <Text style={styles.filterText}>
        {count > 0 ? `(${count}) ` : ''}
        {label}
      </Text>
    </TouchableOpacity>
  );
};
