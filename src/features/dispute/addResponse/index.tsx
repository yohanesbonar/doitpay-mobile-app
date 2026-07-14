import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { AlertCircle, Camera, Check, Image as ImageIcon, X } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import { DisputeReport } from '../types';
import { disputeReviewApi } from '../review/api/dispute-review-api';
import { disputeDetailApi } from '../detail/api/dispute-detail-api';

interface DisputeAddResponseViewProps {
  mode?: 'response' | 'reopen';
  reportId: string;
  report?: DisputeReport;
  onPressBack: () => void;
  onSubmitSuccess: () => void;
}

interface PhotoItem {
  id: string;
  uri: string;
  name?: string;
  size?: number;
  type?: string;
  fileKey?: string;
  isExisting?: boolean;
}

type ResponseTab = 'LAPORAN' | 'BALASAN';

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

const getFileKeyName = (fileKey?: string) => {
  if (!fileKey) {
    return 'lampiran';
  }

  return fileKey.split('/').pop() || fileKey;
};

const getFileExtension = (fileKey?: string) => {
  const fileName = getFileKeyName(fileKey);
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
};

const isRemoteImageUrl = (value?: string) => {
  if (!value) {
    return false;
  }

  return /^https?:\/\//i.test(value.trim());
};

const canRenderImageUri = (value?: string) => {
  if (!value) {
    return false;
  }

  return /^(https?:\/\/|file:\/\/|content:\/\/|ph:\/\/|assets-library:\/\/)/i.test(value.trim());
};

