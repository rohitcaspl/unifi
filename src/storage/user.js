import AsyncStorage from '@react-native-async-storage/async-storage';

const userKey = 'user';

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
