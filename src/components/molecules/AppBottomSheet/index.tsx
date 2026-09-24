import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const OPEN_DURATION = 260;
const CLOSE_DURATION = 200;
const DRAG_CLOSE_THRESHOLD = 80;

interface AppBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  sheetStyle?: StyleProp<ViewStyle>;
}

export const AppBottomSheet = ({
  isVisible,
  onClose,
  children,
  sheetStyle,
}: AppBottomSheetProps) => {
  const insets = useSafeAreaInsets();
  const [isMounted, setIsMounted] = useState(false);

  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const sheetHeightRef = useRef(SCREEN_HEIGHT);
  const hasAnimatedInRef = useRef(false);

  const animateOut = useCallback(
    (notifyParent: boolean) => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: sheetHeightRef.current,
          duration: CLOSE_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: CLOSE_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsMounted(false);
        if (notifyParent) {
          onClose();
        }
      });
    },
    [backdropOpacity, onClose, translateY],
  );

  const closeRef = useRef(animateOut);
  closeRef.current = animateOut;

  useEffect(() => {
    if (isVisible) {
      hasAnimatedInRef.current = false;
      translateY.setValue(SCREEN_HEIGHT);
      backdropOpacity.setValue(0);
      setIsMounted(true);
      return;
    }

    if (isMounted) {
      animateOut(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  const handleSheetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (!height) {
        return;
      }

      sheetHeightRef.current = height;

      if (hasAnimatedInRef.current) {
        return;
      }
      hasAnimatedInRef.current = true;

      translateY.setValue(height);
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: OPEN_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: OPEN_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [backdropOpacity, translateY],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > DRAG_CLOSE_THRESHOLD) {
          closeRef.current(true);
          return;
        }

        Animated.spring(translateY, {
          toValue: 0,
          bounciness: 0,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <Modal
      visible={isMounted}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => closeRef.current(true)}>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdropOpacity }]}>
          <Pressable
            style={[StyleSheet.absoluteFill, styles.backdrop]}
            onPress={() => closeRef.current(true)}
          />
        </Animated.View>

        <Animated.View
          onLayout={handleSheetLayout}
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 16), transform: [{ translateY }] },
            sheetStyle,
          ]}>
          <View style={styles.handleArea} {...panResponder.panHandlers}>
            <View style={styles.handleIndicator} />
          </View>

          {isMounted ? children : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleArea: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E5E5',
  },
});
