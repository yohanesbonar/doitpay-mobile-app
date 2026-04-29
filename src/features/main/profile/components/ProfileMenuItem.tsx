import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

interface ProfileMenuItemProps {
  title: string;
  icon: LucideIcon;
  onPress: () => void;
  showBorder?: boolean;
}

const ProfileMenuItem = ({
  title,
  icon: Icon,
  onPress,
  showBorder = true,
}: ProfileMenuItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, showBorder && styles.border]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.leftSection}>
        <Icon size={22} color="#1A1A1A" strokeWidth={1.5} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <ChevronRight size={20} color="#737373" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    backgroundColor: '#FFF',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Switzer-Medium',
    color: '#1A1A1A',
  },
});

export default ProfileMenuItem;
