import colors from '@theme/colors';
import PropTypes from 'prop-types';

import {
  View,
  Modal,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';

import Button from './Button/Button';
import CustomText from './CustomText';

const ModalComponent = ({
  isOpen,
  setIsOpen,
  primaryButtonText,
  secondaryButtonText,
  title,
  bottomText,
  topText,
  onPrimaryPress,
  onSecondaryPress,
  icon: Icon,
}) => {
  return (
    <View>
      <Modal
        animationType='fade'
        transparent={true}
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
        supportedOrientations={['portrait', 'landscape']}
        statusBarTranslucent
      >
        <TouchableOpacity
          style={[styles.centeredView, styles.backdrop]}
          onPress={() => setIsOpen(false)}
        >
          <Pressable style={styles.modal}>
            {Icon ? (
              <View style={styles.titleAndIcon}>
                <CustomText
                  style={styles.title}
                  bold
                  size={20}
                  textAlign='center'
                >
                  {title}
                </CustomText>
                <Pressable style={styles.icon} onPress={() => setIsOpen(false)}>
                  {Icon}
                </Pressable>
              </View>
            ) : (
              <CustomText
                style={styles.title}
                bold
                size={20}
                textAlign='center'
              >
                {title}
              </CustomText>
            )}
            <CustomText size={16} textAlign='center'>
              {topText}
            </CustomText>
            {bottomText ? (
              <CustomText style={styles.bottomText} textAlign='center'>
                {bottomText}
              </CustomText>
            ) : null}
            <View style={styles.buttons}>
              {secondaryButtonText ? (
                <Button
                  secondary
                  customStyle={secondaryButtonText && styles.button}
                  text={secondaryButtonText}
                  onPress={onSecondaryPress}
                />
              ) : null}
              <Button
                customStyle={secondaryButtonText && styles.button}
                text={primaryButtonText}
                onPress={onPrimaryPress}
              />
            </View>
          </Pressable>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

ModalComponent.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  topText: PropTypes.string,
  bottomText: PropTypes.string,
  primaryButtonText: PropTypes.string,
  secondaryButtonText: PropTypes.string,
  title: PropTypes.string,
  onPrimaryPress: PropTypes.func,
  onSecondaryPress: PropTypes.func,
  icon: PropTypes.any,
};

export default ModalComponent;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  backdrop: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.transparentBlack,
  },

  modal: {
    padding: 24,
    borderRadius: 12,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },

  title: {
    marginBottom: 24,
  },

  titleAndIcon: {
    position: 'relative',
  },

  buttons: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexShrink: 0,
  },

  button: {
    width: '48%',
  },

  bottomText: {
    color: colors.label,
    marginTop: 16,
  },

  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
