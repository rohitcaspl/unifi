import useSkeletonAnimation from '@shared/hooks/useSkeletonAnimation';
import colors from '@theme/colors';
import PropTypes from 'prop-types';

import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

const ListSkeleton = ({ height, margin = 16 }) => {
  const animatedStyle = useSkeletonAnimation();

  const cardStyle = [
    {
      height,
      marginHorizontal: margin,
    },
    styles.card,
  ];

  return (
    <View>
      <Animated.View style={[cardStyle, animatedStyle]} />
      <Animated.View style={[cardStyle, animatedStyle]} />
      <Animated.View style={[cardStyle, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.skeletonGray,
    marginVertical: 10,
    borderRadius: 12,
  },
});

ListSkeleton.propTypes = {
  height: PropTypes.number,
  margin: PropTypes.number,
};

export default ListSkeleton;
