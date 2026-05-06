import { formatNumber } from '@/utils/Common';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface QuickAmountProps {
  onAmountPress: (amount: string) => void;
  currentAmount: string;
}

const AMOUNTS = ['50000', '100000', '200000', '500000', '1000000', '2000000'];

const QuickAmount: React.FC<QuickAmountProps> = ({ onAmountPress, currentAmount }) => {
  return (
    <View
      style={{
        marginTop: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
      {AMOUNTS.map((val) => {
        const rawVal = val.replace(/\./g, '');
        const isSelected = currentAmount === rawVal;

        return (
          <TouchableOpacity
            key={val}
            onPress={() => onAmountPress(rawVal)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: isSelected ? '#2F80ED' : '#E0E0E0',
              borderRadius: 8,
              backgroundColor: isSelected ? '#F0F7FF' : 'transparent',
              marginRight: 8,
              marginBottom: 12,
            }}>
            <Text
              style={{
                fontFamily: 'Switzer-Medium',
                fontSize: 16,
                color: isSelected ? '#2F80ED' : '#1A1A1A',
              }}>
              {formatNumber(val)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default QuickAmount;
