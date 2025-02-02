import CustomText from '@components/CustomText';
import colors from '@theme/colors';
import PropTypes from 'prop-types';

import { Pressable, StyleSheet } from 'react-native';

const Button = ({
  text,
  onPress,
  disabled,
  secondary,
  customStyle,
  transparent,
  icon,
  warning,
  textSize,
  customTextStyle,
}) => {
  const buttonStyle = [
    styles.button,
    disabled
      ? styles.disabled
      : secondary || warning
      ? styles.secondary
      : styles.primary,
    transparent && styles.transparent,
    customStyle,
  ];
  const textStyle = [warning && styles.warningText, customTextStyle];
  return (
    <Pressable disabled={disabled} style={buttonStyle} onPress={onPress}>
      {icon !== undefined && icon}
      <CustomText bold size={textSize || 16} style={textStyle}>
        {text}
      </CustomText>
    </Pressable>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  customStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  transparent: PropTypes.bool,
  icon: PropTypes.any,
  secondary: PropTypes.bool,
  warning: PropTypes.bool,
  textSize: PropTypes.number,
  customTextStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.object),
  ]),
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    width: '100%',
    flexShrink: 1,
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.black,
    textAlign: 'center',
  },

  primary: {
    backgroundColor: colors.yellow,
  },

  secondary: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderGray,
  },

  disabled: {
    backgroundColor: colors.borderGray,
    color: colors.textLightGray,
  },

  transparent: {
    backgroundColor: colors.white,
  },

  warningText: {
    color: colors.error,
  },
});
