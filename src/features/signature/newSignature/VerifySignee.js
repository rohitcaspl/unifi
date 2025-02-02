import PropTypes from 'prop-types';

import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import OTPInput from '@components/OTPInput';
import colors from '@theme/colors';

import useSendOtp from '@hooks/useSendOtp';
import useVerifyOtp from '@hooks/useVerifyOtp';

import { useHeaderHeight } from '@react-navigation/elements';
import { NEW_SIGNATURE_STEPS } from '@shared/constants';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const digits = 4;

const VerifySignee = ({
  setCurrentStep,
  session_id,
  setNextTitle,
  setOnlyVideoConsent,
}) => {
  const [value, setValue] = useState('');
  const [isTimedOut, setIsTimedOut] = useState(true);
  const [counter, setCounter] = useState(60);
  const [error, setError] = useState('');

  const headerHeight = useHeaderHeight();

  const { mutateAsync: verifyOtp, isLoading: isVerifyingOtp } = useVerifyOtp(
    {
      onSuccess: () => setCurrentStep(NEW_SIGNATURE_STEPS.photo),
      onError: () => setError('This OTP has expired. Please try again.'),
    },
    true,
  );

  const { mutateAsync: sendOtp } = useSendOtp(
    {
      onError: err => {
        err.response?.data?.status === 425 && setIsTimedOut(true);
      },
    },
    true,
  );

  const { getValues } = useFormContext();

  const handleResend = () => {
    setIsTimedOut(true);
    sendOtp({
      mobile: getValues('phone'),
      ...(getValues('email') && { email: getValues('email') }),
    });
  };

  const handleOnPress = () => {
    verifyOtp({ otp: value, session_id });
  };

  const handleSkip = () => {
    setOnlyVideoConsent(true);
    setCurrentStep(NEW_SIGNATURE_STEPS.photo);
  };

  useEffect(() => {
    setNextTitle(NEW_SIGNATURE_STEPS.photo.title);
  }, [setNextTitle]);

  useEffect(() => {
    let timer;
    if (isTimedOut) {
      timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    }
    if (counter === 0) {
      setIsTimedOut(false);
      setCounter(60);
    }
    return () => clearInterval(timer);
  }, [isTimedOut, counter]);

  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight + 40}
      behavior={'padding'}
      style={styles.keyboardView}
    >
      <Pressable
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={styles.pressable}
      >
        <View style={styles.container}>
          <View>
            <CustomText size={16} style={styles.title}>
              Enter one-time password (OTP)
            </CustomText>
            <OTPInput
              code={value}
              setCode={setValue}
              digits={digits}
              isVerifyingOtp={isVerifyingOtp}
              error={error}
              setError={setError}
            />
            <Pressable onPress={handleResend}>
              <CustomText
                bold
                size={16}
                style={isTimedOut ? styles.disabled : styles.resend}
              >
                {isTimedOut ? `Resend OTP in ${counter}s` : 'Resend OTP'}
              </CustomText>
            </Pressable>
          </View>
          <View style={styles.buttons}>
            <Button
              text='Skip'
              onPress={handleSkip}
              customStyle={styles.button}
              secondary
            />
            <Button
              disabled={value.length !== digits || isVerifyingOtp}
              text='Next'
              onPress={handleOnPress}
              customStyle={styles.button}
            />
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
  },

  pressable: { height: '100%' },

  title: { marginBottom: 24 },

  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  button: {
    width: '48%',
  },

  resend: {
    color: colors.orange,
  },

  disabled: {
    color: colors.textLightGray,
  },
});

VerifySignee.propTypes = {
  session_id: PropTypes.string,
  setCurrentStep: PropTypes.func,
  setOnlyVideoConsent: PropTypes.func,
  setNextTitle: PropTypes.func,
};

export default VerifySignee;
