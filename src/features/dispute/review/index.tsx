import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';

interface DisputeReviewViewProps {
  issueType: string;
  description: string;
  attachmentCount: number;
  onPressBack: () => void;
  onSubmit: () => void;
}

export const DisputeReviewView = ({
  issueType,
  description,
  attachmentCount,
  onPressBack,
  onSubmit,
}: DisputeReviewViewProps) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar title="Tinjau Laporan" onPressBack={onPressBack} titlePosition="left" />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Jenis Masalah</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{issueType}</Text>
          </View>

          <Text style={styles.sectionTitle}>Lampiran Foto</Text>
          <View style={styles.card}>
            <View style={styles.attachmentRow}>
              {Array.from({ length: Math.min(attachmentCount, 3) }).map((_, index) => (
                <View key={`attachment-${index}`} style={styles.previewBox}>
                  <Text style={styles.previewText}>IMG {index + 1}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.uploadButton} activeOpacity={0.8}>
                <Text style={styles.uploadText}>Upload Foto</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Deskripsi Masalah</Text>
          <View style={styles.card}>
            <Text style={styles.descriptionText}>{description}</Text>
          </View>
        </ScrollView>

        <Button
          onPress={onSubmit}
          title="Kirim Laporan"
          color="#3475E8"
          type="regular"
          textColor="white"
          textStyle={styles.primaryButtonText}
          style={styles.primaryButton}
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
  sectionTitle: {
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    marginBottom: 6,
    marginTop: 6,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  cardText: {
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 14,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewBox: {
    width: 82,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F8FF',
    marginRight: 8,
  },
  previewText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontFamily: 'Switzer-Medium',
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    height: 34,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  uploadText: {
    color: '#111827',
    fontFamily: 'Switzer-Medium',
    fontSize: 12,
  },
  descriptionText: {
    color: '#111827',
    fontFamily: 'Switzer-Regular',
    fontSize: 13,
    lineHeight: 20,
  },
  primaryButton: {
    borderRadius: 24,
    height: 48,
    marginTop: 14,
  },
  primaryButtonText: {
    fontFamily: 'Switzer-Bold',
    fontSize: 15,
  },
});
