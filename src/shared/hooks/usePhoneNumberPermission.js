import permissions from '@shared/helpers/permissions';

import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import { check, request, RESULTS } from 'react-native-permissions';

const usePhoneNumberPermission = () => {
  const OsVer = Platform.constants.Release;
  const [status, setStatus] = useState();

  const checkPhoneNumberPermission = useCallback(async () => {
    check(
      OsVer >= 11 ? permissions.PHONE_NUMBERS : permissions.PHONE_STATE,
    ).then(result => {
      switch (result) {
        case RESULTS.BLOCKED:
          break;

        case RESULTS.DENIED:
          request(
            OsVer >= 11 ? permissions.PHONE_NUMBERS : permissions.PHONE_STATE,
          ).then(res => setStatus(res));
          break;

        case RESULTS.GRANTED:
          setStatus(result);
          break;
      }
    });
  }, [OsVer]);

  return {
    isPhoneNumberGranted: status === RESULTS.GRANTED,
    checkPhoneNumberPermission,
  };
};
export default usePhoneNumberPermission;
