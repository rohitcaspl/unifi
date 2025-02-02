import { manipulateAsync } from 'expo-image-manipulator';

export const compressImage = async ({
  source,
  width,
  height,
  compress = 0.8,
  base64 = false,
}) => {
  try {
    const response = await manipulateAsync(
      source,
      [{ resize: { width, height } }],
      {
        compress,
        base64,
      },
    );

    return response;
  } catch (error) {
    return null;
  }
};
