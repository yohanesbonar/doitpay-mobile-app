import React from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Search, X } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  showSearchIcon?: boolean;
  showClearIcon?: boolean;
  onPressClear?: () => void;
  containerStyle?: object;
}

const Input = ({
  showSearchIcon,
  showClearIcon,
  onPressClear,
  containerStyle,
  style,
  value,
  ...props
}: InputProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.white, borderColor: '#E0E0E0' },
        containerStyle,
      ]}>
      {showSearchIcon && <Search size={20} color="#999" style={styles.leftIcon} />}

      <TextInput
        style={[styles.input, { color: colors.black }, style]}
        placeholderTextColor="#999"
        value={value}
        {...props}
      />

      {showClearIcon && value && value.length > 0 && (
        <TouchableOpacity onPress={onPressClear}>
          <X size={18} color="#999" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    width: '100%',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
  },
  leftIcon: {
    marginRight: 8,
  },
});

export default Input;
