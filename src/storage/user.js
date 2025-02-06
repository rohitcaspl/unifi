import AsyncStorage from '@react-native-async-storage/async-storage';

const userKey = 'user';
const signeeKey = 'signee';
const phoneNumberKey = 'phoneNumber';

export const getUser = async () => {
  try {
    const userAsString = await AsyncStorage.getItem(userKey);
    const userObjectParsed = JSON.parse(userAsString);
    return userObjectParsed;
  } catch {
    return null;
  }
};

export const setUser = async user => {
  try {
    await AsyncStorage.setItem(userKey, JSON.stringify(user));
    return true;
  } catch {
    return null;
  }
};

export const getSignee = async () => {
  try {
    const signeeAsString = await AsyncStorage.getItem(signeeKey);
    return signeeAsString ? JSON.parse(signeeAsString) : null;
  } catch {
    return null;
  }
};
export const setSignee = async (signee) => {
  try {
    await AsyncStorage.setItem(signeeKey, JSON.stringify(signee));
    return true;
  } catch {
    return null;
  }
};
export const eraseSignee = async () => {
  try {
    await AsyncStorage.removeItem(signeeKey);
    return true;
  } catch {
    return null;
  }
};

export const getPhoneNumber = async () => {
  try {
    const phoneNumber = await AsyncStorage.getItem(phoneNumberKey);
    return phoneNumber;
  } catch {
    return null;
  }
};