export const DisputeAddResponseView = ({
  mode = 'response',
  reportId,
  report,
  onPressBack,
  onSubmitSuccess,
}: DisputeAddResponseViewProps) => {
  const queryClient = useQueryClient();
  const isReopenMode = mode === 'reopen';
  const [selectedTab, setSelectedTab] = useState<ResponseTab>('BALASAN');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);
  const previousEvidenceFiles = report?.evidenceFiles || [];
  const hasHydratedInitialPhotos = useRef(false);

  useEffect(() => {
    if (!isReopenMode || hasHydratedInitialPhotos.current) {
      return;
    }

    hasHydratedInitialPhotos.current = true;

    const initialPhotos: PhotoItem[] = previousEvidenceFiles.slice(0, 3).map((file) => ({
      id: `existing-${file.id}`,
      uri: file.url || file.fileKey,
      name: getFileKeyName(file.fileKey),
      type: 'image/jpeg',
      fileKey: file.fileKey,
      isExisting: true,
    }));

    setPhotos(initialPhotos);
  }, [isReopenMode, previousEvidenceFiles]);

  const openPreview = (uri: string) => {
    if (!uri) return;
    setPreviewImageUri(uri);
  };

  const closePreview = () => {
    setPreviewImageUri(null);
  };

  const removeAttachment = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePickPhoto = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: Math.max(0, 3 - photos.length),
        quality: 0.8,
      };

      if (options.selectionLimit === 0) {
        Alert.alert('Info', 'Maksimal 3 foto. Hapus salah satu foto jika ingin menambah.');
        return;
      }

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', `Failed to pick image: ${result.errorMessage}`);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const newPhotos = result.assets.map((asset: any, index: number) => ({
          id: `new-${Date.now()}-${index}`,
          uri: asset.uri || '',
          name: asset.fileName || `photo-${Date.now()}`,
          size: asset.fileSize,
          type: asset.type || 'image/jpeg',
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih foto dari galeri');
    }
  };

  const canSubmit = useMemo(() => description.trim().length > 0, [description]);

  const uploadAttachmentsAndCollectKeys = async (attachments: PhotoItem[]) => {
    const evidenceKeys: string[] = [];

    for (const attachment of attachments) {
      if (attachment.isExisting && attachment.fileKey) {
        evidenceKeys.push(attachment.fileKey);
        continue;
      }

      const contentType = normalizeContentType(attachment.type);
      const extension = contentType.includes('png') ? 'png' : 'jpg';
      const fileName = sanitizeFilename(attachment.name, extension);

      const presignRes = await disputeReviewApi.createCustomerReportEvidencePresign({
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
    }

    return evidenceKeys;
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      const evidenceKeys = await uploadAttachmentsAndCollectKeys(photos);

      if (isReopenMode) {
        await disputeDetailApi.reopenCustomerReport(reportId, {
          additionalInformation: description.trim(),
          evidenceKeys: evidenceKeys.length > 0 ? evidenceKeys : undefined,
        });
      } else {
        await disputeDetailApi.submitCustomerReportFeedback(reportId, {
          additionalInformation: description.trim(),
          evidenceKeys: evidenceKeys.length > 0 ? evidenceKeys : undefined,
        });
      }

      await queryClient.invalidateQueries({ queryKey: ['dispute-list'] });
      await queryClient.invalidateQueries({ queryKey: ['dispute-detail', reportId] });
      await queryClient.refetchQueries({ queryKey: ['dispute-detail', reportId], type: 'active' });
      
      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      Alert.alert(
        'Error',
        isReopenMode
          ? 'Gagal mengirim pembukaan kembali laporan. Silakan coba lagi.'
          : 'Gagal mengirim balasan. Silakan coba lagi.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar
        title={isReopenMode ? 'Laporkan Masalah' : 'Laporan Saya'}
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="medium"
      />

      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>{isReopenMode ? 'Tinjau Laporan' : 'Tambahan Laporan'}</Text>
          <Text style={styles.subtitle}>Pastikan detail laporan sudah sesuai.</Text>

          {!isReopenMode && (
            <View style={styles.warningBox}>
              <View style={styles.warningIconWrap}>
                <AlertCircle size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.warningText}>
                Tim kami butuh informasi tambahan agar laporan bisa dilanjutkan.
              </Text>
            </View>
          )}

          {!isReopenMode && (
            <View style={styles.tabWrapper}>
              <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'LAPORAN' && styles.tabButtonActive]}
                activeOpacity={0.85}
                onPress={() => setSelectedTab('LAPORAN')}>
                <Text
                  style={[
                    styles.tabButtonText,
                    selectedTab === 'LAPORAN' && styles.tabButtonTextActive,
                  ]}>
                  Laporan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, selectedTab === 'BALASAN' && styles.tabButtonActive]}
                activeOpacity={0.85}
                onPress={() => setSelectedTab('BALASAN')}>
                <Text
                  style={[
                    styles.tabButtonText,
                    selectedTab === 'BALASAN' && styles.tabButtonTextActive,
                  ]}>
                  Balasan
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {isReopenMode ? (
            <>
              <Text style={styles.label}>Jenis Masalah</Text>
              <View style={styles.readonlyBox}>
                <Text style={styles.readonlyText}>{report?.issueType || ''}</Text>
              </View>

              <Text style={styles.label}>Lampiran Foto</Text>
              <View style={styles.photoRow}>
                {photos.map((photo, index) => (
                  <View key={`photo-${index}-${photo.uri}`} style={styles.thumbnailWrapper}>
                    <TouchableOpacity
                      style={styles.thumbnail}
                      activeOpacity={canRenderImageUri(photo.uri) ? 0.85 : 1}
                      disabled={!canRenderImageUri(photo.uri)}
                      onPress={() => openPreview(photo.uri)}>
                      {canRenderImageUri(photo.uri) ? (
                        <Image source={{ uri: photo.uri }} style={styles.thumbnail} resizeMode="cover" />
                      ) : (
                        <View style={styles.previousPhotoPreview}>
                          <ImageIcon size={26} color="#9CA3AF" strokeWidth={1.8} />
                          <Text style={styles.previousPhotoExt}>{getFileExtension(photo.fileKey)}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.thumbnailRemoveButton}
                      activeOpacity={0.8}
                      onPress={() => removeAttachment(index)}>
                      <X size={16} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                ))}

                {photos.length < 3 && (
                  <TouchableOpacity style={styles.uploadBox} onPress={handlePickPhoto} activeOpacity={0.8}>
                    <Camera size={28} color="#525252" />
                    <Text style={styles.uploadBoxText}>Upload Foto</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.label}>Deskripsi Masalah</Text>
              <View style={styles.reportSummaryCard}>
                <Text style={styles.reportSummaryText}>{report?.description || '-'}</Text>
              </View>

              <Text style={styles.label}>Tambahan Informasi</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.textArea}
                placeholder="Deskripsikan tambahan informasi kamu"
                placeholderTextColor="#9CA3AF"
                editable={!isSubmitting}
              />
            </>
          ) : selectedTab === 'LAPORAN' ? (
            <>
              <Text style={styles.label}>Jenis Masalah</Text>
              <View style={styles.readonlyBox}>
                <Text style={styles.readonlyText}>{report?.issueType || ''}</Text>
              </View>

              <Text style={styles.label}>Lampiran Foto</Text>
              {previousEvidenceFiles.length > 0 ? (
                <View style={styles.previousPhotoRow}>
                  {previousEvidenceFiles.map((file) => {
                    const imageUri = file.url || file.fileKey;
                    const hasImageUrl = isRemoteImageUrl(imageUri);

                    return (
                      <View key={file.id} style={styles.previousPhotoTile}>
                        <TouchableOpacity
                          style={styles.previousPhotoPreview}
                          activeOpacity={hasImageUrl ? 0.85 : 1}
                          disabled={!hasImageUrl}
                          onPress={() => openPreview(imageUri)}>
                          {hasImageUrl ? (
                            <Image
                              source={{ uri: imageUri }}
                              style={styles.previousPhotoPreview}
                              resizeMode="cover"
                            />
                          ) : (
                            <>
                              <ImageIcon size={26} color="#9CA3AF" strokeWidth={1.8} />
                              <Text style={styles.previousPhotoExt}>{getFileExtension(file.fileKey)}</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.previousAttachmentBox}>
                  <Text style={styles.previousAttachmentText}>Belum ada lampiran sebelumnya</Text>
                </View>
              )}

              <Text style={styles.label}>Balasan Kamu</Text>
              <View style={styles.reportSummaryCard}>
                <Text style={styles.reportSummaryText}>{report?.description || '-'}</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.label}>Lampiran Foto</Text>
              <View style={styles.photoRow}>
                {photos.map((photo, index) => (
                  <View key={`photo-${index}-${photo.uri}`} style={styles.thumbnailWrapper}>
                    <TouchableOpacity activeOpacity={0.85} onPress={() => openPreview(photo.uri)}>
                      <Image
                        source={{ uri: photo.uri }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.thumbnailRemoveButton}
                      activeOpacity={0.8}
                      onPress={() => removeAttachment(index)}>
                      <X size={16} color="#FFFFFF" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                ))}
                {photos.length < 3 && (
                  <TouchableOpacity
                    style={styles.uploadBox}
                    onPress={handlePickPhoto}
                    activeOpacity={0.8}>
                    <Camera size={28} color="#525252" />
                    <Text style={styles.uploadBoxText}>Upload Foto</Text>
                  </TouchableOpacity>
                )}
              </View>

              {photos.length > 0 && (
                <Text style={styles.attachmentHintText}>{photos.length} file terpilih</Text>
              )}

              <Text style={styles.label}>Tambahan Informasi</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                style={styles.textArea}
                placeholder="Deskripsikan tambahan informasi kamu"
                placeholderTextColor="#9CA3AF"
                editable={!isSubmitting}
              />
            </>
          )}
        </ScrollView>

        {isReopenMode || selectedTab === 'BALASAN' ? (
          <Button
            onPress={handleSubmit}
            title={isReopenMode ? 'Kirim Laporan' : 'Kirim Balasan'}
            color="#3475E8"
            type="regular"
            textColor="white"
            textStyle={styles.primaryButtonText}
            style={[styles.primaryButton, !canSubmit && styles.disabledButton]}
            disable={!canSubmit || isSubmitting}
          />
        ) : null}
      </View>

      <Modal
        visible={showSuccess}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {!isReopenMode && (
              <TouchableOpacity
                style={styles.modalCloseButton}
                activeOpacity={0.8}
                onPress={() => setShowSuccess(false)}>
                <X size={24} color="#525252" />
            </TouchableOpacity>
            )}

            <View style={styles.successIconCircle}>
              <Check size={34} color="#16A34A" strokeWidth={2.6} />
            </View>

            <Text style={styles.successTitle}>
              {isReopenMode ? 'Pengajuan Pembukaan Laporan Berhasil Dikirim' : 'Balasan Berhasil Dikirim'}
            </Text>
            <Text style={styles.successDesc}>
              {isReopenMode
                ? 'Permintaan Anda untuk membuka kembali laporan telah kami terima. Tim kami akan meninjau pengajuan tersebut dan menghubungi Anda jika diperlukan.'
                : 'Informasi tambahan telah kami terima. Tim kami akan meninjau laporan dan menghubungi Anda jika diperlukan.'}
            </Text>
            <Text style={styles.successEstimate}>Estimasi peninjauan: 1×24 jam</Text>

            <Button
              onPress={() => {
                setShowSuccess(false);
                onSubmitSuccess();
              }}
              title={isReopenMode ? 'Kembali ke Laporan Saya' : 'Kembali ke Detail Laporan'}
              color="#3475E8"
              type="regular"
              textColor="white"
              textStyle={styles.primaryButtonText}
              style={styles.modalPrimaryButton}
            />

            <TouchableOpacity
              style={styles.modalGhostButton}
              onPress={() => {
                setShowSuccess(false);
                if (isReopenMode) {
                  onSubmitSuccess();
                }
              }}
              activeOpacity={0.8}>
              <Text style={styles.modalGhostButtonText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={Boolean(previewImageUri)}
        transparent
        animationType="fade"
        onRequestClose={closePreview}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity
            style={styles.previewCloseButton}
            activeOpacity={0.85}
            onPress={closePreview}>
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {previewImageUri ? (
            <Image
              source={{ uri: previewImageUri }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : null}
        </View>
      </Modal>
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
    paddingTop: 16,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    color: '#111827',
    fontFamily: 'Switzer-Semibold',
    fontSize: 24,
    lineHeight: 36,
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 14,
    color: '#1F2937',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  warningBox: {
    borderWidth: 1,
    borderColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  warningText: {
    flex: 1,
    color: '#D97706',
    fontSize: 14,
    fontFamily: 'Switzer-Medium',
    lineHeight: 20,
  },
  tabWrapper: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  tabButton: {
    minWidth: 74,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  tabButtonActive: {
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  tabButtonText: {
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 13,
  },
  tabButtonTextActive: {
    color: '#111827',
  },
  label: {
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 16,
    marginBottom: 10,
  },
  readonlyBox: {
    minHeight: 40,
    borderRadius: 8,
    backgroundColor: '#D4D4D4',
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 16,
  },
  readonlyText: {
    color: '#737373',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  reportSummaryCard: {
    borderRadius: 10,
    backgroundColor: '#D4D4D4',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  reportSummaryText: {
    color: '#374151',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  reportSummaryMeta: {
    color: '#737373',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  previousAttachmentBox: {
    minHeight: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    justifyContent: 'center',
    marginBottom: 16,
  },
  previousAttachmentText: {
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  previousPhotoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  previousPhotoTile: {
    width: 96,
  },
  previousPhotoPreview: {
    width: 96,
    height: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousPhotoExt: {
    marginTop: 6,
    color: '#6B7280',
    fontFamily: 'Switzer-Semibold',
    fontSize: 11,
  },
  previousPhotoName: {
    marginTop: 6,
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 11,
    lineHeight: 14,
  },
  previousAttachmentHint: {
    marginBottom: 16,
    color: '#9CA3AF',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  photoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  thumbnail: {
    width: 96,
    height: 96,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  thumbnailPlaceholder: {
    color: '#9CA3AF',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  thumbnailRemoveButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBox: {
    width: (Dimensions.get('window').width - 40 - 20) / 3,
    height: 96,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBoxText: {
    marginTop: 6,
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  attachmentHintText: {
    marginBottom: 12,
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    minHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlignVertical: 'top',
    color: '#111827',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 24,
    height: 52,
  },
  primaryButtonText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.55,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.52)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  successIconCircle: {
    width: 67,
    height: 67,
    borderRadius: 33,
    borderWidth: 4,
    borderColor: '#16A34A',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    color: '#000000',
    fontFamily: 'Switzer-Semibold',
    fontSize: 24,
    marginBottom: 8,
  },
  successDesc: {
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
    lineHeight: 24,
  },
  successEstimate: {
    marginTop: 8,
    marginBottom: 16,
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  modalPrimaryButton: {
    borderRadius: 22,
    height: 42,
    marginTop: 16,
  },
  modalGhostButton: {
    marginTop: 16,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalGhostButtonText: {
    color: '#000000',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  previewCloseButton: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  previewImage: {
    width: '100%',
    height: '78%',
  },
});
