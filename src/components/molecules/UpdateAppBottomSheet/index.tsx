import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export type UpdateAction = 'FORCE_UPDATE' | 'SOFT_UPDATE' | 'OK';

export interface UpdateAppData {
  action?: UpdateAction;
  latest_version?: string;
  description?: string | string[];
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
  const descriptionList = Array.isArray(data?.description)
    ? data.description
    : data?.description
      ? [data.description]
      : [];

  const forceDescription =
    descriptionList[0] ??
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
                <View key={item} style={[styles.bulletItem, index === 0 && { marginTop: 8 }]}>
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
