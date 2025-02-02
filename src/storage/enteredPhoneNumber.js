import AsyncStorage from '@react-native-async-storage/async-storage';

const phoneEnteredKey = 'phone:phone-entered';

export const getPhoneFromStorage = async () =>
  AsyncStorage.getItem(phoneEnteredKey);

export const setPhoneToStorage = phoneNumber =>
  AsyncStorage.setItem(phoneEnteredKey, phoneNumber);
