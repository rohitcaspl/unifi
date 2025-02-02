import ArrowRight from '@assets/icons/arrow-right.svg';
import Location from '@assets/icons/location.svg';
import SignatureIcon from '@assets/icons/signature.svg';
import VideoIcon from '@assets/icons/video-consent.svg';
import Button from '@components/Button/Button';
import CustomSwitch from '@components/CustomSwitch';
import CustomText from '@components/CustomText';
import InputPhone from '@components/InputPhone';
import MediaContainer from '@components/MediaContainer';
import SpinnerModal from '@components/SpinnerModal';
import TextField from '@components/TextField';
import colors from '@theme/colors';
import PropTypes from 'prop-types';

import {
  useCreateDoc,
  useUploadSignature,
  usePostSignature,
} from '@hooks/useUploadSignature';
import { useCreateVideo, useUploadVideo } from '@hooks/useUploadVideo';
import useCameraPermission from '@shared/hooks/useCameraPermission';
import useLocationPermission from '@shared/hooks/useLocationPermission';
import useMicrophonePermission from '@shared/hooks/useMicrophonePermission';
import useSignPdf from '@shared/hooks/useSignPdf';

import { useNavigation } from '@react-navigation/native';
import { LOCATION_VALUES, NEW_SIGNATURE_STEPS } from '@shared/constants';
import { formatFormDate, getCurrentLocation } from '@shared/helpers';
import { addBase64Prefix } from '@shared/helpers/base64';
import { emailValidation } from '@shared/helpers/validations';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaContext } from 'context/MediaContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';
import { useAuthContext } from 'context/AuthContext';

import * as Sentry from '@sentry/react-native';

