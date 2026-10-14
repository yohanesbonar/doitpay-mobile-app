import React, { useEffect, useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';

const DRAG_ACTIVATION_DISTANCE = 8;
const EDGE_INSET = 8;

type FloatingDebugButtonProps = {
  visible: boolean;
  onPress: () => void;
  onLongPress: () => void;
};

export default function FloatingDebugButton({
  visible,
  onPress,
  onLongPress,
}: FloatingDebugButtonProps) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const initialPosition = {
    x: Math.max(EDGE_INSET, windowWidth - 108),
    y: Math.max(EDGE_INSET, windowHeight - 180),
  };
  const positionRef = useRef(initialPosition);
  const dragStartRef = useRef(initialPosition);
  const buttonSizeRef = useRef({ width: 100, height: 40 });
  const hasMeasuredButtonRef = useRef(false);
  const windowSizeRef = useRef({ width: windowWidth, height: windowHeight });
  const left = useRef(new Animated.Value(initialPosition.x)).current;
  const top = useRef(new Animated.Value(initialPosition.y)).current;
  windowSizeRef.current = { width: windowWidth, height: windowHeight };

  const clampPosition = (x: number, y: number) => {
    const maxX = Math.max(
      EDGE_INSET,
      windowSizeRef.current.width - buttonSizeRef.current.width - EDGE_INSET,
    );
    const maxY = Math.max(
      EDGE_INSET,
      windowSizeRef.current.height - buttonSizeRef.current.height - EDGE_INSET,
    );

    return {
      x: Math.max(EDGE_INSET, Math.min(x, maxX)),
      y: Math.max(EDGE_INSET, Math.min(y, maxY)),
    };
  };

  const updatePosition = (x: number, y: number) => {
    const nextPosition = clampPosition(x, y);
    positionRef.current = nextPosition;
    left.setValue(nextPosition.x);
    top.setValue(nextPosition.y);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        Math.hypot(gestureState.dx, gestureState.dy) > DRAG_ACTIVATION_DISTANCE,
      onPanResponderGrant: () => {
        dragStartRef.current = positionRef.current;
      },
      onPanResponderMove: (_, gestureState) => {
        updatePosition(
          dragStartRef.current.x + gestureState.dx,
          dragStartRef.current.y + gestureState.dy,
        );
      },
      onPanResponderRelease: () => {
        const { width } = windowSizeRef.current;
        const buttonWidth = buttonSizeRef.current.width;
        const currentPosition = positionRef.current;
        const maxX = Math.max(EDGE_INSET, width - buttonWidth - EDGE_INSET);
        const snapX =
          currentPosition.x + buttonWidth / 2 < width / 2 ? EDGE_INSET : maxX;
        const snapY = clampPosition(currentPosition.x, currentPosition.y).y;

        positionRef.current = { x: snapX, y: snapY };
        Animated.parallel([
          Animated.spring(left, {
            toValue: snapX,
            useNativeDriver: false,
            speed: 20,
            bounciness: 5,
          }),
          Animated.spring(top, {
            toValue: snapY,
            useNativeDriver: false,
            speed: 20,
            bounciness: 5,
          }),
        ]).start();
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  useEffect(() => {
    updatePosition(positionRef.current.x, positionRef.current.y);
  }, [windowWidth, windowHeight]);

  if (!visible) return null;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        buttonSizeRef.current = { width, height };

        if (!hasMeasuredButtonRef.current) {
          hasMeasuredButtonRef.current = true;
          updatePosition(
            windowSizeRef.current.width - width - EDGE_INSET,
            positionRef.current.y,
          );
          return;
        }

        updatePosition(positionRef.current.x, positionRef.current.y);
      }}
      style={[styles.position, { left, top }]}>
      <Pressable
        style={styles.button}
        onPress={onPress}
        onLongPress={onLongPress}>
        <Text style={styles.buttonText}>🌐 Log</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    zIndex: 99999,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
