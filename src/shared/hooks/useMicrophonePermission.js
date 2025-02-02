import { Platform } from 'react-native';
import { RESULTS } from 'react-native-permissions';

import permissions from '@shared/helpers/permissions';
import useAllowPermission from './useAllowPermission';

const useMicrophonePermission = () => {
  const modalText = {
    title: 'Microphone permission not granted',
    message:
      Platform.OS === 'ios'
        ? 'Everysign needs access to your microphone. Open settings to manually allow access?'
        : 'Everysign needs access to your microphone',
    buttonNegative: 'Cancel',
    buttonPositive: Platform.OS === 'ios' ? 'Open Settings' : 'OK',
  };

  const { checkPermission: checkMicrophonePermission, status } =
    useAllowPermission(permissions.MICROPHONE, modalText);

  return {
    isMicrophoneGranted: status === RESULTS.GRANTED,
    checkMicrophonePermission,
  };
};
export default useMicrophonePermission;
