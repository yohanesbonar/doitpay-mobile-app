import React, { FC } from 'react';
import Skeleton from 'react-native-reanimated-skeleton';

export const KycCardSkeleton: FC = () => {
  return (
    <Skeleton
      isLoading={true}
      animationType="pulse"
      boneColor="#E5E5E5"
      highlightColor="#F0F0F0"
      containerStyle={{
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: 24,
        marginHorizontal: 24,
      }}
      layout={[
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
          children: [
            { width: 80, height: 12, borderRadius: 4 },
            { width: 80, height: 12, borderRadius: 4 },
          ],
        },
        {
          flexDirection: 'row',
          justifyContent: 'space-between',
          children: [
            { width: 130, height: 14, borderRadius: 4 },
            { width: 90, height: 14, borderRadius: 4 },
          ],
        },
      ]}
    />
  );
};
