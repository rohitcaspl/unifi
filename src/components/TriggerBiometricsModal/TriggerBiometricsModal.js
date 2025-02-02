import { Modal, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import colors from '@theme/colors';
import Button from '@components/Button/Button';

const TriggerBiometricsModal = ({ open, triggerBiometrics }) => {
  return (
    <Modal
      statusBarTranslucent
      visible={open}
      animationType='none'
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.container}>
        <Button
          text='Login using biometrics'
          onPress={() => {
            triggerBiometrics();
          }}
        />
      </View>
    </Modal>
  );
};

TriggerBiometricsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  triggerBiometrics: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.transparentBlack,
    flex: 1,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '17%',
  },
});

export default TriggerBiometricsModal;
