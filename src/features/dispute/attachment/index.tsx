import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';

interface DisputeAttachmentViewProps {
  issueType: string;
  transactionId?: string;
  onPressBack: () => void;
  onContinue: (description: string, attachmentCount: number) => void;
}

export const DisputeAttachmentView = ({
  issueType,
  transactionId,
  onPressBack,
  onContinue,
}: DisputeAttachmentViewProps) => {
  const [description, setDescription] = useState('');
  const [attachmentCount, setAttachmentCount] = useState(1);

  const canContinue = useMemo(() => description.trim().length > 3, [description]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar title="Lampiran" onPressBack={onPressBack} titlePosition="left" />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Lampiran</Text>
          <Text style={styles.subtitle}>Tambahkan foto atau tangkapan layar sebagai bukti.</Text>

          <View style={styles.issueCard}>
            <Text style={styles.issueType}>{issueType}</Text>
            <Text style={styles.issueMeta}>ID: {transactionId || '-'}</Text>
          </View>

          <View style={styles.uploadRow}>
            <View style={styles.previewBox}>
              <Text style={styles.previewText}>{attachmentCount} file</Text>
            </View>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => setAttachmentCount((value) => value + 1)}
              activeOpacity={0.8}>
              <Text style={styles.uploadButtonText}>Upload Foto</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Tuliskan detail masalah</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Contoh: Detail transaksi 20 Maret 2026, Transfer Rp 150.000"
            placeholderTextColor="#9CA3AF"
            multiline
            style={styles.textArea}
          />
        </ScrollView>

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setAttachmentCount((value) => value + 1)}
          activeOpacity={0.85}>
          <Plus size={18} color="#FFFFFF" />
        </TouchableOpacity>

        <Button
          onPress={() => onContinue(description, attachmentCount)}
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
  issueCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  issueType: {
    fontFamily: 'Switzer-Bold',
    fontSize: 14,
    color: '#111827',
  },
  issueMeta: {
    marginTop: 2,
    fontFamily: 'Switzer-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  uploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  previewBox: {
    width: 110,
    height: 74,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D9E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F8FF',
    marginRight: 10,
  },
  previewText: {
    fontFamily: 'Switzer-Medium',
    fontSize: 12,
    color: '#1D4ED8',
  },
  uploadButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontFamily: 'Switzer-Medium',
    color: '#1F2937',
    fontSize: 13,
  },
  inputLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
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
  fab: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    right: 20,
    bottom: 82,
    backgroundColor: '#EC4899',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
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
