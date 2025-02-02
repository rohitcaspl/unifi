import colors from '@theme/colors';
import PropTypes, { arrayOf } from 'prop-types';

import { Text, StyleSheet } from 'react-native';

const CustomText = ({
  textAlign,
  bold,
  size,
  style,
  children,
  numOfLines,
  ...props
}) => {
  const textStyle = [
    styles.text,
    bold ? styles.bold : styles.normal,
    style,
    {
      fontSize: size,
      textAlign,
    },
  ];

  return (
    <Text style={textStyle} {...props} numberOfLines={numOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.text,
  },

  normal: {
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
  },

  bold: {
    fontFamily: 'DMSans-Bold',
    fontWeight: '700',
  },
});

CustomText.propTypes = {
  bold: PropTypes.bool,
  size: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, arrayOf(PropTypes.object)]),
  children: PropTypes.node,
  numOfLines: PropTypes.number,
  textAlign: PropTypes.string,
};

export default CustomText;
