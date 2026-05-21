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
