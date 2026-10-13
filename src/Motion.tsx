import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) setReduced(value); }).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => { active = false; subscription.remove(); };
  }, []);
  return reduced;
}

export function Entrance({ children, trigger, style, delay = 0 }: { children: React.ReactNode; trigger?: string; style?: StyleProp<ViewStyle>; delay?: number }) {
  const progress = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    progress.stopAnimation();
    if (reduced) { progress.setValue(1); return; }
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: 380, delay, easing: Easing.out(Easing.cubic), useNativeDriver: Platform.OS !== 'web', isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [trigger, reduced, delay, progress]);
  return <Animated.View style={[style, { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>{children}</Animated.View>;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export function MotionPressable({ style, onPressIn, onPressOut, ...props }: PressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const [pressed, setPressed] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => () => scale.stopAnimation(), [scale]);
  function animate(value: number) {
    if (reduced) return;
    Animated.spring(scale, { toValue: value, stiffness: 420, damping: 24, mass: 0.7, useNativeDriver: Platform.OS !== 'web' }).start();
  }
  return <AnimatedPressable {...props} onPressIn={event => { setPressed(true); animate(0.97); onPressIn?.(event); }} onPressOut={event => { setPressed(false); animate(1); onPressOut?.(event); }} style={[typeof style === 'function' ? style({ pressed }) : style, { transform: [{ scale }] }]} />;
}

export function Floating({ children }: { children: React.ReactNode }) {
  const value = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { value.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(value, { toValue: 1, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web', isInteraction: false }),
      Animated.timing(value, { toValue: 0, duration: 2800, easing: Easing.inOut(Easing.sin), useNativeDriver: Platform.OS !== 'web', isInteraction: false }),
    ]));
    loop.start(); return () => loop.stop();
  }, [reduced, value]);
  return <Animated.View style={{ transform: [{ translateY: value.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }] }}>{children}</Animated.View>;
}
