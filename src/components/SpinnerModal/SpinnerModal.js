import PropTypes from 'prop-types';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import colors from '@theme/colors';

const SpinnerModal = ({ visible }) => {
  return (
    <Modal visible={visible} transparent statusBarTranslucent>
      <View style={styles.loading}>
        <ActivityIndicator size='large' color={colors.orange} />
      </View>
    </Modal>
  );
};

SpinnerModal.propTypes = { visible: PropTypes.bool };

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.transparentBlack,
    justifyContent: 'center',
  },
});

export default SpinnerModal;
