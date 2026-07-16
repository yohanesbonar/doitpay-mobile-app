import React, { useEffect, useMemo, useRef, useState } from 'react';
import { usePostHog } from 'posthog-react-native';
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
import { disputeReviewApi } from './api/dispute-review-api';

const MANUAL_OTHER_OPTION_ID = 'MANUAL_OTHER';

const normalizeContentType = (value?: string) => {
  const normalized = (value || '').trim().toLowerCase();
  if (!normalized) {
    return 'image/jpeg';
  }
  if (normalized === 'image/jpg') {
    return 'image/jpeg';
  }
  return normalized;
};

const sanitizeFilename = (value?: string, fallbackExt: 'jpg' | 'jpeg' | 'png' = 'jpg') => {
  const raw = (value || '').split('/').pop() || '';
  const cleaned = raw.replace(/[^a-zA-Z0-9._-]/g, '');

  if (!cleaned) {
    return `evidence-${Date.now()}.${fallbackExt}`;
  }

  if (cleaned.includes('.')) {
    return cleaned;
  }

  return `${cleaned}.${fallbackExt}`;
};

interface DisputeReviewViewProps {
  issueType: string;
  description: string;
  attachmentCount: number;
  attachmentUris?: string[];
  disputeId?: string;
  issueReasonId?: string;
  transactionId?: string;
  orderReferenceId?: string;
  onPressBack: () => void;
  onSubmit: (
    description: string,
    attachmentCount: number,
    disputeId?: string,
    estimatedAt?: string,
  ) => void;
}

interface PhotoItem {
  id: string;
  uri: string;
  fileName?: string;
  contentType?: string;
  evidenceId?: string;
  uploadState: 'pending' | 'uploading' | 'uploaded' | 'failed';
}

