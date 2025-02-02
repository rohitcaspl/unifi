import { Linking } from 'react-native';

export const initiateEmailSend = async emailAddress => {
  Linking.openURL(`mailto:${emailAddress}`);
};
