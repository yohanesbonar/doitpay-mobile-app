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

const HistoryItemSkeleton = () => {
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
      <View style={styles.leftSection}>
        <SkeletonBox width={44} height={44} borderRadius={22} opacity={opacity} />
        <View style={styles.details}>
          <SkeletonBox width="50%" height={14} opacity={opacity} />
          <View style={{ marginTop: 6 }}>
            <SkeletonBox width="70%" height={12} opacity={opacity} />
          </View>
        </View>
      </View>
      <SkeletonBox width={72} height={14} opacity={opacity} />
    </View>
  );
};

export const HistoryListSkeleton = () => (
  <View style={{ paddingTop: 8 }}>
    <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
      <Animated.View
        style={[styles.skeletonBase, { width: 100, height: 20, borderRadius: 4, opacity: 0.4 }]}
      />
    </View>
    {Array.from({ length: 5 }).map((_, i) => (
      <HistoryItemSkeleton key={i} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  details: {
    flex: 1,
    marginLeft: 12,
  },
  skeletonBase: {
    backgroundColor: '#E5E5E5',
  },
});

export default HistoryItemSkeleton;
