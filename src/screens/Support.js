import colors from '@theme/colors';
import Layout from '@components/Layout';
import Button from '@components/Button/Button';
import TextField from '@components/TextField';
import InputPhone from '@components/InputPhone';
import ModalComponent from '@components/ModalComponent';
import CustomText from '@components/CustomText';
import Logo from '@assets/logo.svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm } from 'react-hook-form';

const Support = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = useNavigation();
  const phoneRef = useRef(null);
  const { bottom } = useSafeAreaInsets();

  const defaultValues = {
    fullName: '',
    phone: '',
    message: '',
  };

  const { handleSubmit, control } = useForm({
    defaultValues,
    reValidateMode: 'onChange',
    mode: 'onSubmit',
  });

  const onSubmit = () => {
    setIsOpen(true);
  };

  return (
    <Layout isLogin title='Welcome to EverySign!'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        contentContainerStyle={styles.flex}
      >
        <Pressable
          style={styles.pressable}
          onPress={() => Keyboard.dismiss()}
          accessible={false}
        >
          <View style={styles.logoContainer}>
            <Logo />
          </View>
          <View style={styles.container(bottom)}>
            <CustomText bold size={24} style={styles.mb}>
              Support
            </CustomText>
            <CustomText style={styles.mb}>
              Send a message to EverySign support
            </CustomText>

            <View style={[styles.mb, styles.mt]}>
              <TextField
                name='fullName'
                control={control}
                placeholder='Full name'
                validations={{
                  required: {
                    value: true,
                    message: 'Please enter a full name',
                  },
                }}
              />
            </View>

            <View style={styles.mb}>
              <InputPhone
                control={control}
                name={'phone'}
                phoneRef={phoneRef}
                placeholder='Mobile phone number'
              />
            </View>
            <View style={styles.mb}>
              <TextField
                name='message'
                control={control}
                placeholder='Message'
                validations={{
                  required: {
                    value: true,
                    message: 'Please enter a message',
                  },
                  maxLength: {
                    value: 150,
                    message: 'Message is too long',
                  },
                }}
                multiline
              />
            </View>
            <View style={[styles.buttons, styles.mt]}>
              <Button
                text='Cancel'
                onPress={() => navigation.goBack()}
                customStyle={styles.button}
                secondary
              />
              <Button
                text='Submit'
                onPress={handleSubmit(onSubmit)}
                customStyle={styles.button}
              />
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>

      {isOpen ? (
        <ModalComponent
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title='Message sent!'
          topText='We’ll get back to you with help soon.'
          primaryButtonText='Ok'
          onPrimaryPress={() => navigation.navigate('Login')}
        />
      ) : null}
    </Layout>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  pressable: {
    height: '100%',
    justifyContent: 'flex-end',
  },

  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: bottom => {
    return {
      justifyContent: 'space-evenly',
      padding: 16,
      paddingBottom: bottom ? bottom : 16,
      borderRadius: 12,
      backgroundColor: colors.white,
      shadowColor: colors.containerShadow,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
      elevation: 5,
    };
  },

  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  button: {
    width: '48%',
  },

  mb: { marginBottom: 16 },

  zIndex: { zIndex: 5 },
});

export default Support;
