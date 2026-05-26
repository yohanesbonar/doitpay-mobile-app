import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  ArrowDownCircle,
  Bell,
  CheckCircle,
  Lock,
  Mail,
  Monitor,
  QrCode,
  RotateCcw,
  Send,
  User,
  Users,
} from 'lucide-react-native';
import { Notification, NotificationSubType } from '../types';
import { format } from 'date-fns';

interface NotificationItemProps {
  item: Notification;
  onPress?: () => void;
}

type IconConfig = { icon: React.ElementType; color: string; bg: string };

const ICON_MAP: Record<NotificationSubType, IconConfig> = {
  incoming:    { icon: ArrowDownCircle, color: '#22C55E', bg: '#DCFCE7' },
  transfer:    { icon: Send,            color: '#4F84F6', bg: '#EEF2FF' },
  qris:        { icon: QrCode,          color: '#4F84F6', bg: '#EEF2FF' },
  refund:      { icon: RotateCcw,       color: '#22C55E', bg: '#DCFCE7' },
  settlement:  { icon: CheckCircle,     color: '#4F84F6', bg: '#EEF2FF' },
  pin:         { icon: Lock,            color: '#EF4444', bg: '#FEE2E2' },
  beneficiary: { icon: Users,           color: '#4F84F6', bg: '#EEF2FF' },
  login:       { icon: Monitor,         color: '#6B7280', bg: '#F3F4F6' },
  email:       { icon: Mail,            color: '#6B7280', bg: '#F3F4F6' },
  account:     { icon: User,            color: '#6B7280', bg: '#F3F4F6' },
};

const DEFAULT_ICON: IconConfig = { icon: Bell, color: '#6B7280', bg: '#F3F4F6' };

const NotificationItem = ({ item, onPress }: NotificationItemProps) => {
  const { icon: Icon, color, bg } = ICON_MAP[item.subType] ?? DEFAULT_ICON;
  const isUnread = !item.readAt;

  return (
    <TouchableOpacity
      style={[styles.container, isUnread && styles.unreadContainer]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Icon size={20} color={color} />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.time}>{format(item.createdAt, 'HH:mm')}</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.description} numberOfLines={2}>
            {item.body}
          </Text>
          {isUnread && <View style={styles.unreadDot} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },
  unreadContainer: {
    backgroundColor: '#EBF2FF',
    borderColor: '#C2D8FF',
    borderWidth: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Switzer-Semibold',
    color: '#1A1A1A',
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    flexShrink: 0,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  description: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    lineHeight: 18,
    marginRight: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F84F6',
    flexShrink: 0,
    marginBottom: 2,
  },
});

export default NotificationItem;
