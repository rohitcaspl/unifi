import CustomText from '@components/CustomText';
import colors from '@theme/colors';
import { View, StyleSheet } from 'react-native';
import CheckIcon from '@assets/icons/check.svg';
import PropTypes from 'prop-types';

const ToastMessageSuccess = ({ toast }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <CheckIcon style={styles.iconStyle} />
        <View style={styles.messageContainer}>
          <CustomText style={styles.text}>{toast.message}</CustomText>
        </View>
      </View>
    </View>
  );
};

export default ToastMessageSuccess;

ToastMessageSuccess.propTypes = {
  toast: PropTypes.object,
};

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    padding: 16,
    backgroundColor: colors.lightGreen,
    borderRadius: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: { color: colors.green },
  iconStyle: {
    color: colors.green,
  },
  messageContainer: {
    paddingHorizontal: 10,
  },
});
