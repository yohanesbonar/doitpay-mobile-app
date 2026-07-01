import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import { DisputeReason } from './api/dispute-reasons-api';

const MANUAL_OTHER_OPTION_ID = 'MANUAL_OTHER';

interface DisputeIssueTypeOption {
  id: string;
  label: string;
  type?: string;
}

interface DisputeIssueTypeViewProps {
  onPressBack: () => void;
  onContinue: (selectedReason: DisputeIssueTypeOption, description: string) => void;
  issueOptions: DisputeReason[];
  isLoading?: boolean;
}

export const DisputeIssueTypeView = ({
  onPressBack,
  onContinue,
  issueOptions,
  isLoading,
}: DisputeIssueTypeViewProps) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');

  const normalizedOptions = useMemo(() => {
    const apiOptions = issueOptions
      .map((option) => ({
        id: option.id,
        label: option.label,
        type: option.type,
      }))
      .filter((option) => option.id !== MANUAL_OTHER_OPTION_ID);

    const hasOtherFromApi = apiOptions.some((option) =>
      option.label?.toLowerCase().includes('lain'),
    );

    if (hasOtherFromApi) {
      return apiOptions;
    }

    return [
      ...apiOptions,
      {
        id: MANUAL_OTHER_OPTION_ID,
        label: 'Lainnya',
        type: 'ALL',
      },
    ];
  }, [issueOptions]);

  const selectedReason = useMemo(
    () => normalizedOptions.find((option) => option.id === selectedIssue),
    [normalizedOptions, selectedIssue],
  );

  const isOther = selectedReason?.id === MANUAL_OTHER_OPTION_ID;

  const canContinue = useMemo(() => {
    if (!selectedReason) return false;
    if (isOther) return customIssue.trim().length > 3;
    return true;
  }, [selectedReason, customIssue, isOther]);

  const issueLabel = isOther ? customIssue.trim() : selectedReason?.label || '';

  const handleContinue = () => {
    if (!selectedReason) {
      return;
    }

    onContinue(
      {
        ...selectedReason,
        label: issueLabel,
      },
      issueLabel,
    );
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
          <Text style={styles.title}>Pilih Jenis Masalah</Text>
          <Text style={styles.subtitle}>
            Pilih kategori yang paling sesuai agar laporan dapat diproses lebih cepat.
          </Text>

          {isLoading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color="#3475E8" />
              <Text style={styles.loadingText}>Memuat jenis masalah...</Text>
            </View>
          ) : normalizedOptions.length > 0 ? (
            normalizedOptions.map((option) => {
              const selected = selectedIssue === option.id;

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.optionButton, selected && styles.optionButtonActive]}
                  onPress={() => setSelectedIssue(option.id)}
                  activeOpacity={0.8}>
                  <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
                    {selected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.loadingWrapper}>
              <Text style={styles.loadingText}>Jenis masalah belum tersedia.</Text>
            </View>
          )}

          {isOther && (
            <View style={styles.otherWrapper}>
              <Text style={styles.inputLabel}>Tuliskan Masalah</Text>
              <TextInput
                value={customIssue}
                onChangeText={setCustomIssue}
                placeholder="Masukkan kendalamu"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>
          )}
        </ScrollView>

        <Button
          onPress={handleContinue}
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
  },
  title: {
    color: '#000000',
    fontFamily: 'Switzer-Semibold',
    fontSize: 24,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: '#000000',
    fontFamily: 'Switzer-Regular',
    fontSize: 14,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    height: 42,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  optionButtonActive: {
    borderColor: '#3475E8',
    backgroundColor: '#FFFFFF',
  },
  optionText: {
    color: '#1F2937',
    fontFamily: 'Switzer-Medium',
    fontSize: 13,
  },
  optionTextActive: {
    color: '#1F2937',
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
  radioOuterActive: {
    borderColor: '#3475E8',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3475E8',
  },
  otherWrapper: {
    marginTop: 8,
  },
  inputLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Switzer-Regular',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    fontFamily: 'Switzer-Regular',
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
  loadingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#6B7280',
    fontFamily: 'Switzer-Regular',
    fontSize: 13,
    textAlign: 'center',
  },
});
