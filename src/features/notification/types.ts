import { PaginationQueries } from '@/types/pagination';

export type NotificationPreference = {
  categories: {
    marketing: boolean;
    security: boolean;
    system: boolean;
    transaction: boolean;
  };
  emailEnabled: boolean;
  locale: string;
  pushEnabled: boolean;
};

export type GetNotificationPreferencesResponse = {
  status: string;
  data: NotificationPreference;
  message: string;
};

export type UpdateNotificationPreferencePayload = {
  categories: {
    marketing: boolean;
    security: boolean;
    system: boolean;
    transaction: boolean;
  };
  emailEnabled: boolean;
  locale: string;
  pushEnabled: boolean;
};

export type NotifKey = 'security' | 'transaction' | 'system' | 'marketing';

export type Notification = {
  body: string;
  createdAt: string;
  data: any;
  id: string;
  readAt: string;
  sub_type: string;
  title: string;
  type: string;
};

export interface GetNotificationsQueries extends PaginationQueries {
  unreadOnly?: boolean;
}

export type NotificationCategory = 'transaction' | 'security' | 'marketing' | 'system';

export type NotificationIconType =
  | 'incoming_money'
  | 'transfer'
  | 'qris'
  | 'pin'
  | 'device'
  | 'email'
  | 'promo';

export type NotificationFilterTab = 'Semua' | 'Transaksi' | 'Keamanan' | 'Promo';

export type NotificationItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  dateLabel: string;
  category: NotificationCategory;
  isRead: boolean;
  iconType: NotificationIconType;
};

export type NotificationGroup = {
  title: string;
  data: NotificationItem[];
};

export type GetNotificationListQueries = {
  category?: NotificationCategory;
  limit?: number;
};
