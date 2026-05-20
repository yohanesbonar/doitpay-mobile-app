import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { styles } from '../styles';
import { Search, CreditCard, QrCode, CheckCircle2, Circle } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '../../addBankAccount/styles';
import { useVAMethods } from '@/hooks/useTransferMutation';

interface BankOption {
  id: string;
  name: string;
  image: any;
}

interface PaymentMethodProps {
  selectedMethod: 'VA' | 'QRIS';
  onSelect: (method: 'VA' | 'QRIS') => void;
  onSelectBank: (data: any) => void;
}

const BANKS: BankOption[] = [
  {
    id: '1',
    shortName: 'BCA',
    name: 'Bank Central Asia',
    image: require('../../../../assets/images/ic-BCA.png'),
  },
  {
    id: '2',
    shortName: 'CIMB',
    name: 'CIMB Digital',
    image: require('../../../../assets/images/ic-CIMB.png'),
  },
];

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelect,
  onSelectBank,
}) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [banks, setBanks] = useState([]);

  const { mutate: VAMethods, isPending: isLoadingVAMethods } = useVAMethods();

  const { colors } = useTheme();
  const styles = createStyles(colors);

  useEffect(() => {
    VAMethods(
      {},
      {
        onSuccess: (data) => {
          console.log('VAMethods successfully:', data);
          setBanks(data?.data?.items ?? []);
        },
        onError: (error) => {
          console.error('Error VAMethods:', error);
        },
      },
    );
  }, []);

  return (
    <View
      style={{
        paddingTop: 16,
        marginTop: 16,
        backgroundColor: colors.pageBackground,
        paddingHorizontal: 20,
      }}>
      <Text
        style={[styles.label, { fontSize: 20, marginBottom: 16, fontFamily: 'Switzer-Medium' }]}>
        Metode Pembayaran
      </Text>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => onSelect('VA')}
          style={{
            flex: 1,
            flexDirection: 'row',
            height: 37,
            backgroundColor: selectedMethod === 'VA' ? '#3B82F6' : '#FFF',
            borderRadius: 26,
            borderWidth: selectedMethod === 'VA' ? 0 : 1,
            borderColor: '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}>
          <CreditCard
            size={20}
            color={selectedMethod === 'VA' ? '#FFF' : '#0A0A0A'}
            strokeWidth={2.5}
          />
          <Text
            style={{
              marginLeft: 10,
              color: selectedMethod === 'VA' ? '#FFF' : '#0A0A0A',
              fontFamily: 'Switzer-Bold',
              fontSize: 14,
            }}>
            Virtual Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelect('QRIS')}
          style={{
            flex: 1,
            flexDirection: 'row',
            height: 37,
            backgroundColor: selectedMethod === 'QRIS' ? '#3B82F6' : '#FFF',
            borderRadius: 26,
            borderWidth: selectedMethod === 'QRIS' ? 0 : 1,
            borderColor: '#E5E7EB',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <QrCode
            size={20}
            color={selectedMethod === 'QRIS' ? '#FFF' : '#0A0A0A'}
            strokeWidth={2.5}
          />
          <Text
            style={{
              marginLeft: 10,
              color: selectedMethod === 'QRIS' ? '#FFF' : '#0A0A0A',
              fontFamily: 'Switzer-Bold',
              fontSize: 14,
            }}>
            QRIS
          </Text>
        </TouchableOpacity>
      </View>

      {selectedMethod === 'VA' ? (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#FFF',
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 14,
              paddingHorizontal: 16,
              height: 52,
              marginBottom: 16,
            }}>
            <Search size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Nama, bank atau nomor rekening"
              placeholderTextColor="#9CA3AF"
              style={{ flex: 1, marginLeft: 10, fontFamily: 'Switzer-Regular', fontSize: 15 }}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {banks.map((item) => {
            const isChosen = selectedBank === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedBank(item.id) + onSelectBank(item)}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 8,
                  backgroundColor: isChosen ? '#EFF6FF' : '#FFF',
                  borderRadius: 8,
                  borderWidth: 1.5,
                  borderColor: isChosen ? '#3B82F6' : '#F3F4F6',
                  marginBottom: 12,
                }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: '#FFF',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                    borderWidth: 1,
                    borderColor: '#F3F4F6',
                  }}>
                  <Image
                    source={{ uri: item?.logoUrl }}
                    style={{ width: '80%', height: '80%', resizeMode: 'contain' }}
                  />
                </View>

                <Text
                  style={{
                    flex: 1,
                    fontFamily: 'Switzer-Medium',
                    fontSize: 16,
                    color: '#111827',
                  }}>
                  {item.name}
                </Text>

                {isChosen ? (
                  <CheckCircle2
                    size={30}
                    color="#FFF"
                    fill="#3B82F6"
                    strokeWidth={1}
                    colorSecondary="#FFF"
                  />
                ) : (
                  <Circle size={30} color="#D1D5DB" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <View
          style={{
            backgroundColor: '#F0F7FF',
            padding: 20,
            borderRadius: 16,
            borderStyle: 'dashed',
            borderWidth: 1.5,
            borderColor: '#3B82F6',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <QrCode size={24} color="#3B82F6" style={{ marginRight: 12 }} />
          <Text
            style={{
              flex: 1,
              color: '#1E40AF',
              fontSize: 14,
              fontFamily: 'Switzer-Regular',
              lineHeight: 20,
            }}>
            Kode QRIS akan dibuat setelah konfirmasi. Bagikan ke pengirim untuk pembayaran.
          </Text>
        </View>
      )}
    </View>
  );
};

export default PaymentMethod;
