import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import Button from '@/components/atoms/Button';
import { ISSUE_OPTIONS } from '../types';

interface DisputeIssueTypeViewProps {
  onPressBack: () => void;
  onContinue: (issueType: string, description: string) => void;
}

export const DisputeIssueTypeView = ({ onPressBack, onContinue }: DisputeIssueTypeViewProps) => {
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');

  const isOther = selectedIssue === 'Lainnya';

  const canContinue = useMemo(() => {
    if (!selectedIssue) return false;
    if (isOther) return customIssue.trim().length > 3;
    return true;
  }, [selectedIssue, customIssue, isOther]);

  const issueLabel = isOther ? customIssue.trim() : selectedIssue;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <HeaderToolbar title="Laporkan Masalah" onPressBack={onPressBack} titlePosition="left" />

      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Pilih Jenis Masalah</Text>
          <Text style={styles.subtitle}>
            Pilih kategori yang paling sesuai agar laporan dapat diproses lebih cepat.
          </Text>

          {ISSUE_OPTIONS.map((option) => {
            const selected = selectedIssue === option;

            return (
              <TouchableOpacity
                key={option}
                style={[styles.optionButton, selected && styles.optionButtonActive]}
                onPress={() => setSelectedIssue(option)}
                activeOpacity={0.8}>
                <View style={[styles.radioOuter, selected && styles.radioOuterActive]}>
                  {selected && <View style={styles.radioInner} />}
                </View>
                <Text style={[styles.optionText, selected && styles.optionTextActive]}>{option}</Text>
              </TouchableOpacity>
            );
          })}

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
          onPress={() => onContinue(issueLabel, issueLabel)}
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
    marginBottom: 18,
    color: '#6B7280',
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
    backgroundColor: '#F5F9FF',
  },
  optionText: {
    color: '#1F2937',
    fontFamily: 'Switzer-Medium',
    fontSize: 13,
  },
  optionTextActive: {
    color: '#0F3FA8',
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
});
