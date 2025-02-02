import { Platform } from 'react-native';
import { RESULTS } from 'react-native-permissions';

import permissions from '@shared/helpers/permissions';
import useAllowPermission from './useAllowPermission';

const useLocationPermission = () => {
  const modalText = {
    title: 'Location permission not granted',
    message:
      Platform.OS === 'ios'
        ? 'Everysign needs access to your location. Open settings to manually allow access?'
        : 'Everysign needs access to your location',
    buttonNegative: 'Cancel',
    buttonPositive: Platform.OS === 'ios' ? 'Open Settings' : 'OK',
  };

  const { checkPermission: checkLocationPermission, status } =
    useAllowPermission(permissions.LOCATION, modalText);

  return {
    isLocationGranted: status === RESULTS.GRANTED,
    checkLocationPermission,
  };
};
export default useLocationPermission;
