import Button from '@components/Button/Button';
import Layout from '@components/Layout';
import InputPhone from '@components/InputPhone';
import PhoneNumberNotFound from '@components/PhoneNumberNotFound';
import formatPhoneNumberObject from '@shared/helpers/formatPhoneNumberObject';
import CustomText from '@components/CustomText';
import colors from '@theme/colors';
import Logo from '@assets/logo.svg';
import CloseIcon from '@assets/icons/close.svg';
import ModalComponent from '@components/ModalComponent';
import useSendOtp from 'hooks/useSendOtp';
import usePhoneNumberPermission from '@shared/hooks/usePhoneNumberPermission';
import {
  StyleSheet,
  Platform,
  View,
  KeyboardAvoidingView,
  Pressable,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
// import { getPhoneNumber } from 'react-native-device-info';

const Login = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [autofillNumber, setAutofillNumber] = useState('');

  const { mutateAsync: sendOtp, isLoading: isSendingOtp } = useSendOtp({
    onSuccess: () => {
      navigation.navigate('Verify', {
        phoneNumber: getValues('phone'),
        ...formatPhoneNumberObject(
          getValues('phone'),
          phoneRef.current.getCountryCode(),
        ),
      });
    },
    onError: err => {
      err.response?.data?.status === 425
        ? setIsErrorModalOpen(true)
        : setIsOpen(true);
    },
  });
  const { isPhoneNumberGranted, checkPhoneNumberPermission } =
    usePhoneNumberPermission();

  const phoneRef = useRef(null);
  const navigation = useNavigation();
  const defaultValues = { phone: '' };

  const onSubmit = data => {
    const countryCode = phoneRef.current.getCountryCode();
    try {
      sendOtp(formatPhoneNumberObject(data.phone, countryCode));
    } finally {
    }
  };

  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { isValid },
    reset,
  } = useForm({ defaultValues, mode: 'onChange' });

  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     !isPhoneNumberGranted
  //       ? checkPhoneNumberPermission()
  //       : getPhoneNumber().then(res => {
  //           setAutofillNumber(res);
  //           setValue('phone', res);
  //           reset({ phone: res });
  //         });
  //   }
  // }, [isPhoneNumberGranted, checkPhoneNumberPermission, setValue, reset]);

  return (
    <Layout isLogin>
      <Pressable onPress={() => Keyboard.dismiss()} accessible={false}>
        <KeyboardAvoidingView behavior='padding'>
          <View style={styles.flexContainer}>
            <View style={styles.dummy} />
            <View style={styles.logoContainer}>
              <Logo />
            </View>
            <View style={styles.loginContainer}>
              <CustomText bold size={24} style={styles.title}>
             LOGIN
              </CustomText>
              <InputPhone
                control={control}
                name={'phone'}
                phoneRef={phoneRef}
                autofillValue={autofillNumber}
                placeholder={'Phone number'}
              />
              <Button
                disabled={!isValid || isSendingOtp}
                onPress={handleSubmit(onSubmit)}
                text={isValid ? 'Start' : 'Login'}
                customStyle={styles.mt}
              />

              {isOpen ? (
                <PhoneNumberNotFound
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  phoneNumber={getValues('phone')}
                  onSecondaryPress={() => {
                    navigation.navigate('Support');
                    setIsOpen(false);
                  }}
                  onPrimaryPress={() => setIsOpen(false)}
                />
              ) : null}
            </View>
            {Platform.OS === 'android' ? (
              <View style={styles.bellowKeyboard} />
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Pressable>

      <ModalComponent
        isOpen={isErrorModalOpen}
        setIsOpen={setIsErrorModalOpen}
        title='Error'
        topText='You just tried to login. Please wait for 1 minute and try again.'
        onPrimaryPress={() => setIsErrorModalOpen(false)}
        primaryButtonText='Ok'
        icon={<CloseIcon style={styles.closeIcon} />}
      />
    </Layout>
  );
};

export default Login;

const styles = StyleSheet.create({
  title: {
    marginTop: 32,
    marginBottom: 16,
  },

  mt: {
    marginTop: 20,
  },

  dummy: {
    flex: 1,
  },

  bellowKeyboard: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: colors.white,
    height: '40%',
    width: '100%',
    bottom: '-40%',
  },

  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  flexContainer: {
    height: '100%',
    justifyContent: 'space-around',
  },

  loginContainer: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: 32,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    zIndex: 2,
  },
  closeIcon: {
    color: colors.black,
  },
});
