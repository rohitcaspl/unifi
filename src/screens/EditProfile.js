import CloseIcon from '@assets/icons/close.svg';
import Button from '@components/Button/Button';
import CustomText from '@components/CustomText';
import InputPhone from '@components/InputPhone';
import Layout from '@components/Layout';
import TextField from '@components/TextField';
import UploadImageModal from '@components/UploadImageModal';
import DeleteAccountModal from '@features/deleteAccountModal';
import EditProfileConfimationModal from '@features/editProfileConfimationModal';
import CustomHeaderRight from '@navigation/components/CustomHeaderRight';
import colors from '@theme/colors';

import { useHeaderHeight } from '@react-navigation/elements';
import { defaultUserImg } from '@shared/helpers/userHelpers';
import { emailValidation } from '@shared/helpers/validations';
import { useAuthContext } from 'context/AuthContext';
import { useRef, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const EditProfil = () => {
  const { userData: user } = useAuthContext();

  const headerHeight = useHeaderHeight();

  const [isOpen, setIsOpen] = useState(false);

  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  const phoneRef = useRef(null);

  const defaultValues = {
    full_name: user.data?.data?.full_name,
    email: user.data?.data?.email,
    phone: user.data?.data?.mobile,
    country: {
      label: user?.data?.data?.country,
    },
    image: { uri: user.data?.data?.image?.url || '' },
  };

  const [isDeleteAccountModalOpen, setOpenDeleteAccountModal] = useState(false);

  const methods = useForm({
    mode: 'onChange',
    defaultValues,
  });
  const {
    control,
    getValues,
    formState: { dirtyFields, isValid },
  } = methods;

  return (
    <Layout
      title={'Edit Profile'}
      disableBack={isOpen}
      backdrop={isOpen}
      headerLeftIcon={<CloseIcon style={styles.backIcon} />}
      headerLeftStyle={styles.headerLeft}
      headerRight={
        <CustomHeaderRight onPress={() => setOpenDeleteAccountModal(true)}>
          <View style={styles.headerRightInner}>
            <CustomText size={12} bold>
              Delete my account
            </CustomText>
          </View>
        </CustomHeaderRight>
      }
    >
      <KeyboardAvoidingView
        style={styles.flex}
        keyboardShouldPersistTaps='handled'
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={headerHeight}
      >
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.flex}>
            <View style={styles.mb}>
              <View style={styles.photoContainer}>
                <Controller
                  control={control}
                  name='image'
                  render={() => (
                    <Image
                      resizeMode='cover'
                      source={{
                        uri: getValues('image').uri || defaultUserImg,
                      }}
                      style={[styles.image, styles.mb]}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => {
                    setIsOpen(true);
                  }}
                >
                  <CustomText size={14} bold style={styles.editText}>
                    Edit photo
                  </CustomText>
                </TouchableOpacity>
              </View>

              <View style={styles.mb}>
                <TextField
                  name='full_name'
                  control={control}
                  validations={{
                    required: 'Name can not be an empty value',
                  }}
                  placeholder='Full Name'
                  label='Full name'
                  showEdited
                />
              </View>
              <View style={styles.mb}>
                <TextField
                  name='email'
                  validations={{
                    maxLength: {
                      value: 256,
                      message: 'Email is to long',
                    },
                    pattern: {
                      value: emailValidation,
                      message: 'Wrong email format',
                    },
                    required: 'Email can not be an empty value',
                  }}
                  control={control}
                  placeholder='Email'
                  label='Email'
                  showEdited
                />
              </View>
              <View style={styles.mb}>
                <InputPhone
                  control={control}
                  phoneRef={phoneRef}
                  name={'phone'}
                  showEdited
                  placeholder={'Phone Number'}
                />
              </View>
            </View>
          </View>
          <View style={styles.heightSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View>
        <View style={styles.saveButtonContainer}>
          <Button
            text='Save changes'
            disabled={!isValid || Object.keys(dirtyFields).length === 0}
            onPress={() => setConfirmModalVisible(true)}
            customStyle={
              !isValid || Object.keys(dirtyFields).length === 0
                ? styles.disabledSaveButton
                : {}
            }
            customTextStyle={
              !isValid || Object.keys(dirtyFields).length === 0
                ? styles.disabledSaveButtonText
                : {}
            }
          />
        </View>
      </View>

      <Controller
        control={control}
        name='image'
        render={({ field: { onChange } }) => (
          <UploadImageModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            imageData={getValues('image')}
            setImageData={onChange}
            hasDelete
          />
        )}
      />
      <FormProvider {...methods}>
        <EditProfileConfimationModal
          isOpen={isConfirmModalVisible}
          setOpen={setConfirmModalVisible}
        />
      </FormProvider>

      <DeleteAccountModal
        open={isDeleteAccountModalOpen}
        setOpen={setOpenDeleteAccountModal}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  flex: {
    flex: 1,
  },

  headerRightInner: {
    borderColor: colors.borderGray,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    height: 34,
    paddingHorizontal: 16,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  changedFormValueStyle: {
    backgroundColor: colors.lightYellow,
    borderRadius: 10,
  },
  changedFormValueBorderStyle: {
    borderWidth: 1,
    borderColor: colors.yellow,
  },

  invalidFormValue: {
    borderRadius: 10,
  },
  invalidFormValueBorderStyle: {
    borderWidth: 1,
    borderColor: colors.error,
  },

  mb: {
    marginBottom: 24,
  },

  wrapper: { flex: 1 },

  photoContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },

  editText: {
    color: colors.orange,
  },

  disabledSaveButton: {
    backgroundColor: colors.white,
    borderColor: colors.borderGray,
    borderWidth: 1,
  },
  disabledSaveButtonText: {
    color: colors.borderGray,
  },
  saveButtonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  heightSpacer: {
    height: 30,
  },
  backIcon: {
    color: colors.orange,
  },

  headerLeft: {
    width: Dimensions.get('window').width * 0.5,
  },
});

export default EditProfil;
