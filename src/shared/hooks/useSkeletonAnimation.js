import {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const useSkeletonAnimation = () =>
  useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.55, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    ),
  }));

export default useSkeletonAnimation;
