import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  Fingerprint,
  MonitorSmartphone,
} from 'lucide-react-native';

export const Security = ({ navigation }: any) => {
  const [isBiometricActive, setIsBiometricActive] = useState(false);

  const SecurityItem = ({ title, sub, icon: Icon, type = 'arrow', value, onValueChange, onPress }: any) => (
    <TouchableOpacity style={styles.item} activeOpacity={0.7} disabled={type === 'switch'} onPress={onPress}>
      <View style={styles.row}>
        <View style={styles.iconBox}>
          <Icon size={22} color="#1A1A1A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>
        {type === 'arrow' ? (
          <ChevronRight size={20} color="#737373" />
        ) : (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{ false: '#E5E5E5', true: '#4F84F6' }}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Keamanan & PIN</Text>
      </View>

      <View style={styles.content}>
        <SecurityItem
          title="Ubah PIN"
          sub="Ganti PIN 6 digit kamu"
          icon={Lock}
          onPress={() => navigation.navigate('ChangePin')}
        />
        <SecurityItem
          title="Biometrik"
          sub="Fingerprint/ Face ID untuk login cepat"
          icon={Fingerprint}
          type="switch"
          value={isBiometricActive}
          onValueChange={setIsBiometricActive}
        />
        <SecurityItem
          title="Perangkat Terpercaya"
          sub="1 perangkat aktif"
          icon={MonitorSmartphone}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  headerTitle: { fontFamily: 'Switzer-Semibold', fontSize: 22, color: '#1A1A1A' },
  content: { paddingHorizontal: 20 },
  item: { paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 40, alignItems: 'center' },
  title: { fontSize: 16, fontFamily: 'Switzer-Bold', color: '#1A1A1A' },
  sub: { fontSize: 12, fontFamily: 'Switzer-Regular', color: '#737373', marginTop: 4 },
});
