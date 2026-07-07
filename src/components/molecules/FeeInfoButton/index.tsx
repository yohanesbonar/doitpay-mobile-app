import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { InfoIcon } from 'lucide-react-native';

interface FeeInfoButtonProps {
  message: string;
  iconSize?: number;
  iconColor?: string;
}

export const FeeInfoButton = ({
  message,
  iconSize = 12,
  iconColor = '#6B7280',
}: FeeInfoButtonProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <InfoIcon size={iconSize} style={{ marginTop: 2 }} color={iconColor} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.card}>
            <Text style={styles.text}>{message}</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  text: {
    fontFamily: 'Switzer-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: '#111827',
    textAlign: 'center',
  },
});

export default FeeInfoButton;
