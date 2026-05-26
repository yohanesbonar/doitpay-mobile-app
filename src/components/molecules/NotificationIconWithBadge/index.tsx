import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconNotification } from '@/assets/icons';
import { useUnreadNotificationCount } from '@/hooks/useUnreadNotificationCount';

interface Props {
  onPress: () => void;
}

export const NotificationIconWithBadge = ({ onPress }: Props) => {
  const count = useUnreadNotificationCount();

  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <IconNotification />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'Switzer-Semibold',
  },
});
