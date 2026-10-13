import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

export interface WheelPickerItem {
  label: string;
  value: number;
}

interface WheelPickerProps {
  data: WheelPickerItem[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  visibleCount?: number;
  itemHeight?: number;
  style?: StyleProp<ViewStyle>;
}

export const WheelPicker = ({
  data,
  selectedValue,
  onValueChange,
  visibleCount = 5,
  itemHeight = 40,
  style,
}: WheelPickerProps) => {
  const listRef = useRef<FlatList<WheelPickerItem>>(null);

  const height = itemHeight * visibleCount;
  const verticalPadding = (height - itemHeight) / 2;

  const selectedIndex = useMemo(() => {
    const index = data.findIndex((item) => item.value === selectedValue);
    return index >= 0 ? index : 0;
  }, [data, selectedValue]);

  const initialIndexRef = useRef(selectedIndex);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    if (selectedIndex !== activeIndex) {
      setActiveIndex(selectedIndex);
      listRef.current?.scrollToOffset({ offset: selectedIndex * itemHeight, animated: false });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  const indexFromOffset = useCallback(
    (offsetY: number) => {
      const index = Math.round(offsetY / itemHeight);
      return Math.min(Math.max(index, 0), data.length - 1);
    },
    [data.length, itemHeight],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = indexFromOffset(event.nativeEvent.contentOffset.y);
      setActiveIndex((current) => (current === index ? current : index));
    },
    [indexFromOffset],
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const index = indexFromOffset(event.nativeEvent.contentOffset.y);
      setActiveIndex(index);

      const item = data[index];
      if (item && item.value !== selectedValue) {
        onValueChange(item.value);
      }
    },
    [data, indexFromOffset, onValueChange, selectedValue],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<WheelPickerItem> | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: WheelPickerItem; index: number }) => (
      <View style={[styles.item, { height: itemHeight }]}>
        <Text
          style={[styles.itemText, index === activeIndex ? styles.activeText : styles.idleText]}>
          {item.label}
        </Text>
      </View>
    ),
    [activeIndex, itemHeight],
  );

  return (
    <View style={[{ height }, style]}>
      <View
        pointerEvents="none"
        style={[styles.selectionBand, { top: verticalPadding, height: itemHeight }]}
      />

      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => String(item.value)}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
        initialScrollIndex={initialIndexRef.current}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        disableIntervalMomentum
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: verticalPadding }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  selectionBand: {
    position: 'absolute',
    left: 4,
    right: 4,
    borderRadius: 12,
    backgroundColor: '#EFEFEF',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 18,
    fontFamily: 'Switzer-Semibold',
  },
  activeText: {
    color: '#1A1A1A',
  },
  idleText: {
    color: '#BDBDBD',
  },
});
