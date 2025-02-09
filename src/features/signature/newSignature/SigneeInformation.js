/* eslint-disable curly */
/* eslint-disable quotes */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/react-native';
import { getSignee } from '@storage/user';
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
import CustomModalDropdown from '@components/CustomModalDropdown';
import TextField from '@components/TextField';

import colors from '@theme/colors';
import { LOCATION_VALUES, NEW_SIGNATURE_STEPS } from '@shared/constants';
import { formatFormDate, getCurrentLocation } from '@shared/helpers';
import { addBase64Prefix } from '@shared/helpers/base64';
import { emailValidation } from '@shared/helpers/validations';
import { createThumbnail } from 'react-native-create-thumbnail';
import { useQueryClient } from '@tanstack/react-query';
import { useMediaContext } from 'context/MediaContext';
import { useAuthContext } from 'context/AuthContext';

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

const SigneeInformation = ({
  imageData,
  onlyVideoConsent,
  subjectMatch,
  pdfData,
  setCurrentStep,
  setNextTitle,
}) => {  console.log('mydata',pdfData);
  const { userData } = useAuthContext();
  const [toggleValue, setToggleValue] = useState(onlyVideoConsent ? 2 : 1);
  const { isCameraGranted, checkCameraPermission } = useCameraPermission();
  const [hasPermission, setHasPermission] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [mobile, setMobile] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const { mutateAsync: createVideo } = useCreateVideo();
  const [shouldShowSpinner, setShouldShowSpinner] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const { isMicrophoneGranted, checkMicrophonePermission } =
    useMicrophonePermission();
  
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

  const phoneRef = useRef(null);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { mutateAsync: createDoc } = useCreateDoc();
  const { video, signature } = useMediaContext();
  const { getValues } = useFormContext();
  const { mutateAsync: uploadSignature } = useUploadSignature({
    onError: () => setShouldShowSpinner(false),
  });
  const { mutateAsync: postSignature } = usePostSignature({
    onSuccess: () => {
      setShouldShowSpinner(false);
      queryClient.invalidateQueries({ queryKey: ['signatures'] });
      console.log("damns its done");
      navigation.navigate('SuccessModal', { signedPdf: signedPdf });
    },
    onError: err => {
      console.error(err?.response?.data);
      setShouldShowSpinner(false);
    },
  });
  const { isLocationGranted, checkLocationPermission } =
    useLocationPermission();
    const { handleSignPdf, signedPdf } = useSignPdf();
  // Dynamically initialize default values for NAME fields
  const defaultValues = formFields.reduce((acc, field, index) => {
    if (field.type === "NAME") {
      acc[`name_${index}`] = subjectMatch?.name || '';
    }
    return acc;
  }, {
    date: new Date(),
    location: '',
    email: getValues('email') || '',
    phone: getValues('phone') || '',
    signature: '',
  });

  const {
    handleSubmit,
    setValue,
    control,
    getValues: getThirdStepValues,
    formState: { isValid },
  } = useForm({ defaultValues, mode: 'onChange' });
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
      const fetchSigneeData = async () => {
        const signeeData = await getSignee();
        if (signeeData?.mobile) {
          setMobile(signeeData.mobile);
        }
      };
  
      fetchSigneeData();
    }, []);
    useEffect(() => {
      if (pdfData?.form_type === 'multiple_subject' && pdfData?.subjects) {
        const options = pdfData.subjects.map(subject => ({
          label: subject.title,
          value: subject.title,
        }));
        setSubjectOptions(options);
        setSelectedSubject(options.length > 0 ? options[0].value : null);
      } else if (pdfData?.form_type === 'single_subject' && pdfData?.subjects) {
        // For single_subject, directly set the form fields without requiring subject selection
        setFormFields(pdfData.subjects[0].pdf_fields);
      }
    }, [pdfData]);
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
  const { mutateAsync: uploadVideo, isLoading: isUploadingVideo } =
    useUploadVideo();
  useEffect(() => {
    if (selectedSubject) {
      const subjectData = pdfData.subjects.find(sub => sub.title === selectedSubject);
      setFormFields(subjectData ? subjectData.pdf_fields : []);
    }
  }, [selectedSubject, pdfData]);
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
  
    const onSubmit = async () => {
      const formValues = getThirdStepValues();
      
    
      // Dynamically construct the signData object
      const signData = {
        project_id: pdfData.project_id,
        form_id: `${pdfData.project_id}_${pdfData.form_id}`,
        form_name: pdfData.form_name,
        signed_doc_id: '', // Populated later
        agentId: userData.data.data._id,
        formType: pdfData.form_type,
        users: [
          {
            user_id: imageData.user_id,
            text: {},
            signature_type: toggleValue === 1 ? 'image' : 'video',
          
            photo_id: imageData.image_id,
            name: {}, // Use standardized keys (firstName, middleName, lastName)
            phone_number: mobile, // Key renamed to phone_number
            email: formValues.email,
            date: new Date().toISOString(),
            ...(toggleValue === 2 && videoId && { video_id: videoId }),
          },
        ],
      };
    
      // Populate NAME fields using standardized keys
      formFields.forEach((field, index) => {
        if (field.type === "NAME") {
          const fieldName = `name_${index}`;
          const fieldValue = formValues[fieldName];
    
          if (field.formats) {
            // Map to standardized keys based on the field's format
            if (field.formats.first_name) {
              signData.users[0].name.firstName = fieldValue;
            }
            if (field.formats.middle_name) {
              signData.users[0].name.middleName = fieldValue;
            }
            if (field.formats.last_name) {
              signData.users[0].name.lastName = fieldValue;
            }
          }
        } else if (field.type === "TEXT") {
          const fieldName = `text_${index}`;
          signData.users[0].text[field.name] = formValues[fieldName];
        }
      });
    
      setShouldShowSpinner(true);
      try {
        const pdf = await handleSignPdf(pdfData, signData, imageData.uri,  signature );
        await handleUpload(pdf, signData);
      } catch (err) {
        Sentry.captureException(err);
        setShouldShowSpinner(false);
        Alert.alert('Error', `Upload failed: ${err}`);
      }
    };
  const handleUpload = useCallback(
    async (pdf, signData) => {
      const docSlot = await createDoc();
      const pdfUri = Platform.OS === 'ios' ? addBase64Prefix(pdf) : pdf;
      const pdfResp = await fetch(pdfUri);
      const data = await pdfResp.blob();
      await uploadSignature({ url: docSlot.url, data: data });

      // Update signData with the signed_doc_id
      signData.signed_doc_id = docSlot.id;
      await postSignature(signData);
    },
    [createDoc, uploadSignature, postSignature],
  );

  return (
    <>
      <SpinnerModal visible={shouldShowSpinner} />
      <ScrollView style={styles.container}>
        <View>
          <CustomText style={styles.title} size={16}>
            Complete doc
          </CustomText>
          {pdfData.form_type === 'multiple_subject' && (
      <View style={styles.wrapper}>
        <CustomModalDropdown
          label={selectedSubject || 'Select Subject'}
          options={subjectOptions}
          onSelect={setSelectedSubject}
          selected={selectedSubject}
        />
      </View>
    )}
   {formFields.map((field, index) => {
  if (field.type === "NAME") {
    const fieldName = `name_${index}`;
    return (
      <View key={`name-${index}`} style={styles.mb}>
        <TextField
          name={fieldName}
          control={control}
          placeholder={field.name || "Enter a name"}
          validations={{
            required: { value: true, message: "Please enter a name" },
          }}
        />
      </View>
              );
            } else if (field.type === "TEXT") {
              const fieldName = `text_${index}`;
              return (
                <View key={`text-${index}`} style={styles.mb}>
                  <TextField
                    name={fieldName}
                    control={control}
                    placeholder={field.name || 'Enter text'}
                    validations={{
                      required: { value: true, message: 'Please enter text' },
                    }}
                  />
                </View>
              );
            } else if (field.type === "LOCATION") {
              return (
                <View key={`location-${index}`} style={[styles.mb, styles.location]}>
                  <TextField
                    name="location"
                    control={control}
                    placeholder="Location"
                    validations={{
                      required: { value: true, message: 'Please enter a location' },
                    }}
                  />
                  <Pressable onPress={getUserLocation} style={styles.icon}>
                    <Location />
                  </Pressable>
                </View>
              );
            } else if (field.type === "DATE") {
              return (
                <View style={styles.mb} key={`date-${index}`}>
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
                <View className={styles.mb} key={`email-${index}`}>
                  <TextField
                    name="email"
                    placeholder="Email"
                    control={control}
                    validations={{
                      maxLength: {
                        value: 256,
                        message: 'Email is too long',
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
                <View className={styles.mb} key={`phone-${index}`}>
                  <InputPhone
                    control={control}
                    name="phone"
                    phoneRef={phoneRef}
                    placeholder="Phone number"
                  />
                </View>
              );
            } else if (field.type === "SIGNATURE") {
              return (
                <View style={styles.spaceBetween} key={`signature-${index}`}>
                  <View style={styles.mb}>
                    <CustomSwitch
                      onSelectSwitch={setToggleValue}
                      option1="Signature"
                      option2="Video consent"
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
                        : 'Click to record video'
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
                </View>
              );
            } else {
              return null;
            }
          })}
          <View style={styles.buttons}>
            <Button
              text="Back"
              secondary={true}
              onPress={() => setCurrentStep(NEW_SIGNATURE_STEPS.photo)}
              customStyle={styles.btn}
            />
            <Button
              text="Next"
              disabled={isUploadingVideo || (!signature && !video) || !isValid}
              onPress={handleSubmit(onSubmit)}
              customStyle={styles.btn}
            />
          </View>
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
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: '#FFF9E6',
    borderBottomColor: 'black',
    marginHorizontal: 10,
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