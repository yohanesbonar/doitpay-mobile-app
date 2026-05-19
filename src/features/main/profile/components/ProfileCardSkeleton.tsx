import React, { FC } from 'react';
import Skeleton from 'react-native-reanimated-skeleton';

export const ProfileCardSkeleton: FC = () => {
  return (
    <Skeleton
      isLoading={true}
      animationType="pulse"
      boneColor="#E5E5E5"
      highlightColor="#F0F0F0"
      containerStyle={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        marginBottom: 16,
      }}
      layout={[
        { width: 56, height: 56, borderRadius: 28, marginRight: 12 },
        {
          flex: 1,
          children: [
            { width: '60%', height: 18, borderRadius: 4, marginBottom: 6 },
            { width: '40%', height: 14, borderRadius: 4 },
          ],
        },
        { width: 80, height: 24, borderRadius: 8 },
      ]}
    />
  );
};
