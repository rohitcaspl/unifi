import { Platform } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';

export default {
  GALLERY:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
  CAMERA:
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  MICROPHONE:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO,
  LOCATION:
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  PHONE_STATE:
    Platform.OS === 'android' && PERMISSIONS.ANDROID.READ_PHONE_STATE,
  PHONE_NUMBERS:
    Platform.OS === 'android' && PERMISSIONS.ANDROID.READ_PHONE_NUMBERS,
};
