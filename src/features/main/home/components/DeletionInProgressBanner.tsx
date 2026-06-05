import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronRight, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { CircleAlertIcon } from 'lucide-react-native';

interface Props {
  isShow: boolean;
}

export const DeletionInProgressBanner = ({ isShow }: Props) => {
  const navigation = useNavigation<any>();

  if (!isShow) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('DeleteAccountStatus')}
      activeOpacity={0.7}>
      <View style={styles.iconWrapper}>
        <CircleAlertIcon size={20} color="#FEF9C3" strokeWidth={2} />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.text}>Penghapusan Akun Sedang Diproses</Text>
      </View>

      <ChevronRight size={20} color="#525252" strokeWidth={2} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginHorizontal: 24,
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    color: '#E25C5C',
    fontFamily: 'Switzer-Semibold',
    fontSize: 14,
    lineHeight: 20,
  },
});
