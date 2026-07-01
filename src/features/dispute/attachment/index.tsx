import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Alert,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, X } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';

interface DisputeAttachmentViewProps {
  issueType: string;
  transactionId?: string;
  onPressBack: () => void;
  onContinue: (description: string, attachmentCount: number, attachmentUris: string[]) => void;
}

interface PhotoItem {
  id: string;
  uri: string;
}

export const DisputeAttachmentView = ({
  issueType,
  transactionId,
  onPressBack,
  onContinue,
}: DisputeAttachmentViewProps) => {
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState<PhotoItem[]>([]);

  const canContinue = useMemo(() => description.trim().length > 3, [description]);
  const attachmentCount = attachments.length;

  const requestPhotoPermission = async () => {
    if (Platform.OS !== 'android') {
      return true;
    }

    const permission =
      Number(Platform.Version) >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const granted = await PermissionsAndroid.check(permission);
    if (granted) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === PermissionsAndroid.RESULTS.GRANTED;
  };

  const addAttachment = async () => {
    try {
      const imagePicker = await import('react-native-image-picker');
      const launchImageLibrary = imagePicker?.launchImageLibrary;

      if (typeof launchImageLibrary !== 'function') {
        Alert.alert('Error', 'Fitur upload foto belum tersedia di perangkat ini.');
        return;
      }

      const hasPermission = await requestPhotoPermission();
      if (!hasPermission) {
        Alert.alert('Izin Ditolak', 'Aplikasi membutuhkan izin galeri untuk memilih foto.');
        return;
      }

      const options = {
        mediaType: 'photo',
        selectionLimit: 0,
        quality: 0.8,
      } as const;

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', result.errorMessage || 'Gagal memilih foto dari galeri');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const nextPhotos = result.assets
          .filter((asset: any) => !!asset.uri)
          .map((asset: any, index: number) => ({
            id: `${Date.now()}-${index}-${asset.fileName || 'photo'}`,
            uri: asset.uri!,
          }));

        setAttachments((prev) => [...prev, ...nextPhotos]);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal memilih foto dari galeri';
      Alert.alert('Error', message);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar
        title="Laporkan Masalah"
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="medium"
      />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Lampiran</Text>
          <Text style={styles.subtitle}>Tambahkan foto atau tangkapan layar sebagai bukti.</Text>

          <Text style={styles.sectionLabel}>Lampiran Foto</Text>
          <View style={styles.uploadGrid}>
            {attachments.map((attachment, index) => (
              <View key={attachment.id} style={styles.thumbnailCard}>
                <Image
                  source={{ uri: attachment.uri }}
                  style={styles.thumbnailImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeAttachment(attachment.id)}
                  activeOpacity={0.85}>
                  <X size={14} color="#374151" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              style={styles.uploadTile}
              onPress={addAttachment}
              activeOpacity={0.85}>
              <Camera size={26} color="#525252" />
              <Text style={styles.uploadTileText}>Upload Foto</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Tuliskan detail masalah</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Cth: Detail transaksi (29 Maret 2026, Transaksi RP 100,000)"
            placeholderTextColor="#9CA3AF"
            multiline
            style={styles.textArea}
          />
        </ScrollView>

        <Button
          onPress={() =>
            onContinue(
              description,
              attachmentCount,
              attachments.map((item) => item.uri),
            )
          }
          title="Lanjutkan"
          color="#3475E8"
          type="regular"
          textColor="white"
          textStyle={styles.primaryButtonText}
          style={[styles.primaryButton, !canContinue && styles.disabledButton]}
          disable={!canContinue}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    color: '#111827',
    fontFamily: 'Switzer-Bold',
    fontSize: 24,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  sectionLabel: {
    marginBottom: 10,
    color: '#111827',
    fontFamily: 'Switzer-Semibold',
    fontSize: 16,
  },
  uploadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  thumbnailCard: {
    width: (Dimensions.get('window').width - 60) / 3,
    minWidth: 96,
    height: 96,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  uploadTile: {
    width: (Dimensions.get('window').width - 60) / 3,
    minWidth: 96,
    height: 96,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTileText: {
    marginTop: 6,
    fontFamily: 'Switzer-Medium',
    color: '#111827',
    fontSize: 14,
  },
  attachmentInfo: {
    marginTop: -6,
    marginBottom: 14,
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
  },
  inputLabel: {
    color: '#111827',
    fontSize: 12,
    fontFamily: 'Switzer-Medium',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Switzer-Regular',
    minHeight: 110,
    textAlignVertical: 'top',
    color: '#111827',
  },
  primaryButton: {
    borderRadius: 24,
    height: 48,
    marginTop: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontFamily: 'Switzer-Bold',
    fontSize: 15,
  },
});
