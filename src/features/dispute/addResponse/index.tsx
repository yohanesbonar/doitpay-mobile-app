import React, { useMemo, useState } from 'react';
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
} from 'react-native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';
import { AlertCircle, Check, Upload, X } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';

interface DisputeAddResponseViewProps {
  reportId: string;
  onPressBack: () => void;
  onSubmitSuccess: () => void;
}

interface PhotoItem {
  uri: string;
  name?: string;
  size?: number;
}

const formatReportCode = (id: string): string => {
  const digits = id.replace(/\D/g, '');
  if (!digits) return '#D-00000';
  return `#D-${digits.slice(-5)}`;
};

export const DisputeAddResponseView = ({
  reportId,
  onPressBack,
  onSubmitSuccess,
}: DisputeAddResponseViewProps) => {
  const [description, setDescription] = useState(
    'Salah pengiriman transfer\nTanggal: 29 Mei 2026\nNominal: Rp 100,000',
  );
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const removeAttachment = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePickPhoto = async () => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        selectionLimit: 0,
        quality: 0.8,
      };

      const result = await launchImageLibrary(options);

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        Alert.alert('Error', `Failed to pick image: ${result.errorMessage}`);
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const newPhotos = result.assets.map((asset: any) => ({
          uri: asset.uri || '',
          name: asset.fileName || `photo-${Date.now()}`,
          size: asset.fileSize,
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Gagal memilih foto dari galeri');
    }
  };

  const canSubmit = useMemo(() => description.trim().length > 10 && photos.length > 0, [description, photos]);

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      // TODO: Nanti integrate dengan API untuk upload photos dan description
      // Contoh struktur data yang akan dikirim:
      // {
      //   reportId,
      //   description,
      //   photos: [
      //     { uri: 'file://...', name: 'photo1.jpg', size: 1024 },
      //     { uri: 'file://...', name: 'photo2.jpg', size: 2048 },
      //   ]
      // }

      // Simulasi submit (API integration akan dilakukan nanti)
      await new Promise((resolve: any) => setTimeout(resolve, 1000));

      setShowSuccess(true);
    } catch (error) {
      console.error('Error submitting response:', error);
      Alert.alert('Error', 'Gagal mengirim balasan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar
        title={`Laporan ${formatReportCode(reportId)}`}
        onPressBack={onPressBack}
        titlePosition="left"
        titleStyle="bold"
      />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Tambahan Laporan</Text>
          <Text style={styles.subtitle}>Pastikan detail laporan sudah sesuai.</Text>

          <View style={styles.warningBox}>
            <View style={styles.warningIconWrap}>
              <AlertCircle size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.warningText}>Tim kami butuh informasi tambahan agar laporan bisa dilanjutkan.</Text>
          </View>

          <Text style={styles.label}>Lampiran Foto</Text>
          <View style={styles.photoRow}>
            {photos.map((photo, index) => (
              <View key={`photo-${index}-${photo.uri}`} style={styles.thumbnailWrapper}>
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.thumbnailRemoveButton}
                  activeOpacity={0.8}
                  onPress={() => removeAttachment(index)}>
                  <X size={16} color="#FFFFFF" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={handlePickPhoto}
              activeOpacity={0.8}>
              <Upload size={28} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.uploadBoxText}>Upload Foto</Text>
            </TouchableOpacity>
          </View>

          {photos.length > 0 && (
            <Text style={styles.attachmentHintText}>{photos.length} file terpilih</Text>
          )}

          <Text style={styles.label}>Balasan Kamu</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            style={styles.textArea}
            placeholder="Jelaskan tambahan informasi"
            placeholderTextColor="#9CA3AF"
            editable={!isSubmitting}
          />
        </ScrollView>

        <Button
          onPress={handleSubmit}
          title="Kirim Balasan"
          color="#3475E8"
          type="regular"
          textColor="white"
          textStyle={styles.primaryButtonText}
          style={[styles.primaryButton, !canSubmit && styles.disabledButton]}
          disable={!canSubmit || isSubmitting}
        />
      </View>

      <Modal visible={showSuccess} transparent animationType="fade" onRequestClose={() => setShowSuccess(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              activeOpacity={0.8}
              onPress={() => setShowSuccess(false)}>
              <X size={24} color="#525252" />
            </TouchableOpacity>

            <View style={styles.successIconCircle}>
              <Check size={34} color="#16A34A" strokeWidth={2.6} />
            </View>

            <Text style={styles.successTitle}>Balasan Berhasil Dikirim</Text>
            <Text style={styles.successDesc}>
              Informasi tambahan telah kami terima. Tim kami akan meninjau laporan dan menghubungi Anda jika
              diperlukan.
            </Text>
            <Text style={styles.successEstimate}>Estimasi peninjauan: 1×24 jam</Text>

            <Button
              onPress={() => {
                setShowSuccess(false);
                onSubmitSuccess();
              }}
              title="Kembali ke Detail Laporan"
              color="#3475E8"
              type="regular"
              textColor="white"
              textStyle={styles.primaryButtonText}
              style={styles.modalPrimaryButton}
            />

            <TouchableOpacity
              style={styles.modalGhostButton}
              onPress={() => setShowSuccess(false)}
              activeOpacity={0.8}>
              <Text style={styles.modalGhostButtonText}>Keluar</Text>
            </TouchableOpacity>
          </View>
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
    paddingBottom: 14,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  title: {
    color: '#111827',
    fontFamily: 'Switzer-Bold',
    fontSize: 28,
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
  label: {
    color: '#111827',
    fontFamily: 'Switzer-Bold',
    fontSize: 16,
    marginBottom: 10,
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
    width: 96,
    height: 96,
    borderRadius: 8,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FAFAFA',
  },
  uploadBoxText: {
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
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
});
