import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, CreditCard, ShieldCheck, HelpCircle, Bell } from 'lucide-react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { createStyles } from './styles';
import ProfileMenuItem from './components/ProfileMenuItem';
import { useNavigation } from '@react-navigation/native';
import { handleLogout } from '@/utils/Common';
import { IconNotification } from '@/assets/icons';

export const Profile = () => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
        <TouchableOpacity onPress={() => handleLogout()}>
          <IconNotification />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>PS</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>Prabu Suwito</Text>
            <Text style={styles.userPhone}>+62731802312931</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Terverifikasi</Text>
          </View>
        </View>

        <View style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierLabel}>Tier</Text>
            <Text style={styles.tierLabel}>Limit Harian</Text>
          </View>
          <View style={styles.tierHeader}>
            <Text style={styles.tierValue}>KYC Verified</Text>
            <Text style={styles.limitValue}>Rp 25,000,000</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <ProfileMenuItem
            title="Pengaturan"
            icon={Settings}
            onPress={() => navigation.navigate('Settings')}
          />
          <ProfileMenuItem
            title="Rekening Bank"
            icon={CreditCard}
            onPress={() => navigation.navigate('BankAccounts')}
          />
          <ProfileMenuItem
            title="Keamanan & PIN"
            icon={ShieldCheck}
            onPress={() => navigation.navigate('Security')}
          />
          <ProfileMenuItem
            title="Pusat Bantuan"
            icon={HelpCircle}
            onPress={() => navigation.navigate('HelpCenter')}
            showBorder={false}
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => handleLogout()}>
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
