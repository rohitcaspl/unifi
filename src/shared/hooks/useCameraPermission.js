import permissions from '@shared/helpers/permissions';
import { Platform } from 'react-native';
import { RESULTS } from 'react-native-permissions';
import useAllowPermission from './useAllowPermission';

const useCameraPermission = () => {
  const modalText = {
    title: 'Camera permission not granted',
    message:
      Platform.OS === 'ios'
        ? 'Everysign needs access to your camera. Open settings to manually allow access?'
        : 'Everysign needs access to your camera',
    buttonNegative: 'Cancel',
    buttonPositive: Platform.OS === 'ios' ? 'Open Settings' : 'OK',
  };

  const { checkPermission: checkCameraPermission, status } = useAllowPermission(
    permissions.CAMERA,
    modalText,
  );

  return {
    isCameraGranted: status === RESULTS.GRANTED,
    checkCameraPermission,
  };
};
export default useCameraPermission;
