import { WebViewContainer } from '@/components/molecules/WebView/WebViewContainer';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import React, { FC } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface PrivacyAndPolicyContentProps {
  onClose: () => void;
}

export const PrivacyAndPolicyContent: FC<PrivacyAndPolicyContentProps> = ({ onClose }) => {
  return (
    <WebViewContainer
      header={
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <ChevronLeft size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy and Policy</Text>
        </View>
      }
      source="https://google.com"
    />
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
});
