import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from './styles';

interface DataSubmittedViewProps {
  onContinueHome: () => void;
}

export const DataSubmittedView = ({ onContinueHome }: DataSubmittedViewProps) => {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../../assets/images/ic-data-already-sent.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>Data telah dikirim</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Proses Verifikasi</Text>
          <Text style={styles.cardDescription}>
            Data kamu berhasil dikirim! Tim kami sedang melakukan verifikasi untuk memastikan data yang kamu
            berikan sudah sesuai. Proses ini biasanya memerlukan waktu hingga 1x24 jam. Kamu akan menerima
            notifikasi begitu proses verifikasi selesai.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={onContinueHome} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Lanjut ke Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DataSubmittedView;
