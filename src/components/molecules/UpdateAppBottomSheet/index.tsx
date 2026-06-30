import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export type UpdateAction = 'FORCE_UPDATE' | 'SOFT_UPDATE' | 'OK';

export interface UpdateAppData {
  action?: UpdateAction;
  latest_version?: string;
  description?: string | string[];
  latestChangelogs?: unknown;
  minimum_version?: string;
  mandatory?: boolean;
  update_url?: string;
}

interface UpdateAppBottomSheetProps {
  visible: boolean;
  onUpdatePress: (data?: UpdateAppData) => void;
  onLaterPress?: () => void;
  data?: UpdateAppData;
}

export const UpdateAppBottomSheet = ({
  visible,
  onUpdatePress,
  onLaterPress,
  data,
}: UpdateAppBottomSheetProps) => {
  if (!visible) {
    return null;
  }

  const action = data?.action ?? 'OK';
  const isSoftUpdate = action === 'SOFT_UPDATE' && !data?.mandatory;

  const extractTextFromChangelogItem = (item: unknown): string => {
    if (typeof item === 'string') {
      return item.trim();
    }

    if (item && typeof item === 'object') {
      const candidate = [
        (item as any).description,
        (item as any).text,
        (item as any).title,
        (item as any).changelog,
        (item as any).content,
        (item as any).label,
      ].find((value) => typeof value === 'string' && value.trim().length > 0);

      return typeof candidate === 'string' ? candidate.trim() : '';
    }

    return '';
  };

  const descriptionSource = data?.latestChangelogs ?? data?.description;
  const descriptionList = (Array.isArray(descriptionSource)
    ? descriptionSource
    : descriptionSource
      ? [descriptionSource]
      : []
  )
    .map(extractTextFromChangelogItem)
    .filter((item) => item.length > 0);

  const forceDescription =
    'Versi aplikasi yang Anda gunakan sudah tidak didukung. Silakan update Doitpay ke versi terbaru';

  return (
    <View style={styles.overlay}>
      <View style={[styles.sheetContainer, isSoftUpdate && styles.softSheetContainer]}>
        {isSoftUpdate ? (
          <View style={styles.softHeader}>
            <Image source={require('@/assets/images/ic-bell.png')} style={styles.bellIcon} />
            <Text style={[styles.title, styles.softTitle]}>Ada yang Baru di Doitpay</Text>
          </View>
        ) : (
          <Text style={styles.title}>Perbarui Aplikasi untuk Melanjutkan</Text>
        )}

        {isSoftUpdate ? (
          <>
            <Text style={styles.description}>
              {`Perbarui aplikasi ke versi ${data?.latest_version ?? ''} untuk menikmati fitur terbaru${descriptionList.length > 0 ? ':' : '.'}`}
            </Text>

            <View style={styles.bulletListContainer}>
              {descriptionList.map((item, index) => (
                <View
                  key={`${item}-${index}`}
                  style={[styles.bulletItem, index === 0 && { marginTop: 8 }]}>
                  <Text style={styles.bulletPrefix}>{'\u2713'}</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.description}>{forceDescription}</Text>
        )}

        <TouchableOpacity
          style={[styles.updateButton, isSoftUpdate && styles.softUpdateButton]}
          onPress={() => onUpdatePress(data)}
          activeOpacity={0.85}>
          <Text style={styles.updateButtonText}>Update Aplikasi</Text>
        </TouchableOpacity>

        {isSoftUpdate && (
          <TouchableOpacity style={styles.laterButton} onPress={onLaterPress} activeOpacity={0.85}>
            <Text style={styles.laterButtonText}>Nanti Saja</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
