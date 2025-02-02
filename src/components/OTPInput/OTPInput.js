import PropTypes from 'prop-types';
import colors from '@theme/colors';
import CustomText from '@components/CustomText';

import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  Dimensions,
} from 'react-native';
import { useEffect, useRef } from 'react';

const { width } = Dimensions.get('window');
const boxSize = width * 0.21;
const OTPInput = ({
  code,
  setCode,
  digits,
  verifyOtp,
  isVerifyingOtp,
  error,
  setError,
}) => {
  const otpRef = useRef();
  const boxArray = new Array(digits).fill(0);

  const boxDigit = (_, index) => {
    const emptyInput = '';
    const digit = code[index] || emptyInput;

    let style = [
      index === code.length
        ? [styles.splitBox, styles.focusedBox]
        : styles.splitBox,
    ];
    if (error !== '') style = [styles.splitBox, styles.errorBox];
    return (
      <View style={style} key={index}>
        <CustomText size={24}>{digit}</CustomText>
      </View>
    );
  };

  const handleOnPress = () => {
    otpRef.current.focus();
  };

  useEffect(() => {
    if (code.length === digits && !isVerifyingOtp && error === '') {
      if (verifyOtp) verifyOtp();
    } else if (code.length !== digits && error !== '') {
      setError('');
    }
  }, [code, digits, isVerifyingOtp, verifyOtp, error, setError]);

  return (
    <Pressable style={styles.container} onPress={handleOnPress}>
      <View style={styles.boxContainer}>{boxArray.map(boxDigit)}</View>
      <TextInput
        ref={otpRef}
        onChangeText={setCode}
        value={code}
        maxLength={digits}
        autoFocus
        keyboardType='numeric'
        style={styles.hidden}
      />
      {error ? (
        <View style={styles.errorContainer}>
          <CustomText size={14} style={styles.errorText}>
            {error}
          </CustomText>
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  boxContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  splitBox: {
    borderColor: colors.borderGray,
    borderWidth: 1,
    width: boxSize,
    height: boxSize,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  focusedBox: {
    borderColor: colors.orange,
  },

  hidden: {
    opacity: 0,
    height: Platform.OS === 'ios' ? 20 : 0,
  },

  errorBox: {
    borderColor: colors.error,
    borderWidth: 1,
    width: boxSize,
    height: boxSize,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    backgroundColor: colors.errorBackground,
    width: '100%',
    padding: 16,
    borderRadius: 8,
    height: 50,
  },

  errorText: {
    color: colors.error,
  },
});

OTPInput.propTypes = {
  code: PropTypes.string,
  error: PropTypes.string,
  setCode: PropTypes.func,
  verifyOtp: PropTypes.func,
  setError: PropTypes.func,
  digits: PropTypes.number,
  isVerifyingOtp: PropTypes.bool,
};

export default OTPInput;
