import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { useTheme } from '../../../theme/ThemeProvider.tsx';

interface BankListSkeletonProps {
  styles: any;
  t: (key: string) => string;
}

export const BankListSkeleton = ({ styles, t }: BankListSkeletonProps) => {
  const { colors } = useTheme();
  return (
    <View style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Skeleton
          containerStyle={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#E0E0E0',
            marginRight: 8,
          }}
          isLoading={false}
        />
        <Skeleton
          containerStyle={{
            width: 100,
            height: 20,
            borderRadius: 4,
            backgroundColor: '#E0E0E0',
          }}
          isLoading={false}
        />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            containerStyle={{
              width: 80,
              height: 80,
              borderRadius: 8,
              backgroundColor: '#E0E0E0',
              marginBottom: 16,
            }}
            isLoading={false}
          />
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Skeleton
          containerStyle={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#E0E0E0',
            marginRight: 8,
          }}
          isLoading={false}
        />
        <Skeleton
          containerStyle={{
            width: 100,
            height: 20,
            borderRadius: 4,
            backgroundColor: '#E0E0E0',
          }}
          isLoading={false}
        />
      </View>
      {[...Array(6)].map((_, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Skeleton
            containerStyle={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: '#E0E0E0',
              marginRight: 8,
            }}
            isLoading={false}
          />
          <Skeleton
            containerStyle={{
              width: '80%',
              height: 40,
              borderRadius: 12,
              backgroundColor: '#E0E0E0',
            }}
            isLoading={false}
          />
        </View>
      ))}
    </View>
  );
};
