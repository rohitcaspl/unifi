import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  let formattedLocation;

  const location = await Location.getCurrentPositionAsync({});

  if (location) {
    formattedLocation = Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
  }

  return formattedLocation;
};
