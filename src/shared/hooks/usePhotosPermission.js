import { RESULTS } from 'react-native-permissions';
import permissions from '@shared/helpers/permissions';
import { Platform } from 'react-native';
import useAllowGalleryPermission from './useAllowGalleryPermission';

const usePhotosPermission = () => {
  const modalText = {
    title: 'Gallery permission not granted',
    message:
      Platform.OS === 'ios'
        ? 'Everysign needs access to your gallery. Open settings to manually allow access?'
        : 'Everysign needs access to your gallery',
    buttonNegative: 'Cancel',
    buttonPositive: Platform.OS === 'ios' ? 'Open Settings' : 'OK',
  };
  const { checkPermission: checkGalleryPermission, status } =
    useAllowGalleryPermission(permissions.GALLERY, modalText);

  return {
    isGalleryGranted: status === RESULTS.GRANTED,
    checkGalleryPermission,
  };
};

export default usePhotosPermission;
