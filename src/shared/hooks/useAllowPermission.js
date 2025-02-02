import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';
import {
  request,
  check,
  RESULTS,
  openSettings,
} from 'react-native-permissions';

const useAllowPermission = (permission, modalText) => {
  const [status, setStatus] = useState();

  const requestPermission = useCallback(async () => {
    const req = await request(permission, { ...modalText }); //second parameter is android exclusive
    setStatus(req);
    if (req === RESULTS.BLOCKED && Platform.OS === 'android') {
      Alert.alert(
        modalText.title,
        'Allow permission in settings',
        [
          {
            text: modalText.buttonNegative,
            style: 'cancel',
          },
          {
            text: 'Go to Settings',
            onPress: () => {
              openSettings();
            },
          },
        ],
        { cancelable: true },
      );
    }
  }, [permission, modalText]);

  const checkPermission = useCallback(async () => {
    check(permission).then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          Alert.alert(
            'This feature is not available (on this device / in this context)',
          );
          break;

        case RESULTS.BLOCKED:
          if (Platform.OS === 'ios') {
            Alert.alert(
              modalText.title,
              modalText.body,
              [
                {
                  text: modalText.buttonNegative,
                  style: 'cancel',
                },
                {
                  text: modalText.buttonPositive,
                  onPress: () => {
                    openSettings();
                  },
                },
              ],
              { cancelable: true },
            );
          }
          break;

        case RESULTS.DENIED:
          requestPermission();
          break;

        case RESULTS.GRANTED:
          setStatus(result);
          break;
      }
    });
  }, [permission, requestPermission, modalText]);

  return {
    checkPermission,
    status,
  };
};

export default useAllowPermission;
