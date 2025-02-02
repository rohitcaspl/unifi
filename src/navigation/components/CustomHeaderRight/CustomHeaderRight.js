import PropTypes from 'prop-types';
import { Pressable } from 'react-native';

const CustomHeaderRight = ({ children, onPress, customStyle, disabled }) => {
  return (
    <Pressable
      disabled={disabled}
      style={customStyle}
      onPress={onPress && onPress}
    >
      {children}
    </Pressable>
  );
};

CustomHeaderRight.propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  customStyle: PropTypes.object,
  disabled: PropTypes.bool,
};

export default CustomHeaderRight;
