import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import colors from '@theme/colors';
import CustomText from '@components/CustomText';

const InputError = ({ message }) => {
  return (
    <CustomText size={12} style={styles.error}>
      {message}
    </CustomText>
  );
};

InputError.propTypes = {
  message: PropTypes.string,
};

const styles = StyleSheet.create({
  error: {
    color: colors.error,
    position: 'absolute',
    bottom: -16,
    left: 4,
  },
});

export default InputError;
