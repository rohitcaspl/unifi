import colors from '@theme/colors';
import TextField from '@components/TextField';
import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import useUpdateUser from 'hooks/useUpdateUser';
import { defaultUserImg } from '@shared/helpers/userHelpers';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { useAuthContext } from 'context/AuthContext';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { compressImage } from '@shared/helpers';
import { useNetInfo } from '@react-native-community/netinfo';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import ArrowRight from '@assets/icons/arrow-right.svg';
import PropTypes from 'prop-types';

const EditProfileConfimationModal = ({ isOpen, setOpen }) => {
  const { userData: user, setLoggedIn } = useAuthContext();
  const methods = useFormContext();
  const navigation = useNavigation();

  const phoneRef = useRef(null);
  const toast = useToast();

  const { isConnected } = useNetInfo();
  const {
    control,
    getValues,
    handleSubmit,
    formState: { dirtyFields, defaultValues },
  } = methods;

  const onSubmitSuccess = res => {
    setLoggedIn({
      data: { ...res, token: user.data?.token },
    });
    toast.show('Your changes are saved.', {
      type: 'success',
      animationDuration: 100,
      duration: 2000,
    });
  };

  const onSubmitError = () => {
    Alert.alert('Error', 'Failed to update profile');
  };

  const onSubmitSettled = () => {
    setOpen(false);
    navigation.goBack();
  };

  const { mutateAsync: update, isLoading } = useUpdateUser({
    onSuccess: onSubmitSuccess,
    onError: onSubmitError,
    onSettled: onSubmitSettled,
  });

  const onSubmit = async data => {
    const resizedImage = await compressImage({
      source: getValues('image').uri,
      width: 250,
    });
    let formData = new FormData();

    formData.append('full_name', data.full_name);
    formData.append('email', data.email);
    formData.append('mobile', data.phone);
    formData.append('country', data.country.label);
    formData.append('company_name', user?.data?.data?.company);
    formData.append('user_id', user?.data?.data?._id);
    formData.append('country_code', `+${phoneRef.current?.getCountryCode()}`);
    if (resizedImage) {
      formData.append('image', {
        uri: resizedImage.uri,
        name: data.image.fileName,
        type: 'image/jpg',
      });
    }

    update(formData);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType='fade'
      supportedOrientations={['portrait', 'landscape']}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={() => setOpen(false)}
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
              You will change this information:
            </CustomText>
          </View>

          {'image' in dirtyFields ? (
            <>
              <View style={[styles.dirtyProfileImageHeader, styles.mb]}>
                <CustomText style={styles.profileImageText} size={14}>
                  Profile Image
                </CustomText>
              </View>
              <View style={[styles.dirtyImagesContainer, styles.mb]}>
                <Image
                  resizeMode='cover'
                  source={{
                    uri: defaultValues.image.uri || defaultUserImg,
                  }}
                  style={[styles.image]}
                />
                <ArrowRight />
                <Image
                  resizeMode='cover'
                  source={{
                    uri: getValues('image').uri || defaultUserImg,
                  }}
                  style={[styles.image]}
                />
              </View>
            </>
          ) : null}

          {'full_name' in dirtyFields ? (
            <View style={styles.mb}>
              <TextField
                name='full_name'
                control={control}
                placeholder='Full Name'
                label='Full name'
                disabled
              />
            </View>
          ) : null}
          {'email' in dirtyFields ? (
            <View style={styles.mb}>
              <TextField
                name='email'
                control={control}
                placeholder='Email'
                label='Email'
                disabled
              />
            </View>
          ) : null}
          {'phone' in dirtyFields ? (
            <View style={styles.mb}>
              <TextField
                name='phone'
                control={control}
                placeholder='Phone number'
                disabled
              />
            </View>
          ) : null}
          <View style={styles.buttonContainer}>
            <Button
              text='No, cancel'
              onPress={() => setOpen(false)}
              secondary
            />
            <View style={styles.widthSpacer} />

            <Button
              text='Yes, save'
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || !isConnected}
            />
          </View>
        </Pressable>
      </TouchableOpacity>
    </Modal>
  );
};

export default EditProfileConfimationModal;

EditProfileConfimationModal.propTypes = {
  setOpen: PropTypes.func,
  isOpen: PropTypes.bool,
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  mb: {
    marginBottom: 24,
  },

  widthSpacer: {
    width: 10,
  },

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
  buttonContainer: {
    flexDirection: 'row',
  },
  dirtyImagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dirtyProfileImageHeader: {
    backgroundColor: colors.accentGray,
    height: 42,
    borderRadius: 10,
    justifyContent: 'center',
    paddingLeft: 12,
  },

  profileImageText: {
    color: colors.label,
  },
});
