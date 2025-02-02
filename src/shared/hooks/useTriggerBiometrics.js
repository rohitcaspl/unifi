import { getUser } from '@storage/user';
import { useCallback, useEffect, useState } from 'react';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import SplashScreen from 'react-native-splash-screen';

const useTriggerBiometrics = () => {
  useEffect(() => {
    getUser().then(user => {
      if (user) {
        setDismissed(true);
        triggerBiometrics();
      }
      setTimeout(() => {
        SplashScreen.hide();
      }, 150);
    });
  }, [triggerBiometrics]);

  const [dismissed, setDismissed] = useState(false);

  const onResult = useCallback(success => {
    if (success) {
      setDismissed(false);
    } else setDismissed(true);
  }, []);

  const triggerBiometrics = useCallback(async () => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true,
    });

    rnBiometrics?.isSensorAvailable().then(resultObject => {
      const { available, biometryType } = resultObject;

      if (available && biometryType === BiometryTypes.TouchID) {
        rnBiometrics
          .simplePrompt({
            promptMessage: 'Sign in with Touch ID',
            fallbackPromptMessage: 'Failed to sign in with Touch ID',
          })
          .then(result => {
            const { success } = result;

            onResult(success);
          });
      } else if (available && biometryType === BiometryTypes.FaceID) {
        rnBiometrics
          .simplePrompt({
            promptMessage: 'Sign in with Face ID',
            fallbackPromptMessage: 'Failed to sign in with Face ID',
          })
          .then(result => {
            const { success } = result;

            onResult(success);
          });
      } else if (available && biometryType === BiometryTypes.Biometrics) {
        rnBiometrics
          .simplePrompt({ promptMessage: 'Sign in with Biometrics' })
          .then(result => {
            const { success } = result;

            onResult(success);
          });
      } else {
        onResult(true);
      }
    });
  }, [onResult]);

  return { dismissed, triggerBiometrics };
};

export default useTriggerBiometrics;
