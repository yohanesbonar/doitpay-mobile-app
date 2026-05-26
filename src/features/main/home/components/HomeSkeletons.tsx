import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const usePulse = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);
  return opacity;
};

const SkeletonBox = ({
  width,
  height,
  borderRadius = 4,
  opacity,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  opacity: Animated.Value;
}) => (
  <Animated.View
    style={[styles.skeletonBase, { width: width as any, height, borderRadius, opacity }]}
  />
);

export const RecentBeneficiarySkeleton = () => {
  const opacity = usePulse();
  return (
    <View style={styles.beneficiaryRow}>
      {Array.from({ length: 4 }).map((_, i) => (
        <View key={i} style={styles.beneficiaryItem}>
          <SkeletonBox width={50} height={50} borderRadius={25} opacity={opacity} />
          <View style={{ marginTop: 6 }}>
            <SkeletonBox width={40} height={10} opacity={opacity} />
          </View>
        </View>
      ))}
    </View>
  );
};

const ActivityItemSkeleton = ({ opacity }: { opacity: Animated.Value }) => (
  <View style={styles.activityItem}>
    <SkeletonBox width={44} height={44} borderRadius={22} opacity={opacity} />
    <View style={{ flex: 1, marginLeft: 12 }}>
      <SkeletonBox width="55%" height={14} opacity={opacity} />
      <View style={{ marginTop: 6 }}>
        <SkeletonBox width="35%" height={12} opacity={opacity} />
      </View>
    </View>
    <SkeletonBox width={72} height={14} opacity={opacity} />
  </View>
);

export const RecentActivitySkeleton = () => {
  const opacity = usePulse();
  return (
    <View>
      {Array.from({ length: 3 }).map((_, i) => (
        <ActivityItemSkeleton key={i} opacity={opacity} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonBase: {
    backgroundColor: '#E5E5E5',
  },
  beneficiaryRow: {
    flexDirection: 'row',
    gap: 18,
  },
  beneficiaryItem: {
    alignItems: 'center',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 10,
  },
});
