import PropTypes from 'prop-types';

import Button from '@components/Button/Button';
import colors from '@theme/colors';
import SpinnerModal from '@components/SpinnerModal';
import MediaContainer from '@components/MediaContainer';
import PhotoIcon from '@assets/icons/photo.svg';

import {
  useCreatePhoto,
  useUploadPhoto,
  useGetFaceId,
  useNewFaceId,
} from '@hooks/useFaceId';

import { View, StyleSheet, Alert } from 'react-native';
import { NEW_SIGNATURE_STEPS } from '@shared/constants';
import { compressImage } from '@shared/helpers';
import { useEffect } from 'react';

const UploadPhoto = ({
  setCurrentStep,
  setIsOpen,
  imageData,
  setSubjectMatch,
  setImageData,
  setNextTitle,
}) => {
  const { mutateAsync: createPhoto, isLoading: isCreatingPhoto } =
    useCreatePhoto();
  const { mutateAsync: uploadPhoto, isLoading: isUploadingPhoto } =
    useUploadPhoto();
  const { mutateAsync: getFaceId, isLoading: isGettingFaceId } = useGetFaceId();
  const { mutateAsync: newFaceId, isLoading: isCreatingFaceId } =
    useNewFaceId();

  const handleNextStep = async () => {
    try {
      console.log('Starting image resize',imageData.uri);
      const resizedImage = await compressImage({
        source: imageData.uri,
        width: 400,
        base64: true,
      });
      console.log('Image resized successfully');

      const photo = await createPhoto();
      console.log('Photo created', photo);

      const resizedImageResp = await fetch(resizedImage.uri);
      const data = await resizedImageResp.blob();
      console.log('Uploading photo');
      await uploadPhoto({ url: photo.upload_url, data: data });
      console.log('Photo uploaded');

      let faceIDToken = await getFaceId(photo.photo_id);
      if (faceIDToken?.user_id) {
        console.log('Face ID found', faceIDToken);
        setSubjectMatch(faceIDToken);
        setCurrentStep(NEW_SIGNATURE_STEPS.confirm);
      } else {
        console.log('Creating new face ID');
        faceIDToken = await newFaceId(photo.photo_id);
        setCurrentStep(NEW_SIGNATURE_STEPS.signeeInfo);
      }

      setImageData(prev => ({
        ...prev,
        uri: resizedImage.uri,
        image_id: photo.photo_id,
        user_id: faceIDToken.user_id,
      }));
      console.log('Image data updated');
    } catch (err) {
      console.error('Error during photo upload process', err);
      if (err.response) {
        Alert.alert('Error', err.response?.data?.message || err.response?.data);
      } else if (err.message) {
        Alert.alert('Error', err.message);
      } else {
        Alert.alert('Error', err);
      }
    }
  };

  useEffect(() => {
    setNextTitle(NEW_SIGNATURE_STEPS.signeeInfo.title);
  }, [setNextTitle]);

  return (
    <View style={styles.container}>
      <View>
        <MediaContainer
          icon={!imageData.uri && PhotoIcon}
          buttonText={imageData.uri ? 'Retake Image' : 'Add a photo'}
          onPress={() => setIsOpen(true)}
          imageUri={imageData?.uri}
        />
      </View>

      <Button
        text='Next'
        disabled={imageData?.uri ? false : true}
        onPress={handleNextStep}
      />
      {/* <SpinnerModal
        visible={
          isCreatingPhoto ||
          isUploadingPhoto ||
          isGettingFaceId ||
          isCreatingFaceId
        }
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
});

UploadPhoto.propTypes = {
  setCurrentStep: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  imageData: PropTypes.shape({
    uri: PropTypes.string,
    image_id: PropTypes.string,
    user_id: PropTypes.string,
  }),
  setSubjectMatch: PropTypes.func.isRequired,
  setImageData: PropTypes.func.isRequired,
  setNextTitle: PropTypes.func,
};

export default UploadPhoto;
