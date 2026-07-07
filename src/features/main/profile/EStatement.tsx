import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, CheckCircle2 } from 'lucide-react-native';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import Share from 'react-native-share';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { DateBottomSheet } from '@/components/molecules/DateBottomsheet';
import { useGenerateStatementMutation } from '@/features/statement/hooks/useGenerateStatementMutation';
import { useStatementStatusQuery } from '@/features/statement/hooks/useStatementStatusQuery';
import { StatementStatus } from '@/features/statement/types';

const monthsLabel = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const EStatement = ({ navigation }: any) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<{ month: number; year: number } | null>(
    null,
  );
  const [statementId, setStatementId] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { mutate: generateStatement } = useGenerateStatementMutation();
  const { data: statementStatusData } = useStatementStatusQuery(statementId, isGenerating);

  useEffect(() => {
    const statementData = statementStatusData?.data;
    if (!statementData) return;

    if (statementData.status === StatementStatus.READY) {
      setIsGenerating(false);
      setFileUrl(statementData.fileUrl);
      setShowSuccessModal(true);
      setStatementId(undefined);
    } else if (statementData.status === StatementStatus.FAILED) {
      setIsGenerating(false);
      setStatementId(undefined);
      Alert.alert('Gagal', statementData.errorMessage ?? 'Gagal membuat e-statement');
    }
  }, [statementStatusData]);

  const handleDownload = () => {
    if (!selectedPeriod) return;

    const periodDate = new Date(selectedPeriod.year, selectedPeriod.month, 1);
    const periodStart = format(startOfMonth(periodDate), 'yyyy-MM-dd');
    const periodEnd = format(endOfMonth(periodDate), 'yyyy-MM-dd');

    setIsGenerating(true);
    generateStatement(
      {
        payload: { periodStart, periodEnd },
        idempotencyKey: Date.now().toString(),
      },
      {
        onSuccess: (response) => setStatementId(response.data.id),
        onError: () => {
          setIsGenerating(false);
          Alert.alert('Gagal', 'Gagal membuat permintaan e-statement');
        },
      },
    );
  };

  const handleOpenFile = async () => {
    if (!fileUrl) return;

    try {
      const periodStart = statementStatusData?.data?.periodStart;
      const fileName = periodStart
        ? `E-Statement_${format(new Date(periodStart), 'MMMM_yyyy', { locale: id })}.pdf`
        : 'E-Statement.pdf';
      const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${fileName}`;

      const res = await ReactNativeBlobUtil.config({ path }).fetch('GET', fileUrl);
      await Share.open({ url: `file://${res.path()}`, title: fileName });
    } catch (error) {
      console.log('Open e-statement file error:', error);
      Alert.alert('Gagal', 'Gagal membuka file e-statement');
    }
  };

  const periodLabel = selectedPeriod
    ? `${monthsLabel[selectedPeriod.month]} ${selectedPeriod.year}`
    : 'Pilih bulan';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>E-Statement</Text>
      </View>

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.content}>
          <Text style={styles.label}>Periode</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowDatePicker(true)}>
            <Text style={[styles.dropdownText, !selectedPeriod && styles.dropdownPlaceholder]}>
              {periodLabel}
            </Text>
            <ChevronDown size={20} color="#737373" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.downloadButton,
              (!selectedPeriod || isGenerating) && styles.buttonDisabled,
            ]}
            disabled={!selectedPeriod || isGenerating}
            onPress={handleDownload}>
            {isGenerating ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.downloadButtonText}>Download E-Statement</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <DateBottomSheet
        isVisible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        selectedDate={{
          month: selectedPeriod?.month ?? 0,
          year: selectedPeriod?.year ?? new Date().getFullYear(),
        }}
        onSelect={setSelectedPeriod}
      />

      <Modal
        animationType="fade"
        transparent
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowSuccessModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <CheckCircle2 size={56} color="#22C55E" strokeWidth={1.5} />
                <Text style={styles.modalTitle}>E-Statement Berhasil Diunduh</Text>
                <Text style={styles.modalDescription}>
                  E-Statement telah berhasil diunduh dan tersimpan di perangkat Anda.
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setShowSuccessModal(false);
                    handleOpenFile();
                  }}>
                  <Text style={styles.modalButtonText}>Buka File</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: { paddingHorizontal: 20 },
  label: {
    fontSize: 14,
    fontFamily: 'Switzer-Medium',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
    color: '#1A1A1A',
  },
  dropdownPlaceholder: {
    color: '#A3A3A3',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  downloadButton: {
    backgroundColor: '#4A81FB',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D4D4D4',
  },
  downloadButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Switzer-Semibold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Switzer-Bold',
    color: '#1A1A1A',
    marginTop: 16,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    fontFamily: 'Switzer-Regular',
    color: '#737373',
    textAlign: 'center',
    marginTop: 8,
  },
  modalButton: {
    backgroundColor: '#4A81FB',
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Switzer-Semibold',
  },
});

export default EStatement;
