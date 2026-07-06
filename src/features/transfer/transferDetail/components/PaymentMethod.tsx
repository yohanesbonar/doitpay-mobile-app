import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import { styles } from '../styles';
import { Search, CreditCard, QrCode, CheckCircle2, Circle } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '../../addBankAccount/styles';
import { useVAMethods } from '@/hooks/useTransferMutation';
import _ from 'lodash';

interface BankOption {
  id: string;
  name: string;
  image: any;
}

interface PaymentMethodProps {
  selectedMethod: 'VA' | 'QRIS';
  onSelect: (method: 'VA' | 'QRIS') => void;
  onSelectBank: (data: any) => void;
  initialBankPayment?: any;
  styleProps: any;
  isVAEnabled?: boolean;
  isQRISEnabled?: boolean;
  isLoading?: boolean;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelect,
  onSelectBank,
  initialBankPayment,
  styleProps,
  isVAEnabled = true,
  isQRISEnabled = true,
  isLoading = false,
}) => {
  const [selectedBank, setSelectedBank] = useState(initialBankPayment?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [banks, setBanks] = useState([]);

  const { mutate: VAMethods, isPending: isLoadingVAMethods } = useVAMethods();

  const { colors } = useTheme();
  const styles = createStyles(colors);

  const fetchVAMethodsFromApi = (search: string) => {
    VAMethods(
      { name: search.trim() },
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
  };

  const debouncedSearch = useCallback(
    _.debounce((text: string) => {
      fetchVAMethodsFromApi(text);
    }, 500),
    [VAMethods],
  );

  useEffect(() => {
    fetchVAMethodsFromApi('');

    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    if (initialBankPayment?.id) {
      setSelectedBank(initialBankPayment.id);
    }
  }, [initialBankPayment]);

  const renderHighlightedName = (name: string, search: string) => {
    if (!search.trim()) {
      return <Text>{name}</Text>;
    }

    const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, 'gi');

    const parts = name.split(regex);

    return (
      <Text>
        {parts.map((part, index) => {
          const isMatch = part.toLowerCase() === search.toLowerCase().trim();

          return (
            <Text
              key={index}
              style={{
                fontFamily: isMatch ? 'Switzer-Bold' : 'Switzer-Regular',
              }}>
              {part}
            </Text>
          );
        })}
      </Text>
    );
  };

  return (
    <View
      style={[
        {
          paddingTop: 16,
          marginTop: 16,
          backgroundColor: colors.pageBackground,
          paddingHorizontal: 20,
        },
        styleProps,
      ]}>
      <Text
        style={[styles.label, { fontSize: 20, marginBottom: 16, fontFamily: 'Switzer-Medium' }]}>
        Metode Pembayaran
      </Text>

      {isLoading ? (
        <View
          style={{
            backgroundColor: '#F9FAFB',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}>
          <ActivityIndicator size="small" color="#3B82F6" />
          <Text
            style={{
              color: '#374151',
              fontFamily: 'Switzer-Regular',
              fontSize: 13,
            }}>
            Memuat metode pembayaran...
          </Text>
        </View>
      ) : null}

      {!isLoading && !isVAEnabled && !isQRISEnabled ? (
        <View
          style={{
            backgroundColor: '#FEF2F2',
            borderWidth: 1,
            borderColor: '#FECACA',
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 20,
          }}>
          <Text
            style={{
              color: '#B91C1C',
              fontFamily: 'Switzer-Regular',
              fontSize: 13,
            }}>
            Metode pembayaran sedang tidak tersedia.
          </Text>
        </View>
      ) : null}

      {!isLoading && (isVAEnabled || isQRISEnabled) ? (
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {isVAEnabled ? (
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
                marginRight: isQRISEnabled ? 8 : 0,
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
          ) : null}

          {isQRISEnabled ? (
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
          ) : null}
        </View>
      ) : null}

      {!isLoading && selectedMethod === 'VA' && isVAEnabled ? (
        <View style={{ paddingBottom: 70 }}>
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
              onChangeText={(text) => {
                setSearchQuery(text);
                debouncedSearch(text);
              }}
            />
          </View>

          {banks.map((item) => {
            const isChosen = selectedBank === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setSelectedBank(item.id);
                  onSelectBank(item);
                }}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 8,
                  backgroundColor: isChosen ? '#C2D8FF' : '#FFF',
                  borderRadius: 8,
                  borderWidth: 1.5,
                  borderColor: isChosen ? '#3B82F6' : '#F3F4F6',
                  marginBottom: 12,
                }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#FFF',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 16,
                  }}>
                  <Image
                    source={{ uri: item?.logoUrl }}
                    style={{ width: '100%', height: '100%', resizeMode: 'contain', borderRadius: 8 }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#111827',
                    }}>
                    {item?.name}
                  </Text>
                </View>

                {isChosen ? (
                  <CheckCircle2
                    size={24}
                    color="#FFF"
                    fill="#3B82F6"
                    strokeWidth={1}
                    colorSecondary="#FFF"
                  />
                ) : (
                  <Circle size={24} color="#525252" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : !isLoading && selectedMethod === 'QRIS' && isQRISEnabled ? (
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
            marginBottom: 80,
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
      ) : null}
    </View>
  );
};

export default PaymentMethod;
