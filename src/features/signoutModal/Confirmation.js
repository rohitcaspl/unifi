import PropTypes from 'prop-types';

import colors from '@theme/colors';
import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';

import { StyleSheet, View, TouchableOpacity } from 'react-native';
import CloseIcon from '@assets/icons/close.svg';

const Confirmation = ({ data, onConfirm, onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <CustomText bold size={22}>
          {data.title}
        </CustomText>
      </View>

      <CustomText size={16} style={styles.message} textAlign='center'>
        {data.message}
      </CustomText>

      <View style={styles.buttonsContainer}>
        <Button
          text={data.decline}
          onPress={() => onClose()}
          secondary
          customStyle={styles.button}
        />
        <Button
          text={data.confirm}
          onPress={() => onConfirm()}
          customStyle={styles.button}
          warning
        />
      </View>
      <TouchableOpacity style={styles.close} onPress={() => onClose()}>
        <CloseIcon width={15} height={15} style={styles.closeIcon} />
      </TouchableOpacity>
    </View>
  );
};

Confirmation.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    confirm: PropTypes.string.isRequired,
    decline: PropTypes.string.isRequired,
  }),
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignSelf: 'center',
    width: '100%',
  },

  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  message: {
    marginBottom: 24,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
  },

  decline: {
    backgroundColor: colors.orangeLight,
  },

  close: {
    position: 'absolute',
    top: 28,
    right: 24,
  },
  closeIcon: {
    color: colors.text,
  },
});

export default Confirmation;
