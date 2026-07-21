import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import HeaderToolbar from '@/components/molecules/HeaderToolbar';
import { Check } from 'lucide-react-native';
import { createStyles } from './styles';

interface ConfirmDataViewProps {
  onPressBack: () => void;
}

const rows = [
  { label: 'Nama Lengkap', value: 'John Weak Dawn' },
  { label: 'NIK', value: '3209**********90122' },
  { label: 'Tempat, Tgl Lahir', value: 'Jakarta, 13-03-1994' },
  { label: 'Jenis kelamin', value: 'Laki-laki' },
  { label: 'Alamat', value: 'Jl. Margondar Rayap No. 12, Depok' },
];

export const ConfirmDataView = ({ onPressBack }: ConfirmDataViewProps) => {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <HeaderToolbar
        title="Konfirmasi Data"
        titlePosition="center"
        titleStyle="medium"
        backgroundColor='#FFF'
        onPressBack={onPressBack}
        onPressRightButton={onPressBack}
      />

      <View style={styles.content}>
        <View style={styles.successBanner}>
          <Check size={22} color="#16A34A" strokeWidth={2.6} />
          <Text style={styles.successText}>Data berhasil diekstrak dari KTP</Text>
        </View>

        <Text style={styles.sectionTitle}>Pastikan data berikut</Text>

        <View style={styles.card}>
          {rows.map((row, index) => {
            const isLast = index === rows.length - 1;
            return (
              <View key={row.label} style={[styles.row, isLast && styles.rowLast]}>
                <Text style={styles.label}>{row.label}</Text>
                <Text style={styles.value}>{row.value}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.note}>Nama terverifikasi akan menjadi nama pengirim di semua transfer kamu</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => Alert.alert('Sukses', 'Data KYC berhasil dikonfirmasi.')}
          activeOpacity={0.85}>
          <Text style={styles.buttonText}>Submit Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmDataView;
