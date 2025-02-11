import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { launchImageLibrary } from 'react-native-image-picker';

const useAllowGalleryPermission = (permission, modalText) => {
  const [status, setStatus] = useState(null);

  const requestPermission = async () => {
    let permissionType;

    if (Platform.OS === 'android') {
      permissionType = Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    } else {
      permissionType = PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    try {
      const req = await request(permissionType);
      setStatus(req);

      if (req === RESULTS.BLOCKED) {
        Alert.alert(
          modalText.title,
          'Permission is blocked. Please allow it in settings.',
          [
            {
              text: modalText.buttonNegative || 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Go to Settings',
              onPress: openSettings,
            },
          ],
          { cancelable: true },
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
    }
  };

  const checkPermission = async () => {
    let permissionType;

    if (Platform.OS === 'android') {
      permissionType = Platform.Version >= 33
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
    } else {
      permissionType = PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    try {
      const result = await check(permissionType);
      setStatus(result);

      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert('This feature is not available on this device.');
          break;

        case RESULTS.BLOCKED:
          Alert.alert(
            modalText.title,
            modalText.body,
            [
              {
                text: modalText.buttonNegative || 'Cancel',
                style: 'cancel',
              },
              {
                text: modalText.buttonPositive || 'Go to Settings',
                onPress: openSettings,
              },
            ],
            { cancelable: true },
          );
          break;

        case RESULTS.DENIED:
          await requestPermission();
          break;

        case RESULTS.GRANTED:
          break;

        default:
          console.warn('Unhandled permission status:', result);
          break;
      }
    } catch (error) {
      console.error('Permission check error:', error);
    }
  };

  const openGallery = () => {
    if (status !== RESULTS.GRANTED) {
      Alert.alert('Permission Required', 'Please enable gallery access in settings.');
      return;
    }

    launchImageLibrary({ mediaType: 'photo', includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        console.log('Selected Image:', response.assets[0]);
      }
    });
  };

  return {
    checkPermission,
    requestPermission,
    openGallery,
    status,
  };
};

export default useAllowGalleryPermission;
