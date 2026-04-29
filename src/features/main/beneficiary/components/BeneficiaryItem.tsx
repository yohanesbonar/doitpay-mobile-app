import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';

interface BeneficiaryItemProps {
  item: {
    id: string;
    name: string;
    bank: string;
    accountNumber: string;
    isFavorite: boolean;
  };
  onPress?: () => void;
  onFavoritePress: () => void;
}

const BeneficiaryItem = ({ item, onPress, onFavoritePress }: BeneficiaryItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftContent}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.bankInfo}>{`${item.bank}  ${item.accountNumber}`}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onFavoritePress();
        }}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Star
          size={20}
          fill={item.isFavorite ? '#FFD700' : 'transparent'}
          color={item.isFavorite ? '#FFD700' : '#E5E5E5'}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 11,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4F84F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Switzer-Bold',
  },
  info: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
    color: '#000',
  },
  bankInfo: {
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    color: '#000',
    marginTop: 2,
  },
});

export default BeneficiaryItem;
