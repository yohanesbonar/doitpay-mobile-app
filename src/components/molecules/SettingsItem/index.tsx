import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

interface SettingItemProps {
  title: string;
  sub?: string;
  icon?: LucideIcon;
  onPress?: () => void;
  type?: 'arrow' | 'switch' | 'none';
  value?: boolean;
}

export const SettingItem = ({
  title,
  sub,
  icon: Icon,
  onPress,
  type = 'arrow',
  value,
}: SettingItemProps) => {
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={onPress}
      disabled={type === 'switch'}
      activeOpacity={0.7}>
      <View style={styles.itemLeft}>
        {Icon && <Icon size={22} color="#1A1A1A" strokeWidth={1.5} />}
        <View>
          <Text style={styles.itemTitle}>{title}</Text>
          {sub && <Text style={styles.itemSub}>{sub}</Text>}
        </View>
      </View>

      {type === 'arrow' && <ChevronRight size={20} color="#737373" />}

      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onPress}
          trackColor={{ false: '#E5E5E5', true: '#4F84F6' }}
          thumbColor="#FFFFFF"
          style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1, // Supaya teks tidak menabrak switch
  },
  itemTitle: {
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
    color: '#1A1A1A',
  },
  itemSub: {
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    marginTop: 2,
  },
});
