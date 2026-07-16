export type NotificationCategory = 'system' | 'marketing' | 'security' | 'transaction';

export type NotificationSubType =
  | 'incoming'
  | 'transfer'
  | 'qris'
  | 'refund'
  | 'settlement'
  | 'pin'
  | 'beneficiary'
  | 'login'
  | 'email'
  | 'account';

export type Notification = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  category: NotificationCategory;
  subType: NotificationSubType;
};

export type NotificationGroup = {
  title: string;
  data: Notification[];
};

export type GetNotificationListQueries = {
  unreadOnly?: boolean;
  subType?: NotificationSubType;
  cursor?: string;
  limit?: number;
};
