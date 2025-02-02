import { Linking } from 'react-native';

export const initiatePhoneCall = phoneNumber => {
  Linking.openURL(`tel:${phoneNumber}`);
};
