import React, { FC } from 'react';
import { View } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';

const SearchAccountItemSkeleton: FC = () => (
  <Skeleton
    isLoading={true}
    animationType="pulse"
    boneColor="#E5E5E5"
    highlightColor="#F0F0F0"
    containerStyle={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 16,
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E5E5E5',
      backgroundColor: '#FFF',
    }}
    layout={[
      { width: 54, height: 54, borderRadius: 8, marginRight: 16 },
      {
        flex: 1,
        children: [
          { width: '55%', height: 16, borderRadius: 4, marginBottom: 8 },
          { width: '70%', height: 14, borderRadius: 4 },
        ],
      },
    ]}
  />
);

export const SearchAccountListSkeleton: FC = () => (
  <View>
    {Array.from({ length: 5 }).map((_, i) => (
      <SearchAccountItemSkeleton key={i} />
    ))}
  </View>
);
