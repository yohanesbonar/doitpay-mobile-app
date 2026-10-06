import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Delete } from 'lucide-react-native';

const MAX_KEY_SIZE = 80;

interface NumericPinKeypadProps {
  onDigitPress: (digit: string) => void;
  onDeletePress: () => void;
  deleteAccessibilityLabel: string;
  leftAction?: React.ReactNode;
  onLeftActionPress?: () => void;
  isLeftActionPending?: boolean;
  disabled?: boolean;
  topMargin?: number;
  horizontalInset?: number;
}

export const NumericPinKeypad = ({
  onDigitPress,
  onDeletePress,
  deleteAccessibilityLabel,
  leftAction,
  onLeftActionPress,
  isLeftActionPending = false,
  disabled = false,
  topMargin = 56,
  horizontalInset = 64,
}: NumericPinKeypadProps) => {
  const { width, height } = useWindowDimensions();
  const keySize = Math.min(
    MAX_KEY_SIZE,
    (width - horizontalInset) / 3,
    Math.max(64, (height - 380) / 4.4),
  );
  const cellStyle = [styles.keypadCell, { height: keySize }];

  const renderNumber = (digit: string) => (
    <Pressable
      key={digit}
      accessibilityRole="button"
      accessibilityLabel={digit}
      onPress={() => onDigitPress(digit)}
      style={cellStyle}
      disabled={disabled}>
      <View
        style={[styles.numberKey, { width: keySize, height: keySize, borderRadius: keySize / 2 }]}>
        <Text style={styles.numberKeyText}>{digit}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.keypad, { marginTop: topMargin }]}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(renderNumber)}
      {leftAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onLeftActionPress}
          style={cellStyle}
          disabled={disabled || isLeftActionPending}>
          {isLeftActionPending ? (
            <ActivityIndicator size="large" color="#4A80F0" />
          ) : (
            <View style={styles.leftAction}>{leftAction}</View>
          )}
        </Pressable>
      ) : (
        <View style={cellStyle} />
      )}
      {renderNumber('0')}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={deleteAccessibilityLabel}
        onPress={onDeletePress}
        style={cellStyle}
        disabled={disabled}>
        <Delete size={32} color="#1A1A1A" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  keypad: {
    width: '100%',
    maxWidth: 350,
    alignSelf: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keypadCell: {
    width: '33.333%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  numberKey: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E6E6E6',
  },
  numberKeyText: {
    color: '#1A1A1A',
    fontSize: 42,
    fontFamily: 'Switzer-Medium',
  },
  leftAction: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 2,
  },
});
