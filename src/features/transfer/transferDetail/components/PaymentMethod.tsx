import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  LayoutChangeEvent,
} from 'react-native';
import { styles } from '../styles';
import { Search, CreditCard, QrCode, CheckCircle2, Circle, Landmark } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { createStyles } from '../../addBankAccount/styles';
import { useVAMethods } from '@/hooks/useTransferMutation';
import { transferApi } from '@/api/transfer';
import type { ManualTransferMethod } from '@/api/transfer';
import { useTranslation } from 'react-i18next';

type PaymentMethodType = 'VA' | 'QRIS' | 'MANUAL_BANK';

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  onSelectBank: (data: any) => void;
  initialBankPayment?: any;
  styleProps: any;
  isVAEnabled?: boolean;
  isQRISEnabled?: boolean;
  isManualBankEnabled?: boolean;
  isLoading?: boolean;
  showBankError?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const PaymentMethod: React.FC<PaymentMethodProps> = ({
  selectedMethod,
  onSelect,
  onSelectBank,
  initialBankPayment,
  styleProps,
  isVAEnabled = true,
  isQRISEnabled = true,
  isManualBankEnabled = false,
  isLoading = false,
  showBankError = false,
  onLayout,
}) => {
  const [selectedBank, setSelectedBank] = useState(initialBankPayment?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [banks, setBanks] = useState<ManualTransferMethod[]>([]);
  const [vaBanksError, setVaBanksError] = useState(false);
  const [manualBanks, setManualBanks] = useState<ManualTransferMethod[]>([]);
  const [isLoadingManualBanks, setIsLoadingManualBanks] = useState(false);
  const [manualBanksError, setManualBanksError] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isCompactMethodLayout = !isManualBankEnabled;
  const hasTwoEnabledMethods = isVAEnabled && isQRISEnabled;

  const { mutate: VAMethods, isPending: isLoadingVAMethods } = useVAMethods();

  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { t } = useTranslation();

  const fetchVAMethodsFromApi = (search: string) => {
    setVaBanksError(false);
    VAMethods(
      { name: search.trim() },
      {
        onSuccess: (data) => {
          console.log('VAMethods successfully:', data);
          setBanks(data?.data?.items ?? []);
        },
        onError: (error) => {
          console.error('Error VAMethods:', error);
          setVaBanksError(true);
        },
      },
    );
  };

  const debouncedSearch = (text: string) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchVAMethodsFromApi(text);
    }, 500);
  };

  useEffect(() => {
    fetchVAMethodsFromApi('');

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!isManualBankEnabled) {
      return;
    }

    let isMounted = true;

    const fetchManualBanks = async () => {
      setIsLoadingManualBanks(true);
      setManualBanksError(false);

      try {
        const response = await transferApi.getManualTransferMethods();
        if (isMounted) {
          setManualBanks(response.data.items);
        }
      } catch (error) {
        console.error('Failed to load manual transfer methods:', error);
        if (isMounted) {
          setManualBanksError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoadingManualBanks(false);
        }
      }
    };

    fetchManualBanks();

    return () => {
      isMounted = false;
    };
  }, [isManualBankEnabled]);

  useEffect(() => {
    if (initialBankPayment?.id) {
      setSelectedBank(initialBankPayment.id);
    }
  }, [initialBankPayment]);

  const displayedBanks =
    selectedMethod === 'MANUAL_BANK'
      ? manualBanks.filter((item) =>
          `${item.name} ${item.code} ${item.shortName || ''}`
            .toLowerCase()
            .includes(searchQuery.trim().toLowerCase()),
        )
      : banks;

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
      ]}
      onLayout={onLayout}>
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

      {!isLoading && !isVAEnabled && !isQRISEnabled && !isManualBankEnabled ? (
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
          <Text style={{ color: '#B91C1C', fontFamily: 'Switzer-Regular', fontSize: 13 }}>
            Metode pembayaran sedang tidak tersedia.
          </Text>
        </View>
      ) : null}

      {!isLoading ? (
        <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
          {isVAEnabled ? (
            <TouchableOpacity
              onPress={() => onSelect('VA')}
              style={{
                flex: isCompactMethodLayout && !hasTwoEnabledMethods ? undefined : 1,
                width: isCompactMethodLayout && !hasTwoEnabledMethods ? '100%' : undefined,
                height: isCompactMethodLayout ? 40 : 65,
                backgroundColor: selectedMethod === 'VA' ? '#3B82F6' : '#FFF',
                borderRadius: isCompactMethodLayout ? 32 : 12,
                borderWidth: selectedMethod === 'VA' ? 0 : 1,
                borderColor: '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: isCompactMethodLayout ? 'row' : 'column',
                gap: isCompactMethodLayout ? 8 : 0,
                paddingHorizontal: isCompactMethodLayout ? 12 : 0,
                paddingVertical: isCompactMethodLayout ? 0 : 8,
              }}>
              <CreditCard
                size={20}
                color={selectedMethod === 'VA' ? '#FFF' : '#0A0A0A'}
                strokeWidth={2.5}
              />
              <Text
                style={{
                  marginTop: isCompactMethodLayout ? 0 : 6,
                  color: selectedMethod === 'VA' ? '#FFF' : '#0A0A0A',
                  fontFamily: selectedMethod === 'VA' ? 'Switzer-Bold' : 'Switzer-Regular',
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
                flex: isCompactMethodLayout && !hasTwoEnabledMethods ? undefined : 1,
                width: isCompactMethodLayout && !hasTwoEnabledMethods ? '100%' : undefined,
                height: isCompactMethodLayout ? 40 : 65,
                backgroundColor: selectedMethod === 'QRIS' ? '#3B82F6' : '#FFF',
                borderRadius: isCompactMethodLayout ? 32 : 12,
                borderWidth: selectedMethod === 'QRIS' ? 0 : 1,
                borderColor: '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: isCompactMethodLayout ? 'row' : 'column',
                gap: isCompactMethodLayout ? 8 : 0,
                paddingHorizontal: isCompactMethodLayout ? 12 : 0,
              }}>
              <QrCode
                size={20}
                color={selectedMethod === 'QRIS' ? '#FFF' : '#0A0A0A'}
                strokeWidth={2.5}
              />
              <Text
                style={{
                  marginTop: isCompactMethodLayout ? 0 : 6,
                  color: selectedMethod === 'QRIS' ? '#FFF' : '#0A0A0A',
                  fontFamily: selectedMethod === 'QRIS' ? 'Switzer-Bold' : 'Switzer-Regular',
                  fontSize: 14,
                }}>
                QRIS
              </Text>
            </TouchableOpacity>
          ) : null}
          {isManualBankEnabled ? (
            <TouchableOpacity
              onPress={() => onSelect('MANUAL_BANK')}
              style={{
                flex: 1,
                height: isCompactMethodLayout ? 40 : 65,
                backgroundColor: selectedMethod === 'MANUAL_BANK' ? '#3B82F6' : '#FFF',
                borderRadius: isCompactMethodLayout ? 32 : 12,
                borderWidth: selectedMethod === 'MANUAL_BANK' ? 0 : 1,
                borderColor: '#E5E7EB',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
              }}>
              <Landmark size={22} color={selectedMethod === 'MANUAL_BANK' ? '#FFF' : '#525252'} />
              <Text
                style={{
                  marginTop: 6,
                  color: selectedMethod === 'MANUAL_BANK' ? '#FFF' : '#0A0A0A',
                  fontFamily: selectedMethod === 'MANUAL_BANK' ? 'Switzer-Bold' : 'Switzer-Regular',
                  fontSize: 14,
                }}>
                Transfer Bank
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {!isLoading && (selectedMethod === 'VA' || selectedMethod === 'MANUAL_BANK') ? (
        <View
          style={{
            paddingBottom: 70,
            borderWidth: showBankError ? 1.5 : 0,
            borderColor: '#D32F2F',
            borderRadius: 14,
            padding: showBankError ? 10 : 0,
          }}>
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
            <Search size={20} color="#A9A9A9" />
            <TextInput
              placeholder={'Nama bank'}
              placeholderTextColor="#A9A9A9"
              style={{ flex: 1, marginLeft: 10, fontFamily: 'Switzer-Regular', fontSize: 15 }}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                if (selectedMethod !== 'MANUAL_BANK') {
                  debouncedSearch(text);
                }
              }}
            />
          </View>

          {selectedMethod === 'MANUAL_BANK' && isLoadingManualBanks ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : null}
          {selectedMethod === 'MANUAL_BANK' && manualBanksError ? (
            <Text style={{ color: '#D32F2F', marginBottom: 12, fontFamily: 'Switzer-Regular' }}>
              Gagal memuat metode transfer. Silakan coba lagi.
            </Text>
          ) : null}
          {displayedBanks.map((item) => {
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
                  {selectedMethod === 'MANUAL_BANK' && item.logoUrl ? (
                    <Image
                      source={{ uri: item.logoUrl || undefined }}
                      style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                    />
                  ) : selectedMethod === 'MANUAL_BANK' ? (
                    <Text style={{ color: '#13C8C8', fontFamily: 'Switzer-Bold', fontSize: 18 }}>
                      {item.shortName || item.code}
                    </Text>
                  ) : (
                    <Image
                      source={{ uri: item?.logoUrl ?? undefined }}
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                        borderRadius: 8,
                      }}
                    />
                  )}
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
                  <CheckCircle2 size={24} color="#FFF" fill="#3B82F6" strokeWidth={1} />
                ) : (
                  <Circle size={24} color="#525252" />
                )}
              </TouchableOpacity>
            );
          })}
          {displayedBanks.length === 0 &&
          (selectedMethod === 'MANUAL_BANK'
            ? !isLoadingManualBanks && !manualBanksError
            : !isLoadingVAMethods && !vaBanksError) ? (
            <Text
              style={{
                color: '#666',
                fontFamily: 'Switzer-Regular',
                fontSize: 16,
                paddingVertical: 16,
                textAlign: 'center',
              }}>
              {t('bankList.noBanksAvailable')}
            </Text>
          ) : null}
          {showBankError ? (
            <Text
              style={{
                color: '#D32F2F',
                marginTop: 4,
                fontFamily: 'Switzer-Regular',
              }}>
              Wajib diisi.
            </Text>
          ) : null}
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
