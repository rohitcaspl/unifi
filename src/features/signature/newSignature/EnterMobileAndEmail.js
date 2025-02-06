/* eslint-disable jsx-quotes */
/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';

import Button from '@components/Button/Button';
import InputPhone from '@components/InputPhone';
import colors from '@theme/colors';
import TextField from '@components/TextField';

import useSendOtp from '@hooks/useSendOtp';
import { setSignee } from 'storage/user';
import { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { NEW_SIGNATURE_STEPS } from '@shared/constants';
import { useForm } from 'react-hook-form';
import { emailValidation } from '@shared/helpers/validations';
import { useHeaderHeight } from '@react-navigation/elements';

const EnterMobileAndEmail = ({
  setCurrentStep,
  setSessionId,
  setNextTitle,
}) => {
  const phoneRef = useRef(null);

  useEffect(() => {
    setNextTitle(NEW_SIGNATURE_STEPS.verify.title);
  }, [setNextTitle]);

  const { mutateAsync: sendOtp, isLoading } = useSendOtp(
    {
      onSuccess: async (res) => {
        const mobile = getValues('phone');
       console.log('datamat', mobile);
        await setSignee({ mobile });
        setSessionId(res.data.session_id);
        setCurrentStep(NEW_SIGNATURE_STEPS.verify);
      },
      onError: () => {
        Alert.alert('Error', 'Error message');
      },
    },
    true,
  );

  const {
    handleSubmit,
    control,
    getValues,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });

  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight + 40}
      behavior={'padding'}
      style={styles.container}
    >
      <Pressable
        onPress={() => Keyboard.dismiss()}
        accessible={false}
        style={styles.pressable}
      >
        <View style={styles.wrapper}>
          <View>
            <View style={styles.mb}>
              <InputPhone
                control={control}
                name={'phone'}
                phoneRef={phoneRef}
                placeholder={'Phone number'}
              />
            </View>

            <TextField
              name='email'
              control={control}
              placeholder='Email'
              customStyle={styles.email}
              validations={{
                maxLength: {
                  value: 256,
                  message: 'Email is to long',
                },
                pattern: {
                  value: emailValidation,
                  message: 'Wrong email format',
                },
              }}
            />
          </View>

          <Button
            text='Next'
            onPress={handleSubmit(() =>
              sendOtp({
                mobile: getValues('phone'),
                ...(getValues('email') && { email: getValues('email') }),
              })
            )}
            
            disabled={!isValid || isLoading}
            customStyle={styles.button}
          />
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  wrapper: {
    backgroundColor: colors.white,
    flex: 1,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,

    justifyContent: 'space-between',
  },

  pressable: {
    height: '100%',
  },

  mb: {
    marginBottom: 24,
  },

  button: {
    width: 160,
    alignSelf: 'flex-end',
  },
});

EnterMobileAndEmail.propTypes = {
  setCurrentStep: PropTypes.func,
  setSessionId: PropTypes.func,
  setNextTitle: PropTypes.func,
};

export default EnterMobileAndEmail;
