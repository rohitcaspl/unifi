import PropTypes from 'prop-types';
import colors from '@theme/colors';

import CustomText from '@components/CustomText';
import { View, StyleSheet } from 'react-native';

const SignatureDetailsItem = ({ value, placeholder }) => (
  <View style={styles.container}>
    <CustomText size={14} style={styles.placeholderText}>
      {placeholder}
    </CustomText>
    <CustomText size={14}>{value}</CustomText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundGray,
    justifyContent: 'center',
    borderRadius: 10,
    padding: 12,
  },
  placeholderText: {
    color: colors.label,
    paddingBottom: 4,
  },
});

SignatureDetailsItem.propTypes = {
  value: PropTypes.string,
  placeholder: PropTypes.string,
};

export default SignatureDetailsItem;
