import colors from '@theme/colors';
import PropTypes from 'prop-types';
import { Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import Confirmation from './Confirmation';
import { confirmation } from './constants';
import { useAuthContext } from '../../context/AuthContext';

const SignoutModal = ({ open, setOpen }) => {
  const { setLoggedIn } = useAuthContext();
  const [logoutClicked, setLogoutClicked] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (logoutClicked) setLoggedIn('');
  }, [logoutClicked, setLoggedIn]);

  return (
    <Modal
      visible={open && !logoutClicked}
      transparent={true}
      animationType='fade'
      onRequestClose={() => onClose()}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.modalContainer} onPress={() => onClose()}>
        <Pressable style={styles.modal}>
          <Confirmation
            data={confirmation}
            onConfirm={() => setLogoutClicked(true)}
            onClose={onClose}
          />
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

SignoutModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.transparentBlack,
  },

  modal: {
    width: '100%',
    maxWidth: 400,
    position: 'absolute',
    backgroundColor: colors.white,
    zIndex: 2,
    borderRadius: 24,
  },
});

export default SignoutModal;
