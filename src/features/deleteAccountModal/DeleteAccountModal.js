import colors from '@theme/colors';
import PropTypes from 'prop-types';
import {
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import CustomText from '@components/CustomText';
import Button from '@components/Button/Button';
import CloseIcon from '@assets/icons/close.svg';
import { useToast } from 'react-native-toast-notifications';

const DeleteAccountModal = ({ open, setOpen }) => {
  const toast = useToast();
  const onClose = () => {
    setOpen(false);
  };
  const onDeleteAccount = () => {
    setOpen(false);
    toast.show(
      'You requested your account to be deleted. This may take a while.',
      {
        type: 'success',
        animationDuration: 100,
        duration: 3000,
      },
    );
  };
  return (
    <Modal
      visible={open}
      transparent={true}
      animationType='fade'
      onRequestClose={() => onClose()}
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={() => onClose()}
        activeOpacity={1}
      >
        <Pressable style={styles.modal}>
          <View style={styles.mb}>
            <CustomText size={20} textAlign='center' bold>
              Are you sure?
            </CustomText>
          </View>
          <View style={styles.mb}>
            <CustomText size={16} textAlign='center'>
              Are you sure you want to delete your account?
            </CustomText>
          </View>
          <View style={styles.mb}>
            <CustomText size={14} textAlign='center' style={styles.subTitle}>
              All of your work will be transferred to another Doc Manager.
            </CustomText>
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              text='Yes, delete'
              onPress={() => onDeleteAccount()}
              secondary
              warning
            />
            <View style={styles.widthSpacer} />

            <Button text='No, cancel' onPress={() => setOpen(false)} />
          </View>
          <TouchableOpacity style={styles.close} onPress={() => onClose()}>
            <CloseIcon width={15} height={15} style={styles.closeIcon} />
          </TouchableOpacity>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

DeleteAccountModal.propTypes = {
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
    padding: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  widthSpacer: {
    width: 8,
  },
  mb: {
    marginBottom: 24,
  },
  close: {
    position: 'absolute',
    top: 28,
    right: 24,
  },
  subTitle: {
    color: colors.label,
  },

  closeIcon: {
    height: 30,
    color: colors.text,
  },
});

export default DeleteAccountModal;
