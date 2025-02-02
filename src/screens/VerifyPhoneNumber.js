import PropTypes from 'prop-types';
import Button from '@components/Button/Button';
import Layout from '@components/Layout';
import useVerifyOtp from 'hooks/useVerifyOtp';
import CustomText from '@components/CustomText';
import OTPInput from '@components/OTPInput';
import useSendOtp from '@hooks/useSendOtp';
import { useHeaderHeight } from '@react-navigation/elements';

import {
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'context/AuthContext';
import LockIcon from '@assets/icons/lock.svg';

const digits = 4;
const height = Dimensions.get('window').height;

const VerifyPhoneNumber = ({ route }) => {
  const [value, setValue] = useState('');
  const [isTimedOut, setIsTimedOut] = useState(true);
  const [counter, setCounter] = useState(60);
  const [error, setError] = useState('');

  const headerHeight = useHeaderHeight();

  const { country, mobile, phone } = route.params;
  const { setLoggedIn } = useAuthContext();
  const { mutateAsync: verifyOtp, isLoading: isVerifyingOtp } = useVerifyOtp({
    onSuccess: data => setLoggedIn(data),
    onError: err => {
      if (err.response?.data?.status === 403)
        setError('This OTP has expired. Please try again.');
    },
  });

  const { mutateAsync: sendOtp } = useSendOtp({
    onError: err => {
      err.response?.data?.status === 425 && setIsTimedOut(true);
    },
  });

  const handleOnPress = () => {
    try {
      setIsTimedOut(true);
      sendOtp({ phone, mobile, country });
    } catch {}
  };

  const handleVerifyOtp = () => {
    try {
      verifyOtp({ country, phone, otp: value });
    } catch {}
  };

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
    <Layout title='Enter OTP'>
      <Pressable
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={styles.flex}
      >
        <KeyboardAvoidingView
          style={styles.wrapper}
          behavior={'padding'}
          keyboardVerticalOffset={headerHeight + 40}
        >
          <View style={styles.flex}>
            <View style={styles.message}>
              <View style={styles.lockIconContainer}>
                <LockIcon width={height * 0.08} height={height * 0.08} />
              </View>
              <CustomText bold size={height * 0.026} textAlign='center'>
                Enter the one-time password (OTP) sent to your mobile device
              </CustomText>
            </View>

            <OTPInput
              code={value}
              setCode={setValue}
              digits={digits}
              verifyOtp={handleVerifyOtp}
              isVerifyingOtp={isVerifyingOtp}
              error={error}
              setError={setError}
            />
          </View>
          <View>
            <Button
              disabled={isTimedOut}
              text={isTimedOut ? `Wait ${counter} seconds` : 'Resend'}
              onPress={handleOnPress}
              secondary
            />
          </View>
        </KeyboardAvoidingView>
      </Pressable>
    </Layout>
  );
};

VerifyPhoneNumber.propTypes = {
  route: PropTypes.object,
};

export default VerifyPhoneNumber;

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingHorizontal: 16 },

  info: { textAlign: 'center', marginBottom: 16 },

  message: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  lockIconContainer: {
    marginBottom: 16,
  },

  smallVerticalPadding: {
    paddingVertical: 10,
  },

  flex: {
    flex: 1,
  },
});
