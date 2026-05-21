import React, { FC } from 'react';
import { View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

const BeneficiaryItemSkeleton: FC = () => (
  <Skeleton
    isLoading={true}
    animationType="pulse"
    boneColor="#E5E5E5"
    highlightColor="#F0F0F0"
    containerStyle={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: '#FFF',
      borderRadius: 12,
      marginBottom: 11,
      marginTop: 2,
    }}
    layout={[
      { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
      {
        flex: 1,
        children: [
          { width: '55%', height: 16, borderRadius: 4, marginBottom: 6 },
          { width: '35%', height: 12, borderRadius: 4 },
        ],
      },
      { width: 20, height: 20, borderRadius: 4 },
    ]}
  />
);

export const BeneficiaryListSkeleton: FC = () => (
  <View>
    {Array.from({ length: 5 }).map((_, i) => (
      <BeneficiaryItemSkeleton key={i} />
    ))}
  </View>
);
