import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import colors from '@theme/colors';
import PropTypes from 'prop-types';

import { Modal, StyleSheet, View } from 'react-native';

const PhoneNumberNotFound = ({
  phoneNumber,
  isOpen,
  setIsOpen,
  onSecondaryPress,
  onPrimaryPress,
}) => {
  return (
    <Modal
      statusBarTranslucent
      visible={isOpen}
      animationType='fade'
      onRequestClose={() => setIsOpen(false)}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={[styles.centeredView, styles.backdrop]}>
        <View style={styles.modal}>
          <View style={styles.mb}>
            <CustomText bold size={20} textAlign={'center'}>
              Account not found
            </CustomText>
          </View>

          <View style={styles.mb}>
            <CustomText size={16} style={styles.mb} textAlign={'center'}>
              Your mobile number{' '}
              <CustomText style={styles.phoneNumber}>{phoneNumber}</CustomText>{' '}
              is not linked to any EverySign account.
            </CustomText>

            <CustomText style={styles.additional} textAlign={'center'}>
              Try another phone number or contact your Doc Manager.
            </CustomText>
          </View>

          <View style={styles.buttons}>
            <Button
              text='Support'
              onPress={onSecondaryPress}
              customStyle={styles.button}
              secondary
            />
            <Button
              text='Ok'
              onPress={onPrimaryPress}
              customStyle={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backdrop: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.transparentBlack,
  },

  modal: {
    width: '90%',
    padding: 16,
    borderRadius: 12,

    justifyContent: 'space-between',

    backgroundColor: colors.white,
  },

  phoneNumber: { color: colors.orange },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  button: {
    width: '48%',
  },

  additional: {
    color: colors.additionalInfo,
  },

  mb: { marginBottom: 16 },

  mbLg: { marginBottom: 48 },

  mr: { marginRight: 8 },
});

PhoneNumberNotFound.propTypes = {
  phoneNumber: PropTypes.string,
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  onSecondaryPress: PropTypes.func,
  onPrimaryPress: PropTypes.func,
};

export default PhoneNumberNotFound;
