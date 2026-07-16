import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

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

const NotificationItemSkeleton = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    ).start();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <SkeletonBox width={44} height={44} borderRadius={22} opacity={opacity} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <SkeletonBox width="55%" height={14} opacity={opacity} />
          <SkeletonBox width={36} height={12} opacity={opacity} />
        </View>
        <SkeletonBox width="85%" height={12} borderRadius={4} opacity={opacity} />
        <View style={{ marginTop: 4 }}>
          <SkeletonBox width="65%" height={12} borderRadius={4} opacity={opacity} />
        </View>
      </View>
    </View>
  );
};

export const NotificationListSkeleton = () => (
  <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <NotificationItemSkeleton key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
  },
  skeletonBase: {
    backgroundColor: '#E5E5E5',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

export default NotificationItemSkeleton;