export const DisputeReviewView = ({
  issueType,
  description,
  attachmentCount: _attachmentCount,
  attachmentUris,
  disputeId,
  issueReasonId,
  transactionId,
  orderReferenceId,
  onPressBack,
  onSubmit,
}: DisputeReviewViewProps) => {
  const posthog = usePostHog();
  const [descriptionInput, setDescriptionInput] = useState('');
  const [attachments, setAttachments] = useState<PhotoItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasHydratedInitialUris = useRef(false);

  const hasAttachment = attachments.length > 0;

  const canSubmit = useMemo(
    () => descriptionInput.trim().length > 0 && hasAttachment,
    [descriptionInput, hasAttachment],
  );

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

  useEffect(() => {
    if (hasHydratedInitialUris.current) {
      return;
    }

    hasHydratedInitialUris.current = true;

    const initialUris = (attachmentUris || []).filter(Boolean);
    if (initialUris.length === 0) {
      return;
    }

    const initialPhotos: PhotoItem[] = initialUris.map((uri, index) => ({
      id: `initial-${index}-${Date.now()}`,
      uri,
      fileName: `initial-${index}-${Date.now()}.jpg`,
      contentType: 'image/jpeg',
      uploadState: 'pending',
    }));

    setAttachments((prev) => [...prev, ...initialPhotos]);
  }, [attachmentUris]);

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
        selectionLimit: 3 - attachments.length,
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
        const validAssets = result.assets.filter((asset: any) => !!asset.uri);
        const nextPhotos: PhotoItem[] = validAssets.map((asset: any, index: number) => ({
          id: `${Date.now()}-${index}-${asset.fileName || 'photo'}`,
          uri: asset.uri!,
          fileName: asset.fileName,
          contentType: asset.type || 'image/jpeg',
          uploadState: 'pending',
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

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    if (attachments.length === 0) {
      Alert.alert('Error', 'Silakan upload minimal 1 foto bukti.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (!issueReasonId) {
        Alert.alert('Error', 'Reason ID tidak tersedia untuk membuat draft laporan.');
        return;
      }

      const isDisputeFlow = !!transactionId;

      const evidenceKeys: string[] = [];
      for (const attachment of attachments) {
        setAttachments((prev) =>
          prev.map((item) =>
            item.id === attachment.id
              ? {
                  ...item,
                  uploadState: 'uploading',
                }
              : item,
          ),
        );

        const contentType = normalizeContentType(attachment.contentType);
        const extension = contentType.includes('png') ? 'png' : 'jpg';
        const fileName = sanitizeFilename(attachment.fileName, extension);

        try {
          const presignRes = isDisputeFlow
            ? await disputeReviewApi.createEvidencePresign({
                contentType,
                filename: fileName,
              })
            : await disputeReviewApi.createCustomerReportEvidencePresign({
                contentType,
                filename: fileName,
              });

          await disputeReviewApi.uploadEvidenceFile(
            presignRes.data.uploadUrl,
            presignRes.data.uploadFields,
            {
              uri: attachment.uri,
              name: fileName,
              type: contentType,
            },
          );

          if (presignRes.data.uploadKey) {
            evidenceKeys.push(presignRes.data.uploadKey);
          }

          setAttachments((prev) =>
            prev.map((item) =>
              item.id === attachment.id
                ? {
                    ...item,
                    evidenceId: presignRes.data.uploadKey || presignRes.data.id,
                    uploadState: 'uploaded',
                  }
                : item,
            ),
          );
        } catch (uploadError) {
          setAttachments((prev) =>
            prev.map((item) =>
              item.id === attachment.id
                ? {
                    ...item,
                    uploadState: 'failed',
                  }
                : item,
            ),
          );

          throw uploadError;
        }
      }

      if (evidenceKeys.length === 0) {
        throw new Error('Gagal mendapatkan evidence key dari upload foto.');
      }

      const detailText = descriptionInput.trim();
      const customReasonText = (issueType || description || '').trim();

      const createDraftPayload = {
        customReason: customReasonText,
        detail: detailText,
        evidenceKeys,
        ...(isDisputeFlow ? { orderReferenceId: orderReferenceId || transactionId } : {}),
        ...(issueReasonId === MANUAL_OTHER_OPTION_ID ? {} : { reasonId: issueReasonId }),
      };

      const createDraftRes = isDisputeFlow
        ? await disputeReviewApi.createDraft(createDraftPayload)
        : await disputeReviewApi.createCustomerReport(createDraftPayload);

      const createdDisputeId = createDraftRes?.data?.id || disputeId;
      const estimatedAt = createDraftRes?.data?.estimatedAt;

      posthog.capture('dispute_submitted', {
        issue_type: issueType,
        attachment_count: attachments.length,
        has_transaction_id: !!transactionId,
      });

      onSubmit(descriptionInput.trim(), attachments.length, createdDisputeId, estimatedAt);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Gagal mengirim laporan';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
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
          <Text style={styles.title}>Tinjau Laporan</Text>
          <Text style={styles.subtitle}>Pastikan detail laporan sudah sesuai.</Text>

          <Text style={styles.sectionHeader}>Jenis Masalah</Text>
          <View style={styles.issueTypeCard}>
            <Text style={styles.issueTypeText}>{issueType}</Text>
          </View>

          <Text style={styles.sectionHeader}>Lampiran Foto (maksimal upload 3 Foto)</Text>
          <View style={styles.attachmentRow}>
            {attachments.map((attachment) => (
              <View key={attachment.id} style={styles.attachmentCell}>
                <View style={styles.previewBox}>
                  <Image
                    source={{ uri: attachment.uri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />

                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeAttachment(attachment.id)}
                    activeOpacity={0.85}>
                    <X size={14} color="#374151" />
                  </TouchableOpacity>

                  {attachment.uploadState === 'uploading' && (
                    <View style={styles.uploadingBadge}>
                      <Text style={styles.uploadingText}>Uploading...</Text>
                    </View>
                  )}

                  {attachment.uploadState === 'failed' && (
                    <View style={styles.failedBadge}>
                      <Text style={styles.failedText}>Gagal</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {attachments.length < 3 && (
              <TouchableOpacity
                style={styles.attachmentCell}
                onPress={addAttachment}
                activeOpacity={0.85}>
                <View style={styles.uploadButton}>
                  <Camera size={28} color="#525252" />
                  <Text style={styles.uploadText}>Upload Foto</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionHeader}>Deskripsi Masalah</Text>
          <View style={styles.descriptionBox}>
            <TextInput
              value={descriptionInput}
              onChangeText={setDescriptionInput}
              multiline
              style={styles.descriptionInput}
              placeholder="Tuliskan detail masalah"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </ScrollView>

        <Button
          onPress={handleSubmit}
          title="Kirim Laporan"
          color="#3475E8"
          type="regular"
          textColor="white"
          textStyle={styles.primaryButtonText}
          style={[styles.primaryButton, !canSubmit && styles.disabledButton]}
          disable={!canSubmit || isSubmitting}
          loading={isSubmitting}
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
  },
  title: {
    color: '#111827',
    fontFamily: 'Switzer-Bold',
    fontSize: 24,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: '#111827',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  sectionHeader: {
    color: '#111827',
    fontFamily: 'Switzer-Semibold',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 6,
  },
  issueTypeCard: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  issueTypeText: {
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 13,
  },
  attachmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    columnGap: 10,
    rowGap: 10,
    marginBottom: 14,
  },
  attachmentCell: {
    width: (Dimensions.get('window').width - 40 - 20) / 3,
  },
  previewBox: {
    width: '100%',
    height: (Dimensions.get('window').width - 40) / 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  previewImage: {
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
  uploadingBadge: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    backgroundColor: 'rgba(17,24,39,0.75)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  uploadingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Switzer-Medium',
  },
  failedBadge: {
    position: 'absolute',
    left: 4,
    bottom: 4,
    backgroundColor: 'rgba(220,38,38,0.85)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  failedText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Switzer-Medium',
  },
  uploadButton: {
    width: '100%',
    height: (Dimensions.get('window').width - 40) / 3,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    marginTop: 6,
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    minHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  descriptionInput: {
    color: '#111827',
    fontFamily: 'Switzer-Regular',
    fontSize: 13,
    lineHeight: 20,
    minHeight: 76,
    textAlignVertical: 'top',
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