const SigneeInformation = ({
  imageData,
  onlyVideoConsent,
  subjectMatch,
  pdfData,
  setCurrentStep,
  setNextTitle,
}) => {
  console.log('masterdata',pdfData);
  const { userData } = useAuthContext();
  const [toggleValue, setToggleValue] = useState(onlyVideoConsent ? 2 : 1);
  const [hasPermission, setHasPermission] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [videoId, setVideoId] = useState(null);
  const [shouldShowSpinner, setShouldShowSpinner] = useState(null);

  const phoneRef = useRef(null);
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const buttonsStyle = [
    styles.buttons,
    toggleValue === 2 && thumbnail ? styles.mtLg : styles.mt,
  ];

  const { video, signature } = useMediaContext();
  const { getValues } = useFormContext();

  const defaultValues = {
    name: subjectMatch?.name || '',
    date: new Date(),
    location: '',
    email: getValues('email') || '',
    phone: getValues('phone') || '',
    signature: '',
  };

  const {
    handleSubmit,
    setValue,
    control,
    getValues: getThirdStepValues,
    formState: { isValid },
  } = useForm({ defaultValues, mode: 'onChange' });

  useEffect(() => {
    if (imageData?.user_id) {
      Sentry.setUser({ id: imageData.user_id });
    }
  }, [imageData]);

  useEffect(() => {
    const handleVideo = async () => {
      if (video) {
        try {
          const videoResp = await fetch(video.path);
          const videoData = videoResp.blob();

          const videoSlot = await createVideo();

          await uploadVideo({ url: videoSlot.url, data: videoData });

          setVideoId(videoSlot.id);
        } catch (err) {
          Sentry.captureException(err);
          Alert.alert('Error', `Video upload failed: ${err}`);
        }
      }
    };

    handleVideo();
  }, [video, createVideo, uploadVideo, setVideoId]);

  const { isCameraGranted, checkCameraPermission } = useCameraPermission();
  const { isMicrophoneGranted, checkMicrophonePermission } =
    useMicrophonePermission();
  const { isLocationGranted, checkLocationPermission } =
    useLocationPermission();

  const { handleSignPdf, signedPdf } = useSignPdf();

  const { mutateAsync: createDoc } = useCreateDoc();
  const { mutateAsync: uploadSignature } = useUploadSignature({
    onError: () => setShouldShowSpinner(false),
  });
  const { mutateAsync: postSignature } = usePostSignature({
    onSuccess: () => {
      setShouldShowSpinner(false);
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
      navigation.navigate('SuccessModal', { signedPdf: signedPdf });
    },
    onError: err => {
      console.error(err?.response?.data);
      setShouldShowSpinner(false);
    },
  });

  const { mutateAsync: createVideo } = useCreateVideo();
  const { mutateAsync: uploadVideo, isLoading: isUploadingVideo } =
    useUploadVideo();

  const onSubmit = async () => {
    const signData = {
      ...getThirdStepValues(),
      date: formatFormDate(getThirdStepValues('date')),
      photo: imageData.image_id,
      uri: imageData.uri,
    };

    setShouldShowSpinner(true);
    try {
      const pdf = await handleSignPdf(pdfData, signData);
      await handleUpload(pdf);
    } catch (err) {
      Sentry.captureException(err);
      setShouldShowSpinner(false);
      Alert.alert('Error', `Upload failed ${err}`);
    }
  };

  const handleUpload = useCallback(
    async pdf => {
      const docSlot = await createDoc();

      const pdfUri = Platform.OS === 'ios' ? addBase64Prefix(pdf) : pdf;

      const pdfResp = await fetch(pdfUri);
      const data = await pdfResp.blob();
      await uploadSignature({ url: docSlot.url, data: data });

      const signatureMetadata = {
        user_id: imageData.user_id,
        date: new Date(),
        project_id: pdfData.project_id,
        form_id: `${pdfData.project_id}_${pdfData.form_id}`,
        form_name: pdfData.form_name,
        signed_doc_id: docSlot.id,
        agent_id: userData.data.data._id,
        name: getThirdStepValues('name'),
        phone_number: getThirdStepValues('phone'),
        email: getThirdStepValues('email'),
        signature_type: toggleValue === 1 ? 'image' : 'video',
        photo_id: imageData.image_id,
        video_id: video && toggleValue === 2 && videoId ? videoId : undefined,
      };

      await postSignature(signatureMetadata);
    },
    [
      videoId,
      pdfData,
      getThirdStepValues,
      createDoc,
      uploadSignature,
      postSignature,
      video,
      imageData,
      toggleValue,
      userData,
    ],
  );

  const getUserLocation = async () => {
    !isLocationGranted && checkLocationPermission();
    try {
      const [location] = await getCurrentLocation();

      let value = '';
      Object.keys(location).map(key => {
        if (LOCATION_VALUES.includes(key)) {
          location[key] !== null && (value += `${location[key]}, `);
        }
      });
      value = value.slice(0, -2);
      setValue('location', value);
    } catch (err) {
      Sentry.captureException(err);
      Alert.alert(
        'Error',
        'You need to grant EverySign permissions to access your location to use this',
      );
    }
  };

  useEffect(() => {
    signature && setValue('signature', signature);
  }, [signature, setValue]);

  useEffect(() => {
    if (toggleValue === 2) {
      checkCameraPermission();
      checkMicrophonePermission();

      setHasPermission(isCameraGranted && isMicrophoneGranted);
    }
  }, [
    toggleValue,
    isCameraGranted,
    isMicrophoneGranted,
    checkCameraPermission,
    checkMicrophonePermission,
  ]);

  const handleSetToggleValue = value => {
    setToggleValue(value);
  };

  const generateThumbnail = async value => {
    await createThumbnail({
      url: value,
      timeStamp: 100,
    }).then(res => {
      setThumbnail(res.path);
    });
  };

  useEffect(() => {
    video ? generateThumbnail(video.path) : setThumbnail();
  }, [video]);

  useEffect(() => {
    setNextTitle();
  }, [setNextTitle]);

  useEffect(() => {

      const fields = pdfData.subjects[0]?.pdf_fields || [];
console.log(fields);
      setFormFields(fields);
    
  }, [pdfData]);
  return (
    <>
      <SpinnerModal visible={shouldShowSpinner} />
      <ScrollView style={styles.container}>
        <View>
          <CustomText style={styles.title} size={16}>
            Complete doc
          </CustomText>
          {formFields.map((field, index) => {

if (field.type === "NAME") {

  return (
          <View style={styles.mb}>
            <TextField
              name='name'
              control={control}
              placeholder='Full name'
              validations={{
                required: { value: true, message: 'Please enter a name' },
              }}
            />
          </View>
            );

          } else if (field.type === "LOCATION") {

            return (

          <View style={[styles.mb, styles.location]}>
            <TextField
              name='location'
              control={control}
              placeholder='Location'
              validations={{
                required: { value: true, message: 'Please enter a location' },
              }}
              customStyle={styles.locationInputContainer}
              customInputStyle={styles.locationInput}
            />

            <Pressable onPress={getUserLocation} style={styles.icon}>
              <Location />
            </Pressable>
          </View>
           );

          } else if (field.type === "DATE") {

            return (
          <View style={styles.mb}>
            <View style={styles.input}>
              <CustomText>
                {formatFormDate(getThirdStepValues('date'))}
              </CustomText>
            </View>

            <ArrowRight style={[styles.icon, styles.dateIcon]} />
          </View>
    );

  } else if (field.type === "EMAIL") {

    return (
          <View style={styles.mb}>
            <TextField
              name='email'
              placeholder='Email'
              control={control}
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
                required: {
                  value: true,
                  message: 'Please enter an email',
                },
              }}
            />
          </View>

);

} else if (field.type === "PHONE") {

  return (
          <View style={styles.mb}>
            <InputPhone
              control={control}
              name={'phone'}
              phoneRef={phoneRef}
              placeholder={'Phone number'}
            />
          </View>
          
       );

      } else if (field.type === "SIGNATURE") {

        return (

        <View style={styles.spaceBetween}>
          <View style={styles.mb}>
            <CustomSwitch
              onSelectSwitch={handleSetToggleValue}
              option1='Signature'
              option2='Video consent'
              selectionMode={toggleValue}
              disabled={onlyVideoConsent}
            />
          </View>

          <MediaContainer
            icon={
              toggleValue === 1
                ? !signature && SignatureIcon
                : !thumbnail && VideoIcon
            }
            buttonText={
              toggleValue === 1
                ? signature
                  ? 'Redo'
                  : 'Click to sign'
                : video
                ? 'Retake Video'
                : `Click to record video`
            }
            isSignature={toggleValue === 1}
            onPress={() => {
              if (toggleValue === 1) navigation.navigate('SignatureScreen');
              else if (toggleValue === 2 && hasPermission)
                navigation.navigate('CameraPage');
            }}
            imageUri={
              toggleValue === 1
                ? signature && signature
                : thumbnail && thumbnail
            }
          />

          <View style={buttonsStyle}>
            <Button
              text='Back'
              secondary={true}
              onPress={() => setCurrentStep(NEW_SIGNATURE_STEPS.photo)}
              customStyle={styles.btn}
            />
            <Button
              text='Next'
              disabled={isUploadingVideo || (!signature && !video) || !isValid}
              onPress={handleSubmit(onSubmit)}
              customStyle={styles.btn}
            />
          </View>
        </View>
             );

            } else {
  
              return null;
  
            }
  
          })}
          </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
    borderRadius: 12,
  },

  mb: {
    marginBottom: 24,
  },

  mt: {
    marginTop: 24,
  },

  mtLg: {
    marginTop: 64,
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  input: {
    borderColor: colors.borderGray,
    borderRadius: 10,
    borderWidth: 1,
    height: 52,
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',

    position: 'relative',
  },

  title: { marginBottom: 24 },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  btn: {
    width: '48%',
  },

  location: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationInputContainer: {
    flex: 5,
  },

  locationInput: {
    paddingRight: 40,
  },

  icon: {
    position: 'absolute',
    right: 16,
  },

  dateIcon: {
    top: '35%',
  },
});

SigneeInformation.propTypes = {
  setCurrentStep: PropTypes.func,
  setNextTitle: PropTypes.func,
  onlyVideoConsent: PropTypes.bool,
  pdfData: PropTypes.shape({
    subjects: PropTypes.array,
    url: PropTypes.string,
    form_id: PropTypes.string,
    form_name: PropTypes.string,
    project_id: PropTypes.string,
  }),
  imageData: PropTypes.shape({
    uri: PropTypes.string,
    image_id: PropTypes.string,
    user_id: PropTypes.string,
  }),
  subjectMatch: PropTypes.shape({
    user_id: PropTypes.string,
    photo_id: PropTypes.string,
    photo_url: PropTypes.string,
    last_sign_date: PropTypes.string,
    name: PropTypes.string,
  }),
};

export default SigneeInformation;
